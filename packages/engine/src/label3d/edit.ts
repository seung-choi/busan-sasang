import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as Util from '../util';
import * as ModelInternal from '../model/model';
import * as LabelDataInternal from './data';
import * as Camera from '../camera';
import { Engine3D } from '../engine';
import { Label3DElement } from './element';

let engine: Engine3D;
let target: Label3DElement;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();

let gizmo: Addon.TransformControls;
let editMode: Addon.TransformControlsMode = 'translate';

let enabled: boolean = false;

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;
});

/**
 * 포인터 다운 이벤트 처리
 * @param event - 포인터 다운 이벤트 정보
 */
function onPointerDown(evt: MouseEvent) {

    if (evt.button === 0) {
        mouseDownPos.x = evt.offsetX;
        mouseDownPos.y = evt.offsetY;
    }
}

/**
 * 포인터 업 이벤트 처리
 * @param event - 포인터 업 이벤트 정보
 */
function onPointerUp(evt: MouseEvent) {

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

            const labelArray = LabelDataInternal.getPickableObjects();
            const intersects = rayCast.intersectObjects(labelArray, false);
            if (intersects.length > 0) {
                target = intersects[0].object as Label3DElement;
                unregisterPointerEvents();

                // 기즈모 생성
                gizmo = new Addon.TransformControls(engine.Camera, engine.Renderer.domElement);
                gizmo.setMode(editMode); // "translate" | "rotate" | "scale"
                gizmo.addEventListener('dragging-changed', (event) => {
                    Camera.SetEnabled(!event.value);
                });
                gizmo.addEventListener('mouseUp', (event) => {
                    // 외부 이벤트 통지
                    Event.ExternalHandler.dispatchEvent({
                        type: 'onLabel3DTransformChange',
                        target: target.ExportData
                    });
                });
                gizmo.attach(target);

                const helper = gizmo.getHelper();
                engine.RootScene.add(helper);
            }
        }
    }
}

/**
 * 포인터 이벤트 등록
 */
function registerPointerEvents() {
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointerup', onPointerUp);
}

/**
 * 포인터 이벤트 등록 해제
 */
function unregisterPointerEvents() {
    engine.Dom.removeEventListener('pointerdown', onPointerDown);
    engine.Dom.removeEventListener('pointerup', onPointerUp);
}

/**
 * poi 편집 시작
 * @param _editMode - 편집모드 'translate', 'rotate', 'scale' 택1
 */
function StartEdit(_editMode: string) {
    FinishEdit();

    editMode = _editMode as Addon.TransformControlsMode;

    registerPointerEvents();

    // 픽킹 대상 객체로 처리
    const labelArray = LabelDataInternal.getPickableObjects();
    labelArray.forEach(label => Util.setObjectLayer(label, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable));

    // 라벨편집 시작 이벤트 내부 통지
    Event.InternalHandler.dispatchEvent({
        type: 'onLabel3DEditStarted',
    });
    enabled = true;

}

/**
 * poi 편집 종료
 */
function FinishEdit() {
    // 가시화 객체로 처리
    const labelArray = LabelDataInternal.getPickableObjects();
    labelArray.forEach(label => Util.setObjectLayer(label, Interfaces.CustomLayer.Default));

    if (gizmo) {
        const helper = gizmo.getHelper();
        engine.RootScene.remove(helper);
        gizmo.dispose();
    }
    enabled = false;
}

export {
    enabled as Enabled,

    StartEdit,
    FinishEdit,
}