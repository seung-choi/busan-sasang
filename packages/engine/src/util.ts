import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as PIXI from 'pixi.js';
import * as Event from './eventDispatcher';
import * as Interfaces from './interfaces';
import * as ModelInternal from './model/model';
import * as PoiData from './poi/data';
import { PoiElement } from './poi/element';
import { Engine3D } from './engine';

let pixiApp: PIXI.Application;
let engine: Engine3D;

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {

    engine = evt.engine as Engine3D;

    // 텍스트 텍스쳐 생성을 위한 pixi.js 인스턴스
    pixiApp = new PIXI.Application();
    pixiApp.init({
        autoStart: false,
        backgroundAlpha: 0,
    });
});

/**
 * 대상 재질의 셰이더를 빌보드 세이더로 변경한다.
 * @param target - 대상 재질
 */
function materialToBillboard(target: THREE.Material) {
    target.onBeforeCompile = (shader) => {
        shader.vertexShader = shader.vertexShader.replace('#include <fog_vertex>',
            `
            #include <fog_vertex>

            mvPosition = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
            vec2 scale;
            scale.x = length( vec3( modelMatrix[0].x, modelMatrix[0].y, modelMatrix[0].z));
            scale.y = length( vec3( modelMatrix[1].x, modelMatrix[1].y, modelMatrix[1].z));

            // 화면 기준 스케일 고정
            bool isPerspective = isPerspectiveMatrix( projectionMatrix );
            if( isPerspective )
                scale *= -mvPosition.z;

            vec2 center = vec2(0.5, 0.5);
            float rotation = 0.0;

            vec2 alignedPosition = (position.xy - (center - vec2(0.5))) * scale;

            vec2 rotatedPosition;
            rotatedPosition.x = cos(rotation) * alignedPosition.x - sin(rotation) * alignedPosition.y;
            rotatedPosition.y = sin(rotation) * alignedPosition.x + cos(rotation) * alignedPosition.y;
            mvPosition.xy += rotatedPosition;
            gl_Position = projectionMatrix * mvPosition;
            `);
    };
}

/**
 * 텍스트를 텍스쳐에 기록한다.
 * @param text - 텍스트
 * @param outSize - 생성된 텍스쳐 크기
 */
function createTextMaterial(text: string, outSize: THREE.Vector2, useBillboard: boolean = true, fontSize: number = 14): THREE.MeshBasicMaterial {

    // 텍스트 스타일
    const textStyle = new PIXI.TextStyle({
        stroke: {
            color: 0x000000,
            width: 5,
            join: 'round',
            cap: 'round',
        },
        fontFamily: 'Arial',
        fontSize: fontSize,
        fill: 0xffffff,
        align: 'center',
    });

    // 사이즈 계산
    const metrics = PIXI.CanvasTextMetrics.measureText(text, textStyle);
    outSize.x = metrics.width;
    outSize.y = metrics.height;

    // pixi.js 라벨 생성 및 스테이지 추가
    const pixiText = new PIXI.Text({
        text: text,
        style: textStyle,
    });
    pixiApp.stage.addChild(pixiText);

    // pixi.js 렌더러의 뷰포트 사이즈를 텍스쳐 크기에 맞춤
    pixiApp.renderer.resize(outSize.x, outSize.y);
    pixiApp.render();

    // three.js 캔버스 텍스쳐 생성
    const texture = new THREE.CanvasTexture(pixiApp.canvas, THREE.UVMapping, THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter);
    engine.Renderer.initTexture(texture);

    // three.js 재질 생성
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });

    // 빌보드 사용시 재질변경
    if (useBillboard)
        materialToBillboard(material);

    // pixi.js 텍스트 제거
    pixiApp.stage.removeChild(pixiText);
    pixiText.destroy();

    return material;
}

/**
 * 위치점 메시의 인스턴싱 처리를 위해 주소값에 해당하는 모델링이 다중객체로 구성된 메시면 하나로 합쳐서 반환한다
 * @param url - 모델파일 주소
 */
