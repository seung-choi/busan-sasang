import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as Util from '../util';
import * as ModelInternal from '../model/model';
import * as GltfInternal from '../loader/gltf';
import { PoiElement } from './element';
import { Engine3D } from '../engine';

let engine: Engine3D;
let poiDataList: Record<string, PoiElement> = {};
let poiLine: THREE.LineSegments;
let poiIconGroup: THREE.Group;
let poiTextGroup: THREE.Group;
let poiLineGroup: THREE.Group;
let pointMeshGroup: THREE.Group;
let pointMeshStorage: Record<string, THREE.InstancedMesh> = {};
let iconStorage: Record<string, THREE.SpriteMaterial> = {};
let sharedTextGeometry: THREE.PlaneGeometry;
let poiDummies: THREE.Object3D[] = [];
let bNeedsUpdate: boolean = false;

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // 공용 텍스트 geometry
    sharedTextGeometry = new THREE.PlaneGeometry(1, 1.10, 1, 1);
    sharedTextGeometry.translate(0, 2.0, 0);

    // (sharedTextGeometry.attributes.uv as THREE.BufferAttribute).setY(0, 1.5);
    // (sharedTextGeometry.attributes.uv as THREE.BufferAttribute).setY(1, 1.5);
    // (sharedTextGeometry.attributes.uv as THREE.BufferAttribute).setY(2, -1.0);
    // (sharedTextGeometry.attributes.uv as THREE.BufferAttribute).setY(3, -1.0);
});

/**
 * Engine3D 렌더링 전 이벤트 처리
 */
Event.InternalHandler.addEventListener('onBeforeRender' as never, async (evt: any) => {
    const deltaTime = evt.deltaTime as number;
    // 애니메이션 믹서 업데이트
    const animPoiList = Object.values(poiDataList).filter(poi => poi.Mixer !== undefined);
    animPoiList.forEach(animPoi => animPoi.Mixer?.update(deltaTime));

    // 업데이트가 필요한경우
    if (bNeedsUpdate) {
        bNeedsUpdate = false;
        await updatePoiMesh();
        updatePoiLine();
    }
});

/**
 * Poi 씬그룹 초기화 이벤트 처리
 */
Event.InternalHandler.addEventListener('onPoiSceneGroupCreated' as never, (evt: any) => {
    poiIconGroup = evt.iconGroup as THREE.Group;
    poiTextGroup = evt.textGroup as THREE.Group;
    poiLineGroup = evt.lineGroup as THREE.Group;
    pointMeshGroup = evt.pointMeshGroup as THREE.Group;
});

/**
 * poi 생성 이벤트
 */
Event.InternalHandler.addEventListener('onPoiPlaced' as never, (evt: any) => {
    const data: PoiElement = evt.target as PoiElement;
    poiDataList[data.id] = data;

    bNeedsUpdate = true;
});

