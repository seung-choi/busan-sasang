import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Interfaces from '../interfaces';
import * as Event from '../eventDispatcher';
import * as TWEEN from '@tweenjs/tween.js';
import * as Util from '../util';
import { Engine3D } from '../engine';

const floorObjects: Record<string, THREE.Object3D> = {};
let posTween: TWEEN.Tween | undefined | null = undefined;
let engine: Engine3D;
let modelGroup: THREE.Group;

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // 배경 모델 그룹 생성
    modelGroup = new THREE.Group();
    modelGroup.name = '#ModelGroup';
    engine.RootScene.add(modelGroup);
});

/**
 * gltf 로드 완료후 콜백 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onGltfLoaded' as never, (evt: any) => {
    // gltf 모델 로드 완료후 층객체만 따로 저장
    const target: THREE.Object3D = evt.target;
    target.traverse(child => {
        if (child.userData.hasOwnProperty('type')) {
            const type: string = child.userData['type'];
            if (type.toLowerCase() === 'floor') {
                child.userData['SourceLocalPosition'] = child.position.clone();
                floorObjects[child.userData.floorId] = child;
            }
        }
    });
});

/**
 * 월드좌표를 지정한 층기준 로컬 좌표로 변환한다.
 * @param worldPos - 변환할 좌표값
 * @param floorId - 층id값
 * @returns - 변환된 좌표값
 */
function convertWorldToFloorLocal(worldPos: THREE.Vector3, floorId: string): THREE.Vector3 {
    if (!floorObjects.hasOwnProperty(floorId)) {
        const targetFloor = getLowestFloorObject();
        return targetFloor.worldToLocal(worldPos);
    }

    const targetFloor = floorObjects[floorId];
    return targetFloor.worldToLocal(worldPos);
}

/**
 * 층기준 로컬좌표를 월드좌표로 변환한다.
 * @param localPos - 변환할 좌표값
 * @param floorId - 층id값
 * @returns - 변환된 좌표값
 */
function convertFloorLocalToWorld(localPos: THREE.Vector3, floorId: string): THREE.Vector3 {
    if (!floorObjects.hasOwnProperty(floorId)) {
        const targetFloor = getLowestFloorObject();
        return targetFloor.localToWorld(localPos);
    }

    const targetFloor = floorObjects[floorId];
    return targetFloor.localToWorld(localPos);
}

/**
 * 지정한 층의 월드 기준 바운딩 정보 계산
 * @param floorId - 층 id값
 * @returns - 계산된 바운딩 정보
 */
function calculateFloorBounding(floorId: string): THREE.Box3 {

    if (!floorObjects.hasOwnProperty(floorId)) {
        console.warn('지정한 층객체를 찾을 수 없음: ', floorId);
        return new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(), new THREE.Vector3(1, 1, 1));
    }

    const targetFloor = floorObjects[floorId];
    return new THREE.Box3().setFromObject(targetFloor);
}

/**
 * sortingorder값이 제일 낮은 층객체를 얻는다.
 * @returns - 층객체
 */
function getLowestFloorObject(): THREE.Object3D {
    const floorArray = Object.values(floorObjects);
    floorArray.sort((a, b) => {
        const valueA = Number.parseInt(a.userData['sortingorder']);
        const valueB = Number.parseInt(b.userData['sortingorder']);
        if (valueA < valueB)
            return -1;
        else if (valueA > valueB)
            return 1;
        else
            return 0;
    });

    return floorArray[0];
}

/**
 * 층 id값에 해당하는 층객체 얻기
 * @param id - 층 id값
 * @returns - 층객체
 */
function getFloorObject(id: string): THREE.Object3D | undefined {

    if (floorObjects.hasOwnProperty(id))
        return floorObjects[id];

    return undefined;
}

/**
 * 모델구조 얻기
 * @param url - 모델링 url 주소
 * @param onComplete - 완료 후 호출될 콜백 함수
 */
function GetModelHierarchyFromUrl(url: string, onComplete: Function) {

    new Addon.GLTFLoader().load(url, (gltf) => {

        const result: Interfaces.ModelInfo[] = [];

        // 구조 분석
        gltf.scene.traverse(child => {
            if (child.userData.hasOwnProperty('type')) {
                const type: string = child.userData['type'];
                if (type.toLowerCase() === 'floor') {
                    const info: Interfaces.ModelInfo = {
                        objectName: child.name,
                        displayName: child.userData.displayName,
                        sortingOrder: Number.parseInt(child.userData.sortingorder),
                        floorId: child.userData.floorId
                    };

                    // 배열에 저장
                    result.push(info);
                }
            }
        });

        // 콜백 호출
        onComplete?.(result);

    }, undefined, (err) => console.error(err));
}

function GetModelHierarchy(): Interfaces.ModelInfo[] {

    const result: Interfaces.ModelInfo[] = [];

    // 구조 분석
    modelGroup.traverse(child => {
        if (child.userData.hasOwnProperty('type')) {
            const type: string = child.userData['type'];
            if (type.toLowerCase() === 'floor') {
                const info: Interfaces.ModelInfo = {
                    objectName: child.name,
                    displayName: child.userData.displayName,
                    sortingOrder: Number.parseInt(child.userData.sortingorder),
                    floorId: child.userData.floorId
                };

                // 배열에 저장
                result.push(info);
            }
        }
    });

    return result;
}

/**
 * 층객체 보기
 * @param id - 층객체 id값
 */
function Show(id: string) {
    if (floorObjects.hasOwnProperty(id)) {
        floorObjects[id].visible = true;
        Util.setObjectLayer(floorObjects[id], Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable);

        // 층가시화 이벤트 내부 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onModelShow',
            floorId: id,
        });
    }
}