async function getMergedGeometry(url: string) {

    // 인스턴스 메시 생성용 리소스, geometry의 경우 누적하는 형태로 처리
    let mergedGeometry: THREE.BufferGeometry | undefined = undefined;
    let mergedMaterial: THREE.Material[] = [];

    // gltf 로더
    const loader = new Addon.GLTFLoader();
    await loader.loadAsync(url).then(gltfScene => {
        // 월드 행렬이 적용된 geometry 수집
        let collectGeometries: THREE.BufferGeometry[] = [];
        // 로드한 gltf를 순회하며 geometry병합
        gltfScene.scene.traverse(object => {
            if (object instanceof THREE.Mesh) {
                // geometry 수집
                const currGeometry: THREE.BufferGeometry = object.geometry.clone();
                object.updateMatrixWorld(true);
                currGeometry.applyMatrix4(object.matrixWorld);

                collectGeometries.push(currGeometry);

                // material 수집
                if (Array.isArray(object.material))
                    mergedMaterial = mergedMaterial.concat(object.material);
                else
                    mergedMaterial.push(object.material);
            }
        });

        // 머터리얼 환경맵 설정
        mergedMaterial.forEach(mat => {
            (mat as any).envMap = engine.GeneratedCubeRenderTarget.texture;
            (mat as any).envMapIntensity = 0.1;
            mat.needsUpdate = true;
        });

        // 수집된 리소스 병합
        mergedGeometry = Addon.BufferGeometryUtils.mergeGeometries(collectGeometries, true);
        // 병합완료후 수집데이터 메모리 해제
        collectGeometries.forEach(geometry => geometry.dispose());
    });

    // 결과 반환
    return {
        geometry: mergedGeometry,
        material: (mergedMaterial.length > 1) ? mergedMaterial : mergedMaterial[0]
    };
}

/**
 * 자식을 포함한 대상의 모든 객체에 대해 레이어를 설정
 * @param target - 대상 객체
 */
function setObjectLayer(target: THREE.Object3D, layer: Interfaces.CustomLayer) {
    target.traverse(child => {
        child.layers.disableAll();
        child.layers.set(layer);
    });
}

/**
 * 대상 객체로부터 부모객체를 탐색하여 층 객체를 찾는다.
 * 찾지 못했을경우 가장 낮은 층이 반환됨
 * @param target - 대상 객체
 * @returns - 층 객체
 */
function getFloorObject(target?: THREE.Object3D): THREE.Object3D {

    let result = ModelInternal.getLowestFloorObject();

    if (!target)
        return result;

    target.traverseAncestors(parent => {
        if (parent.userData.hasOwnProperty('type')) {
            const parentType: string = parent.userData['type'];
            if (parentType.toLowerCase() === 'floor') {
                result = parent;
            }
        }
    });

    return result;

}

/**
 * 전체 poi 목록에서 마우스 레이캐스트를 위한 객체 수집
 * @returns - 레이캐스트 객체
 */
function collectPickableObjects() {
    const hasInstanceMeshRefPoiList = Object.values(PoiData.PoiDataList).filter(poi => poi.PointMeshData.instanceMeshRef !== undefined);
    const hasAnimMeshRefPoiList = Object.values(PoiData.PoiDataList).filter(poi => poi.PointMeshData.animMeshRef !== undefined);

    let resultInstanceMeshList = hasInstanceMeshRefPoiList.map(poi => poi.PointMeshData.instanceMeshRef);
    let resultAnimMeshList = hasAnimMeshRefPoiList.map(poi => poi.PointMeshData.animMeshRef);

    resultInstanceMeshList = [...new Set(resultInstanceMeshList)];
    resultAnimMeshList = [...new Set(resultAnimMeshList)];

    return {
        instanceMeshArray: resultInstanceMeshList,
        animMeshArray: resultAnimMeshList,
    }
}

/**
 * 포인터 레이캐스트로부터 poi얻기
 * @param rayCast - 레이캐스트
 */