/**
 * 층 이동 전 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelBeforeMove' as never, (evt: any) => {
    const floorObjects: Record<string, THREE.Object3D> = evt.floorObjects;

    // 가시화 요소 숨기기
    poiIconGroup.visible = false;
    poiIconGroup.layers.set(Interfaces.CustomLayer.Invisible);

    poiTextGroup.visible = false;
    poiTextGroup.layers.set(Interfaces.CustomLayer.Invisible);

    poiLineGroup.visible = false;
    poiLineGroup.layers.set(Interfaces.CustomLayer.Invisible);

    pointMeshGroup.visible = false;
    pointMeshGroup.layers.set(Interfaces.CustomLayer.Invisible);

    // Poi<=>층별 더미객체 생성
    Object.values(poiDataList).forEach(poi => {

        // 층 객체 찾아 더미 생성 후 부착
        if (floorObjects.hasOwnProperty(poi.FloorId)) {

            const dummy = new THREE.Object3D();
            dummy.name = `${poi.id}.Dummy`;
            dummy.userData['targetPoiElement'] = poi;
            dummy.position.copy(poi.WorldPosition);

            const targetFloor = floorObjects[poi.FloorId];
            targetFloor.attach(dummy);

            poiDummies.push(dummy);
        }
    });
});

/**
 * 층 이동 후 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelAfterMove' as never, (evt: any) => {
    const floorObjects: Record<string, THREE.Object3D> = evt.floorObjects;

    // 이동된 더미객체의 위치값을 poi에 적용시킨다.
    poiDummies.forEach(dummy => {
        const worldPos = new THREE.Vector3();
        dummy.getWorldPosition(worldPos);

        const targetPoi = dummy.userData['targetPoiElement'];
        targetPoi.WorldPosition = worldPos;

        // 원래 층객체로부터 분리
        dummy.parent?.remove(dummy);
    });
    poiDummies = [];

    // poi선, 위치점메시 업데이트
    bNeedsUpdate = true;

    // 가시화 요소 보이기
    poiIconGroup.visible = true;
    poiIconGroup.layers.set(Interfaces.CustomLayer.Default);

    poiTextGroup.visible = true;
    poiTextGroup.layers.set(Interfaces.CustomLayer.Default);

    poiLineGroup.visible = true;
    poiLineGroup.layers.set(Interfaces.CustomLayer.Default);

    pointMeshGroup.visible = true;
    pointMeshGroup.layers.set(Interfaces.CustomLayer.Default);
});

/**
 * 특정층 가시화 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelShow' as never, (evt: any) => {
    const floorId: string = evt.floorId;
    Object.values(poiDataList).forEach(poi => {
        if (poi.FloorId === floorId) {
            poi.Visible = true;
        }
    });

    bNeedsUpdate = true;
});

/**
 * 특정층 숨기기 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelHide' as never, (evt: any) => {
    const floorId: string = evt.floorId;
    Object.values(poiDataList).forEach(poi => {
        if (poi.FloorId === floorId) {
            poi.Visible = false;
        }
    });

    bNeedsUpdate = true;
});

/**
 * 모든층 가시화 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelShowAll' as never, (evt: any) => {

    Object.values(poiDataList).forEach(poi => poi.Visible = true);

    bNeedsUpdate = true;
});

/**
 * 모든층 숨기기 이벤트 처리
 */
Event.InternalHandler.addEventListener('onModelHideAll' as never, (evt: any) => {

    Object.values(poiDataList).forEach(poi => poi.Visible = false);

    bNeedsUpdate = true;
});

/**
 * id에 해당하는 poi가 생성되어 있는지 체크
 * @param id - poi id
 */
function exists(id: string): boolean {
    return poiDataList.hasOwnProperty(id);
}

/**
 * id에 해당하는 poi 데이터 얻기
 * @param id - poi id
 * @returns - poi데이터
 */
function getPoiElement(id: string): PoiElement {
    return poiDataList[id];
}

/**
 * url주소로 아이콘 재질 얻기
 * @param url - 아이콘 url 주소
 */
function getIcon(url: string): THREE.SpriteMaterial {

    if (iconStorage.hasOwnProperty(url) === false) {
        iconStorage[url] = new THREE.SpriteMaterial({
            map: new THREE.TextureLoader().load(url),
            sizeAttenuation: false,
            toneMapped: false,
        });
    }

    return iconStorage[url];
}

/**
 * 텍스트 문자열을 three.js 메시로 생성
 * @param displayText - 표시명 텍스트 문자열
 */
function createTextMesh(displayText: string): THREE.Mesh {
    const textSize = new THREE.Vector2();
    const textMaterial = Util.createTextMaterial(displayText, textSize);
    const textMesh = new THREE.Mesh(sharedTextGeometry, textMaterial);
    textMesh.scale.set(textSize.x * 0.0015, textSize.y * 0.0015, 1);

    return textMesh;
}

/**
 * poi 선 업데이트
 */
