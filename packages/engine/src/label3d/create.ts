import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as Util from '../util';
import { Engine3D } from '../engine';
import { Label3DElement } from './element';

let engine: Engine3D;
let workingLabel: Label3DElement | undefined;
let onCompleteCallback: Function | undefined;
// let label3DRenderGroup: THREE.Group;
let currentPicktarget: THREE.Object3D | undefined;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();
let enabled: boolean = false;

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // // 라벨3d렌더링 그룹
    // label3DRenderGroup = new THREE.Group();
    // label3DRenderGroup.name = '#Label3DGroup';
    // engine.RootScene.add(label3DRenderGroup);
});

/**
 * 포인터 이벤트 등록
 */
function registerPointerEvents() {
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointermove', onPointerMove);
    engine.Dom.addEventListener('pointerup', onPointerUp);
}

/**
 * 포인터 이벤트 등록 해제
 */
function unregisterPointerEvents() {
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
    if (workingLabel) {
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
            workingLabel.position.copy(intersects[0].point);
            currentPicktarget = intersects[0].object;
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
            const floorObj = Util.getFloorObject(currentPicktarget);
            workingLabel!.userData['floorId'] = floorObj?.userData['floorId'];
            floorObj.attach(workingLabel!);

            // 생성 이벤트 내부 통지
            Event.InternalHandler.dispatchEvent({
                type: 'onLabel3DCreated',
                target: workingLabel
            });

            // 배치 완료 콜백
            onCompleteCallback?.(workingLabel!.ExportData);

            // 이벤트 해제
            unregisterPointerEvents();

            enabled = false;
        }
    }
}

/**
 * 라벨3d 생성
 * @param option - 생성 옵션
 * @param onComplete - 생성 완료후 콜백
 */
function Create(option: Interfaces.Label3DCreateOption, onComplete?: Function) {
    const size = new THREE.Vector2();
    const material = Util.createTextMaterial(option.displayText, size, false, 32);
    workingLabel = new Label3DElement(material, size);
    workingLabel.name = option.id;
    workingLabel.userData['displayText'] = option.displayText;
    // label3DRenderGroup.add(workingLabel);
    engine.RootScene.add(workingLabel);
    onCompleteCallback = onComplete;

    registerPointerEvents();

    // 라벨생성 시작 이벤트 내부 통지
    Event.InternalHandler.dispatchEvent({
        type: 'onLabel3DCreateStarted',
    });

    enabled = true;
}

/**
 * 작업 취소
 */
function Cancel() {
    if (workingLabel) {
        workingLabel.dispose();
        workingLabel = undefined;
    }

    unregisterPointerEvents();

    enabled = false;

}

export {
    enabled as Enabled,

    Create,
    Cancel,
}