/**
 * 층객체 숨기기
 * @param id - 층객체 id값
 */
function Hide(id: string) {
    if (floorObjects.hasOwnProperty(id)) {
        floorObjects[id].visible = false;
        Util.setObjectLayer(floorObjects[id], Interfaces.CustomLayer.Invisible);

        // 층 숨기기 이벤트 내부 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onModelHide',
            floorId: id,
        });
    }
}

/**
 * 모든 층객체 보기
 */
function ShowAll() {
    Object.values(floorObjects).forEach(floor => {
        floor.visible = true;
        Util.setObjectLayer(floor, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable);

    });

    // 층가시화 이벤트 내부 통지
    Event.InternalHandler.dispatchEvent({
        type: 'onModelShowAll',
    });
}

/**
 * 모든 층객체 숨기기
 */
function HideAll() {
    Object.values(floorObjects).forEach(floor => {
        floor.visible = false;
        Util.setObjectLayer(floor, Interfaces.CustomLayer.Invisible);

    });

    // 층 숨기기 이벤트 내부 통지
    Event.InternalHandler.dispatchEvent({
        type: 'onModelHideAll',
    });
}

/**
 * 층 펼치기
 * @param transitionTime - 애니메이션 진행 시간
 * @param interval - 간격
 * @param onComplete - 완료 후 호출될 콜백 함수
 */
function Expand(transitionTime: number, interval: number, onComplete?: Function) {

    // 트윈이 진행중이면 수행하지 않음
    if (posTween === undefined || posTween === null) {

        // 이동시작전 이벤트 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onModelBeforeMove',
            floorObjects: floorObjects,
        });

        // 층 배열 얻어서 sortingorder 기준 정렬
        const floorArray = Array.from(Object.values(floorObjects));
        floorArray.sort((a, b) => {
            const valueA = Number.parseInt(a.userData['sortingorder']);
            const valueB = Number.parseInt(b.userData['sortingorder']);
            if (valueA < valueB)
                return -1;
            else if (valueA > valueB)
                return 1;
            else
                return 0;
        });

        // 펼치기 트윈 데이터 생성
        const expandData = {
            ratio: 0.0,
            floors: []
        };
        floorArray.forEach((floor) => {
            const sortingOrder = floor.userData['sortingorder'];
            expandData.floors.push({
                target: floor,
                targetPosition: floor.userData['SourceLocalPosition'].clone().addScaledVector(new THREE.Vector3(0, 1, 0), sortingOrder * interval)
            } as never);
        });

        // 트윈 생성
        posTween = new TWEEN.Tween(expandData)
            .to({
                ratio: 1.0,
            }, transitionTime * 1000)
            .easing(TWEEN.Easing.Quartic.InOut)
            .onUpdate(() => {
                expandData.floors.forEach((item: any) => {
                    const startPoint = item.target.userData['SourceLocalPosition'];
                    const endPoint = item.targetPosition;
                    item.target.position.copy(new THREE.Vector3().lerpVectors(startPoint, endPoint, expandData.ratio));
                });
            }).onComplete(() => {
                posTween?.stop();
                engine.TweenUpdateGroups.remove(posTween as TWEEN.Tween);
                posTween = null;

                // 이동 완료 후 이벤트 통지
                Event.InternalHandler.dispatchEvent({
                    type: 'onModelAfterMove',
                    floorObjects: floorObjects,
                });

                // 완료 콜백 호출
                onComplete?.();
            })
            .start();

        // 트윈 업데이트 그룹에 추가
        engine.TweenUpdateGroups.add(posTween);
    }

}

/**
 * 층 접기
 * @param transitionTime - 애니메이션 진행 시간
 * @param onComplete - 완료 후 호출될 콜백 함수
 */
function Collapse(transitionTime: number, onComplete?: Function) {
    // 트윈이 진행중일땐 수행하지 않음
    if (posTween === undefined || posTween === null) {

        // 이동시작전 이벤트 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onModelBeforeMove',
            floorObjects: floorObjects,
        });

        // 접기 트윈 데이터 생성
        const collapseData = {
            ratio: 0.0,
            floors: []
        };
        Object.values(floorObjects).forEach(floor => {
            collapseData.floors.push({
                target: floor,
                startPosition: floor.position.clone(),
                targetPosition: floor.userData['SourceLocalPosition'].clone()
            } as never);
        });

        // 트윈 생성
        posTween = new TWEEN.Tween(collapseData)
            .to({
                ratio: 1.0,
            }, transitionTime * 1000)
            .easing(TWEEN.Easing.Quartic.InOut)
            .onUpdate(() => {
                collapseData.floors.forEach((item: any) => {
                    const startPoint = item.startPosition;
                    const endPoint = item.targetPosition;
                    item.target.position.copy(new THREE.Vector3().lerpVectors(startPoint, endPoint, collapseData.ratio));
                });
            }).onComplete(() => {
                posTween?.stop();
                engine.TweenUpdateGroups.remove(posTween as TWEEN.Tween);
                posTween = null;

                // 이동 완료 후 이벤트 통지
                Event.InternalHandler.dispatchEvent({
                    type: 'onModelAfterMove',
                    floorObjects: floorObjects,
                });

                // 완료 콜백 호출
                onComplete?.();
            })
            .start();

        // 트윈 업데이트 그룹에 추가
        engine.TweenUpdateGroups.add(posTween);
    }
}

export {
    modelGroup as ModelGroup,

    convertWorldToFloorLocal,
    convertFloorLocalToWorld,
    calculateFloorBounding,
    getLowestFloorObject,
    getFloorObject,

    GetModelHierarchyFromUrl,
    GetModelHierarchy,
    Show,
    Hide,
    ShowAll,
    HideAll,
    Expand,
    Collapse,
}