function updatePoiLine() {

    // 이전에 생성된 라인 제거
    if (poiLine !== undefined) {
        poiLineGroup.remove(poiLine);
        poiLine.geometry.dispose();
        (poiLine.material as THREE.Material).dispose();
    }

    // 라인 버텍스 수집
    const linePoints: THREE.Vector3[] = [];
    Object.values(poiDataList).forEach(element => {
        if (element.Visible && element.LineVisible) {

            if (element.PointMeshData.animMeshRef !== undefined) {

                // 애니메이션 메시가 있는 경우
                const center = new THREE.Vector3();
                const size = new THREE.Vector3();
                const bounding = new THREE.Box3().setFromObject(element.PointMeshData.animMeshRef);
                bounding.getSize(size);
                bounding.getCenter(center);

                const p0 = center.clone().addScaledVector(new THREE.Vector3(0, 1, 0), size.y * 0.5);
                const p1 = p0.clone().addScaledVector(new THREE.Vector3(0, 1, 0), element.LineHeight);

                linePoints.push(p0, p1);
                
                element.MeshBoundingHeight = p1.y - element.WorldPosition.y;

            } else {

                const bounding = element.PointMeshData.instanceMeshRef?.geometry.boundingBox?.clone();
                const matrix = new THREE.Matrix4().compose(element.WorldPosition, new THREE.Quaternion().setFromEuler(element.Rotation), element.Scale);
                bounding?.applyMatrix4(matrix);

                const center = new THREE.Vector3();
                const size = new THREE.Vector3();
                bounding?.getCenter(center);
                bounding?.getSize(size);

                const p0 = center.clone().addScaledVector(new THREE.Vector3(0, 1, 0), size.y * 0.5);
                const p1 = p0.clone().addScaledVector(new THREE.Vector3(0, 1, 0), element.LineHeight);

                linePoints.push(p0, p1);

                element.MeshBoundingHeight = p1.y - element.WorldPosition.y;;
            }
        }
    });

    // 라인 메시
    const geometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const material = new THREE.LineBasicMaterial({ color: 'red' });
    poiLine = new THREE.LineSegments(geometry, material);
    poiLine.name = '#PoiLine';
    poiLineGroup.add(poiLine);
}

/**
 * poi 위치점 객체 업데이트
 */
async function updatePoiMesh() {
    // 이전에 생성된 위치점 메시 객체들 제거
    Object.values(pointMeshStorage).forEach(mesh => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => {
                (material as any).map?.dispose();
                material.dispose();
            });
        } else {
            (mesh.material as any).map?.dispose();
            mesh.material.dispose();
        }
        pointMeshGroup.remove(mesh);
    });
    pointMeshStorage = {};

    // poi의 모델파일 url기준으로 수집
    const collect: Record<string, PoiElement[]> = {};
    Object.values(poiDataList).forEach(poi => {
        const modelUrl: string = poi.modelUrl as string;
        if (collect.hasOwnProperty(modelUrl) === false)
            collect[modelUrl] = [];

        collect[modelUrl].push(poi);
    });

    // url 기준으로 수집한 정보로 인스턴스 메시 생성
    for (let url in collect) {
        // 정적 객체는 인스턴싱 처리
        const currPoiArray = collect[url];

        const gltfData = await GltfInternal.getGltfWithAnimation(url);
        if (gltfData.animations.length > 0) {
            // 애니메이션 객체는 인스턴싱 처리를 하지않고 개별 생성
            currPoiArray.forEach(poi => {
                // 위치점 메시 데이터에서 애니메이션 메시가 유효하지 않은 경우만 메시 초기화 및 애니메이션 클립 처리 수행
                if (poi.PointMeshData.animMeshRef === undefined) {
                    const clonedScene = gltfData.scene.clone();
                    pointMeshGroup.add(clonedScene); // 씬에 추가
                    poi.PointMeshData.animMeshRef = clonedScene; // poi에 복제된 씬 설정
                    // 애니메이션 믹서
                    const mixer = new THREE.AnimationMixer(poi.PointMeshData.animMeshRef as THREE.Object3D);
                    poi.Mixer = mixer; // poi에 믹서 설정
                    // 애니메이션 클립 처리
                    gltfData.animations.forEach(clip => {
                        const animationName = clip.name;
                        const action = mixer.clipAction(clip);
                        action.loop = THREE.LoopOnce; // 한번 재생후 종료
                        action.clampWhenFinished = true; // 애니메이션 종료후 마지막 상태 유지
                        poi.AnimationActions[animationName] = action; // poi에 처리된 애니메이션 액션 설정
                    });
                }
                // 위치 설정
                poi.PointMeshData.animMeshRef?.position.copy(poi.WorldPosition);
                poi.PointMeshData.animMeshRef?.rotation.copy(poi.Rotation);
                poi.PointMeshData.animMeshRef?.scale.copy(poi.Scale);

                // 레이어 설정
                Util.setObjectLayer(poi.PointMeshData.animMeshRef as THREE.Object3D, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable);
            });

        } else {

            let mergedGeometry: THREE.BufferGeometry | undefined = undefined;
            let mergedMaterial: THREE.Material[] = [];
            if (url === undefined || url === '' || url === 'undefined') {
                // 모델url이 undefined이거나 빈문자열일 경우는 구체사용
                mergedGeometry = new THREE.SphereGeometry(0.1, 32, 32);
                mergedGeometry.addGroup(0, Infinity, 0);
                mergedMaterial.push(new THREE.MeshStandardMaterial({ color: 'red', envMap: engine.GeneratedCubeRenderTarget.texture, envMapIntensity: 0.1 }));
            } else {
                await Util.getMergedGeometry(url).then(data => {
                    mergedGeometry = data.geometry;
                    mergedMaterial = [].concat(data.material as any);
                });
            }

            mergedGeometry?.computeBoundingBox();
            mergedGeometry?.computeBoundingSphere();

            // 인스턴스 메시 생성
            const mesh = new THREE.InstancedMesh(mergedGeometry, mergedMaterial, currPoiArray.length);
            mesh.receiveShadow = true;
            mesh.castShadow = true;

            // 인스턴스 메시 각 요소별 트랜스폼 처리
            const dummy = new THREE.Object3D();
            currPoiArray.forEach((poi, index) => {
                dummy.position.copy(poi.WorldPosition);
                dummy.rotation.copy(poi.PointMeshData.rotation);
                dummy.scale.copy(poi.Visible ? poi.PointMeshData.scale : new THREE.Vector3(0, 0, 0));
                dummy.updateMatrix();

                mesh.setMatrixAt(index, dummy.matrix);

                // poi 위치점 메시 데이터에 연결
                poi.PointMeshData.instanceMeshRef = mesh;
                poi.PointMeshData.instanceIndex = index;
            });
            mesh.instanceMatrix.needsUpdate = true;

            // 씬에 추가
            pointMeshGroup.add(mesh);
            // 위치점 메시 리스트에 추가
            pointMeshStorage[url] = mesh;

            // 레이어 설정
            Util.setObjectLayer(mesh as THREE.Object3D, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable);
        }
    }
}

