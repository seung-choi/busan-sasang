import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as Util from '../util';
import * as Effect from '../effect';
import * as PoiPlacer from '../poi/placer';
import * as PoiEditor from '../poi/edit';
import * as LabelCreator from '../label3d/create';
import * as LabelEditor from '../label3d/edit';
import * as LabelData from '../label3d/data';
import { Engine3D } from '../engine';
import { Label3DElement } from '../label3d/element';

let engine: Engine3D;
let hoverObjects: THREE.Object3D[] = [];
let objSelGroup: THREE.Group;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // poi 이벤트 처리에서 사용할 그룹 객체
    objSelGroup = new THREE.Group();
    objSelGroup.name = '#ObjectSelectorGroup';
    engine.RootScene.add(objSelGroup);

    // 이벤트 등록
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointermove', onPointerMove);
    engine.Dom.addEventListener('pointerup', onPointerUp);
});

/**
 * Poi 생성 이벤트 처리
 */
Event.InternalHandler.addEventListener('onPoiCreate' as never, () => {
    clearHoverObjects();
});

/**
 * Poi 편집 시작 이벤트 처리
 */
Event.InternalHandler.addEventListener('onPoiStartEdit' as never, () => {
    clearHoverObjects();
});

/**
 * 라벨 생성 시작 이벤트 처리
 */
Event.InternalHandler.addEventListener('onLabel3DCreateStarted' as never, () => {
    clearHoverObjects();
});

/**
 * 라벨 편집 시작 이벤트 처리
 */
Event.InternalHandler.addEventListener('onLabel3DEditStarted' as never, () => {
    clearHoverObjects();
});

/**
 * 호버링 객체 해제
 */
function clearHoverObjects() {

    hoverObjects.forEach(item => {
        if (item instanceof THREE.Mesh && item.userData['IsPoiObject']) {
            objSelGroup.remove(item);
            item.geometry.dispose();
            item.material.dispose();
        }
    });
    hoverObjects = [];
    Effect.Outline.setOutlineObjects(hoverObjects);
}

/**
 * 포인터 다운 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerDown(evt: PointerEvent) {

    if (PoiPlacer.Enabled || PoiEditor.Enabled || LabelCreator.Enabled || LabelEditor.Enabled)
        return;

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

    if (PoiPlacer.Enabled || PoiEditor.Enabled || LabelCreator.Enabled || LabelEditor.Enabled)
        return;

    const mousePos = new THREE.Vector2(
        (evt.offsetX / engine.Dom.clientWidth) * 2 - 1,
        -(evt.offsetY / engine.Dom.clientHeight) * 2 + 1
    );

    const rayCast = new THREE.Raycaster();
    rayCast.layers.set(Interfaces.CustomLayer.Pickable);
    rayCast.setFromCamera(mousePos, engine.Camera);

    const pickObjects: { [key: string]: any }[] = [];

    clearHoverObjects();
    // poi
    const result = Util.getPoiFromRaycast(rayCast);
    if (result) {
        const poi = result.poi;
        pickObjects.push(result);
    }
    // label3d
    const labels: Label3DElement[] = LabelData.getPickableObjects();
    labels.forEach(label => Util.setObjectLayer(label, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable));
    const intersects = rayCast.intersectObjects(labels, false);
    if (intersects.length > 0) {
        pickObjects.push({
            distance: intersects[0].distance,
            label: intersects[0].object as Label3DElement,
        });
    }
    labels.forEach(label => Util.setObjectLayer(label, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable));

    // 레이캐스트 결과가 있는 경우
    if (pickObjects.length > 0) {
        // 레이캐스트 결과 거리순 정렬
        pickObjects.sort((a, b) => {
            if (a.distance < b.distance) return -1;
            if (a.distance > b.distance) return 1;
            return 0;
        });

        // 0번째 객체처리
        if (pickObjects[0].poi) {
            const poi = pickObjects[0].poi;
            if (poi.PointMeshData.instanceMeshRef) {
                const instanceCopyMesh = new THREE.Mesh(poi.PointMeshData.instanceMeshRef.geometry, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 }));
                instanceCopyMesh.position.copy(poi.WorldPosition);
                instanceCopyMesh.rotation.copy(poi.Rotation);
                instanceCopyMesh.scale.copy(poi.Scale);
                instanceCopyMesh.userData['IsPoiObject'] = true; // Poi 객체임을 표시
                objSelGroup.attach(instanceCopyMesh);
                hoverObjects.push(instanceCopyMesh);
            }
            else if (poi.PointMeshData.animMeshRef)
                hoverObjects.push(poi.PointMeshData.animMeshRef);

            Effect.Outline.setOutlineObjects(hoverObjects);
        } else if (pickObjects[0].label) {
            const label = pickObjects[0].label;
            if (label instanceof Label3DElement) {
                hoverObjects.push(label);
                Effect.Outline.setOutlineObjects(hoverObjects);
            }
        }
    }
}

/**
 * 포인터 업 이벤트 처리
 * @param evt - 이벤트 정보
 */
function onPointerUp(evt: PointerEvent) {

    if (PoiPlacer.Enabled || PoiEditor.Enabled || LabelCreator.Enabled || LabelEditor.Enabled)
        return;

    if (evt.button === 0) {
        const currMousePos: THREE.Vector2 = new THREE.Vector2(evt.offsetX, evt.offsetY);
        if (currMousePos.distanceTo(mouseDownPos) < 5.0) {

            const mousePos = new THREE.Vector2(
                (evt.offsetX / engine.Dom.clientWidth) * 2 - 1,
                -(evt.offsetY / engine.Dom.clientHeight) * 2 + 1
            );

            const rayCast = new THREE.Raycaster();
            rayCast.layers.set(Interfaces.CustomLayer.Pickable);
            rayCast.setFromCamera(mousePos, engine.Camera);

            const pickObjects: { [key: string]: any }[] = [];
            // poi
            const result = Util.getPoiFromRaycast(rayCast);
            if (result) {
                const poi = result.poi;
                pickObjects.push(result);
            }
            // label3d
            const labels: Label3DElement[] = LabelData.getPickableObjects();
            labels.forEach(label => Util.setObjectLayer(label, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable));
            const intersects = rayCast.intersectObjects(labels, false);
            if (intersects.length > 0) {
                pickObjects.push({
                    distance: intersects[0].distance,
                    label: intersects[0].object as Label3DElement,
                });
            }
            labels.forEach(label => Util.setObjectLayer(label, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable));

            // 레이캐스트 결과가 있는 경우
            if (pickObjects.length > 0) {
                // 레이캐스트 결과 거리순 정렬
                pickObjects.sort((a, b) => {
                    if (a.distance < b.distance) return -1;
                    if (a.distance > b.distance) return 1;
                    return 0;
                });

                // 0번째 객체처리
                if (pickObjects[0].poi) {
                    const poi = pickObjects[0].poi;
                    // 이벤트 통지
                    Event.ExternalHandler.dispatchEvent({
                        type: 'onPoiPointerUp',
                        target: poi.ExportData,
                        pointerEvent: evt,
                        screenPos: Util.toScreenPos(poi.WorldPosition.clone()),
                    });
                } else if (pickObjects[0].label) {
                    const label = pickObjects[0].label;

                    // 이벤트 통지
                    Event.ExternalHandler.dispatchEvent({
                        type: 'onLabel3DPointerUp',
                        target: label.ExportData,
                        pointerEvent: evt,
                        screenPos: Util.toScreenPos(label.position.clone()),
                    });
                }
            }
        }
    }
}
