import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as PoiData from './data';
import * as ModelInternal from '../model/model';
import { Engine3D } from '../engine';
import { PoiElement } from './element';

let engine: Engine3D;
let target: PoiElement;
let previewLine: THREE.LineSegments;
let previewPointMesh: THREE.Object3D;
let completeCallback: Function | undefined = undefined;
let currentPicktarget: THREE.Object3D | undefined;
let bPlacerEnabled: boolean = false;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // 이동시 미리보기용 라인 객체
    let geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 1, 0),
    ]);
    let material: THREE.Material = new THREE.LineBasicMaterial({ color: 'red' });
    previewLine = new THREE.LineSegments(geometry, material);
    previewLine.name = '#PoiPlacerPreviewLine';
    engine.RootScene.add(previewLine);

    previewLine.visible = false;
    previewLine.layers.set(Interfaces.CustomLayer.Invisible);
});

/**
 * poi 데이터 추가 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onPoiCreate' as never, async (evt: any) => {
    target = evt.target as PoiElement;
    completeCallback = evt.onCompleteCallback;

    previewLine.scale.y = target.LineHeight;

    // 미리보기용 위치점 메시
    if (target.modelUrl !== undefined) {
        const loader = new Addon.GLTFLoader();
        const gltf = await loader.loadAsync(target.modelUrl);
        previewPointMesh = gltf.scene;
        engine.RootScene.add(previewPointMesh);
    } else {
        // modelurl이 유효하지 않으면 구체로 처리
        const geometry = new THREE.SphereGeometry(0.1, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 'red' });
        previewPointMesh = new THREE.Mesh(geometry, material);
        previewPointMesh.name = '#PoiPlacerPreviewPointMesh';
        engine.RootScene.add(previewPointMesh);
    }

    registerPointerEvents();
});

/**
 * 포인터 이벤트 등록
 */
function registerPointerEvents() {
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointermove', onPointerMove);
    engine.Dom.addEventListener('pointerup', onPointerUp);

    bPlacerEnabled = true;
}

/**
 * 포인터 이벤트 등록 해제
 */
function unRegisterPointerEvents() {
    bPlacerEnabled = false;

    engine.Dom.removeEventListener('pointerdown', onPointerDown);
    engine.Dom.removeEventListener('pointermove', onPointerMove);
    engine.Dom.removeEventListener('pointerup', onPointerUp);
}

/**
 * 포인터 다운 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerDown(evt: PointerEvent) {
    if (evt.button === 0) {
        mouseDownPos.x = evt.offsetX;
        mouseDownPos.y = evt.offsetY;
    }
}

/**
 * 포인터 이동 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerMove(evt: PointerEvent) {

    if (target !== undefined) {
        const mousePos = new THREE.Vector2(
            (evt.offsetX / engine.Dom.clientWidth) * 2 - 1,
            -(evt.offsetY / engine.Dom.clientHeight) * 2 + 1
        );

        const rayCast = new THREE.Raycaster();
        rayCast.layers.set(Interfaces.CustomLayer.Pickable);
        rayCast.setFromCamera(mousePos, engine.Camera);

        currentPicktarget = undefined;
        const intersects = rayCast.intersectObjects(engine.RootScene.children, true);
        if (intersects.length > 0) {
            // poi 위치
            target.WorldPosition = intersects[0].point.clone();

            // 미리보기선
            previewLine.position.copy(target.WorldPosition);
            previewLine.visible = true;
            previewLine.layers.set(Interfaces.CustomLayer.Default);
            // 미리보기 위치점 메시
            previewPointMesh.position.copy(target.WorldPosition);
            previewPointMesh.visible = true;
            previewPointMesh.layers.set(Interfaces.CustomLayer.Default);

            currentPicktarget = intersects[0].object;
        } else {
            // 배경 모델 실패시 평면과 교차 테스트 수행
            const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
            const point = new THREE.Vector3();
            if (rayCast.ray.intersectPlane(plane, point)) {
                // Poi 위치
                target.WorldPosition = point.clone();

                // 미리보기선
                previewLine.position.copy(target.WorldPosition);
                previewLine.visible = true;
                previewLine.layers.set(Interfaces.CustomLayer.Default);
                // 미리보기 위치점 메시
                previewPointMesh.position.copy(target.WorldPosition);
                previewPointMesh.visible = true;
                previewPointMesh.layers.set(Interfaces.CustomLayer.Default);
            }
        }
    }
}

/**
 * 포인터 업 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerUp(evt: PointerEvent) {
    if (evt.button === 0) {
        const currMousePos: THREE.Vector2 = new THREE.Vector2(evt.offsetX, evt.offsetY);
        if (currMousePos.distanceTo(mouseDownPos) < 5.0) {

            // 층 id, 층기준 로컬좌표 값
            const floorObj = getFloorObject();
            target.FloorId = floorObj?.userData['floorId'];

            // poi 배치 이벤트 내부 통지
            Event.InternalHandler.dispatchEvent({
                type: 'onPoiPlaced',
                target: target,
            });

            // 배치 완료 콜백 호출
            completeCallback?.(PoiData.Export(target.id));

            // 이벤트 등록 해제
            unRegisterPointerEvents();

            // 미리보기선 숨기기
            previewLine.visible = false;
            previewLine.layers.set(Interfaces.CustomLayer.Invisible);
            // 미리보기 위치점 메시 제거
            releasePreviewPointMesh();
        }
    }
}

/**
 * 층 id값 얻기
 * @returns - 층 id값
 */
function getFloorObject(): THREE.Object3D | undefined {

    if (currentPicktarget !== undefined) {
        let floorObj: THREE.Object3D | undefined = undefined;
        currentPicktarget.traverseAncestors(parent => {
            if (floorObj === undefined && parent.userData.hasOwnProperty('type')) {
                const parentType: string = parent.userData['type'];
                if (parentType.toLowerCase() === 'floor') {
                    floorObj = parent;
                }
            }
        });

        if (floorObj !== undefined) {
            return floorObj;
        }
    }

    return ModelInternal.getLowestFloorObject();
}

/**
 * 위치점 메시 메모리 해제
 */
function releasePreviewPointMesh() {
    engine.RootScene.remove(previewPointMesh);
    previewPointMesh.traverse(child => {
        if (child instanceof THREE.Mesh) {
            child.geometry.dispose();

            if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                    mat.dispose();
                    mat.map?.dispose();
                });
            } else {
                child.material.dispose();
                child.material.map?.dispose();
            }
        }
    });
}

export {
    bPlacerEnabled as Enabled
}