/**
 * 익스포트용 poi 데이터 얻기
 * @param id - poi id값
 */
function Export(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        return poi.ExportData;
    }
}

/**
 * 모든 poi의 익스포트용 데이터 얻기
 */
function ExportAll() {
    const result: any[] = [];
    Object.values(poiDataList).forEach(poi => result.push(poi.ExportData));
    return result;
}

/**
 * poi 데이터 임포트
 * @param data - 임포트 데이터
 */
function Import(data: Interfaces.PoiImportOption | Interfaces.PoiImportOption[] | string) {

    // 비주얼 리소스 업데이트 없이 이전의 생성 요소 제거
    Clear(false);

    // 파라미터가 문자열이면 object로 전환
    if (typeof data === 'string')
        data = JSON.parse(data);

    // 배열로 전환
    if (Array.isArray(data) === false)
        data = [data as Interfaces.PoiImportOption];

    // 데이터 배열 순회하며 poi 생성
    data.forEach(item => {
        if (exists(item.id)) {
            console.warn(`${item.id} has already exists.`);
            return;
        }

        const iconMaterial = getIcon(item.iconUrl);
        const iconObj = new THREE.Sprite(iconMaterial);
        iconObj.center.set(0.5, 0.0);
        iconObj.scale.setScalar(0.05);
        poiIconGroup.add(iconObj);

        const textMesh = createTextMesh(item.displayText);
        poiTextGroup.add(textMesh);

        // poi element 익스포트시 내보내지는 위치값은 층기준 로컬좌표이므로, 초기 생성을 위해 월드좌표로 변환한다.
        const convertedPosition = ModelInternal.convertFloorLocalToWorld(new THREE.Vector3(item.position.x, item.position.y, item.position.z), item.floorId);

        const element = new PoiElement({
            id: item.id,
            iconUrl: item.iconUrl,
            modelUrl: item.modelUrl,
            displayText: item.displayText,
            property: item.property,
        });
        element.position = new Interfaces.Vector3Custom();
        element.IconObject = iconObj;
        element.TextObject = textMesh;
        element.FloorId = item.floorId;
        element.WorldPosition = convertedPosition;//new THREE.Vector3(item.position.x, item.position.y, item.position.z);
        element.PointMeshData.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
        element.PointMeshData.scale.copy(item.scale);

        poiDataList[item.id] = element;
    });

    // 업데이트
    bNeedsUpdate = true;
}

/**
 * poi 제거
 * @param id - 제거할 poi id값
 */