function getPoiFromRaycast(rayCast: THREE.Raycaster): { [key: string]: any } | undefined {

    const pickObjects = collectPickableObjects();

    // 인스턴스 메시와 레이캐스트 수행
    const instanceIntersects = rayCast.intersectObjects(pickObjects.instanceMeshArray as THREE.Object3D[], false);
    const animIntersects = rayCast.intersectObjects(pickObjects.animMeshArray as THREE.Object3D[], true);
    const combinedIntersects = instanceIntersects.concat(animIntersects);
    if (combinedIntersects.length > 0) {
        // 거리순 정렬
        combinedIntersects.sort((a, b) => { if (a.distance < b.distance) { return -1; } else if (a.distance > b.distance) { return 1; } else { return 0; } });

        // 인스턴스 메시일경우
        if (combinedIntersects[0].object instanceof THREE.InstancedMesh) {

            // 인스턴스 메시의 uuid와 instanceId가 일치하는 poi를 찾음
            const uuid = combinedIntersects[0].object.uuid;
            const instanceId = combinedIntersects[0].instanceId;
            const matchTarget = Object.values(PoiData.PoiDataList).filter(poi => {
                if (poi.PointMeshData.instanceMeshRef) {
                    const bUUIDMatch = poi.PointMeshData.instanceMeshRef.uuid === uuid;
                    const bInstanceIdMatch = poi.PointMeshData.instanceIndex === instanceId;
                    return bUUIDMatch && bInstanceIdMatch;
                }
                return false;
            });

            return {
                poi: matchTarget[0],
                distance: combinedIntersects[0].distance,
            };

        } else {
            // 애니메이션 메시일 경우 메시의 자식 객체가 픽킹 되는 경우가 있으므로
            // 픽킹된 객체로부터 계층구조 트리상 부모객체들의 uuid를 수집
            const ancestorsUUIDs: string[] = [];
            combinedIntersects[0].object.traverseAncestors(parent => ancestorsUUIDs.push(parent.uuid));

            // poi의 애니메이션 메시 레퍼런스중 uuid가 매치되는것이 있는지 확인
            const matchTarget = Object.values(PoiData.PoiDataList).filter(poi => {
                if (poi.PointMeshData.animMeshRef) {
                    return ancestorsUUIDs.indexOf(poi.PointMeshData.animMeshRef.uuid) >= 0;
                }
                return false;
            });

            // 이벤트 통지
            return {
                poi: matchTarget[0],
                distance: combinedIntersects[0].distance,
            };
        }
    }

    return undefined;
}

/**
 * 월드상의 3d좌표를 화면상의 2d pixel좌표로 변환
 * @param target - 좌표값
 * @returns - 변환값
 */
function toScreenPos(target: THREE.Vector3): THREE.Vector2 {
    const projected = target.clone().project(engine.Camera);
    const widthHalf = 0.5 * engine.Renderer.domElement.clientWidth;
    const heightHalf = 0.5 * engine.Renderer.domElement.clientHeight;

    return new THREE.Vector2(
        (projected.x * widthHalf) + widthHalf,
        (-projected.y * heightHalf) + heightHalf
    );

}

/**
 * 곡선상의 가장 가까운 위치점 찾기
 * @param curvePath - 커브패스
 * @param point - 위치점
 * @param divisions - 분할개수
 * @returns - 곡선상 위치점
 */
function getClosestPointOnCurvePath(curvePath: THREE.CurvePath<THREE.Vector3>, point: THREE.Vector3, divisions = 100) {
    let closestPoint = null;
    let minDistance = Infinity;
    let closestCurve = null;
    let closestT = 0;
    let totalLength = 0;
    let lengthAtClosest = 0;

    for (let i = 0; i < curvePath.curves.length; i++) {
        const curve = curvePath.curves[i];
        const points = curve.getPoints(divisions);

        for (let j = 0; j < points.length; j++) {
            const curvePoint = points[j];
            const dist = curvePoint.distanceTo(point);

            if (dist < minDistance) {
                minDistance = dist;
                closestPoint = curvePoint;
                closestCurve = curve;
                closestT = j / divisions;
                // 전체 길이 위치 추적
                const partialLength = curve.getLength() * closestT;
                lengthAtClosest = totalLength + partialLength;
            }
        }

        totalLength += curve.getLength();
    }

    const totalCurveLength = curvePath.getLength();
    const u = lengthAtClosest / totalCurveLength;

    return {
        point: closestPoint,
        distance: minDistance,
        curve: closestCurve,
        t: closestT,
        u: u,
    };
}

/**
 * 색상이나 이미지로 배경 설정
 * @param backgroundData - 배경색상 숫자일경우 0xff0000의 형식으로 판단하고, 문자열일 경우 이미지 주소로 판단하여 배경을 설정한다.
 */
function SetBackground(backgroundData: number | string) {

    if (typeof (backgroundData) === 'number') {
        engine.RootScene.background = new THREE.Color(backgroundData);
    } else if (typeof (backgroundData) === 'string') {
        engine.RootScene.background = new THREE.TextureLoader().load(backgroundData);
    }
}

export {
    // 내부사용
    createTextMaterial,
    getMergedGeometry,
    setObjectLayer,
    getFloorObject,
    getPoiFromRaycast,
    toScreenPos,
    getClosestPointOnCurvePath,

    // 외부노출
    SetBackground,
}