function Delete(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        poi.dispose();

        delete poiDataList[id];

        bNeedsUpdate = true;
    }
}

/**
 * poi 모두 제거
 */
function Clear(bUpdateVisuals: boolean = true) {
    Object.values(poiDataList).forEach(poi => poi.dispose());
    poiDataList = {};

    if (bUpdateVisuals) {
        bNeedsUpdate = true;
    }
}

/**
 * poi 보기
 * @param id - poi id값
 */
function Show(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        poiDataList[id].Visible = true;

        bNeedsUpdate = true;
    }
}

/**
 * poi 숨기기
 * @param id - poi id값
 */
function Hide(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        poiDataList[id].Visible = false;

        bNeedsUpdate = true;
    }
}

/**
 * 모든 poi 보기
 */
function ShowAll() {
    Object.values(poiDataList).forEach(poi => {
        poi.Visible = true;
    });

    bNeedsUpdate = true;
}

/**
 * 모든 poi 숨기기
 */
function HideAll() {
    Object.values(poiDataList).forEach(poi => {
        poi.Visible = false;
    });

    bNeedsUpdate = true;
}

/**
 * poi 선 보이기
 * @param id - poi id값
 */
function ShowLine(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        poiDataList[id].LineVisible = true;
    }

    updatePoiLine();
}

/**
 * poi 선 숨기기
 * @param id - poi id값
 */
function HideLine(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        poiDataList[id].LineVisible = false;
    }

    updatePoiLine();
}

/**
 * 모든 poi 선 보이기
 */
function ShowAllLine() {
    Object.values(poiDataList).forEach(poi => poi.LineVisible = true);
    updatePoiLine();
}

/**
 * 모든 poi 선 숨기기
 */
function HideAllLine() {
    Object.values(poiDataList).forEach(poi => poi.LineVisible = false);
    updatePoiLine();
}

/**
 * poi 표시명 보이기
 * @param id - poi id값
 */
function ShowDisplayText(id: string) {
    if (poiDataList.hasOwnProperty(id))
        poiDataList[id].TextVisible = true;
}

/**
 * poi 표시명 숨기기
 * @param id - poi id값
 */
function HideDisplayText(id: string) {
    if (poiDataList.hasOwnProperty(id))
        poiDataList[id].TextVisible = false;
}

/**
 * 모든 poi 표시명 보이기
 */
function ShowAllDisplayText() {
    Object.values(poiDataList).forEach(poi => poi.TextVisible = true);
}

/**
 * 모든 poi 표시명 숨기기
 */
function HideAllDisplayText() {
    Object.values(poiDataList).forEach(poi => poi.TextVisible = false);
}

/**
 * poi 표시명 텍스트 변경
 * @param id - 변경할 poi id값
 * @param text - 표시명 텍스트
 */
function SetDisplayText(id: string, text: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        poi.disposeTextObject();

        const textMesh = createTextMesh(text);
        poiTextGroup.add(textMesh);

        poi.TextObject = textMesh;
        poi.WorldPosition = poi.WorldPosition;

        poi.displayText = text;
    }
}

/**
 * id에 해당하는 poi가 가지고 있는 애니메이션 목록을 얻음
 * @param id - poi id값
 */
function GetAnimationList(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        return Object.keys(poi.AnimationActions);
    }
}

/**
 * poi의 애니메이션을 재생한다.
 * @param id - poi id값
 * @param animName - 애니메이션 이름
 */
function PlayAnimation(id: string, animName: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        poi.playAnimation(animName);
    }
}

/**
 * 재생중인 poi의 애니메이션을 중지한다.
 * @param id - poi id값
 */
function StopAnimation(id: string) {
    if (poiDataList.hasOwnProperty(id)) {
        const poi = poiDataList[id];
        poi.stopAnimation();
    }
}

export {
    poiDataList as PoiDataList,

    getIcon,
    createTextMesh,
    exists,
    getPoiElement,
    updatePoiLine,
    updatePoiMesh,

    Export,
    ExportAll,
    Import,
    Delete,
    Clear,

    Show,
    Hide,
    ShowAll,
    HideAll,

    ShowLine,
    HideLine,
    ShowAllLine,
    HideAllLine,

    ShowDisplayText,
    HideDisplayText,
    ShowAllDisplayText,
    HideAllDisplayText,

    SetDisplayText,

    GetAnimationList,
    PlayAnimation,
    StopAnimation
}