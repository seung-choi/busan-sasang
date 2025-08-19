import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as Effect from '../effect';
import * as PathData from '../path3d/data';
import * as Util from '../util';
import { Engine3D } from '../engine';
import { Path3DObject } from '../path3d/path3dobject';
import { SubwayTrain } from './subwaytrain';

let engine: Engine3D;
let createOption: Interfaces.SubwayCreateOption;
let mouseState: Interfaces.SubwayCreateMouseState = Interfaces.SubwayCreateMouseState.Default;
let headModelSrc: THREE.Group;
let bodyModelSrc: THREE.Group;
let tailModelSrc: THREE.Group;
let workingTrain: SubwayTrain | undefined;
let subwayTrainRenderGroup: THREE.Group;
let trainOffsetUpdateLoopHandle: number;
const clock: THREE.Clock = new THREE.Clock();
const trainOffsetControlKeyMap: Record<string, boolean> = {};
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // 지하철 모델 렌더링 그룹
    subwayTrainRenderGroup = new THREE.Group();
    subwayTrainRenderGroup.name = '#SubwayTrain';
    engine.RootScene.add(subwayTrainRenderGroup);

    Event.InternalHandler.dispatchEvent({
        type: 'onSubwayTrainRenderGroupCreated',
        target: subwayTrainRenderGroup
    });
});

/**
 * 머리 모델 로드 완료 이벤트 처리
 */
Event.InternalHandler.addEventListener('onSubwayModelLoader_HeadModelLoaded' as never, (evt: any) => {
    headModelSrc = evt.target;
});

/**
 * 몸체 모델 로드 완료 이벤트 처리
 */
Event.InternalHandler.addEventListener('onSubwayModelLoader_BodyModelLoaded' as never, (evt: any) => {
    bodyModelSrc = evt.target;
});

/**
 * 꼬리 모델 로드 완료 이벤트 처리
 */
Event.InternalHandler.addEventListener('onSubwayModelLoader_TailModelLoaded' as never, (evt: any) => {
    tailModelSrc = evt.target;
});

/**
 * 대상 객체의 부모 객체를 탐색하여 경로 객체를 찾아 반환
 * @param target - 대상 객체
 * @returns - 찾은 경로 객체
 */
function findPath3DObject(target: THREE.Object3D): Path3DObject | undefined {
    let result;

    target.traverseAncestors(parent => {
        if (parent instanceof Path3DObject) {
            result = parent;
        }
    });

    return result;
}

function registerPointerEvents() {
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointermove', onPointerMove);
    engine.Dom.addEventListener('pointerup', onPointerUp);
}

function unregisterPointerEvents() {
    engine.Dom.removeEventListener('pointerdown', onPointerDown);
    engine.Dom.removeEventListener('pointermove', onPointerMove);
    engine.Dom.removeEventListener('pointerup', onPointerUp);
}

// let tt = 0;
// function trainOffsetUpdateLoop() {
//     trainOffsetUpdateLoopHandle = requestAnimationFrame(trainOffsetUpdateLoop);

//     const delta = clock.getDelta();

//     // const ratios = workingTrain.TrainBodyLengthRatios;
//     // if (trainOffsetControlKeyMap['q']) {
//     //     ratios[0] += 0.05 * delta;
//     //     ratios[ratios.length - 2] += 0.05 * delta;
//     //     ratios[ratios.length - 1] += 0.05 * delta;
//     //     workingTrain.TrainBodyLengthRatios = ratios;
//     //     workingTrain.updateTrainLocations(tt);
//     // } else if (trainOffsetControlKeyMap['a']) {
//     //     ratios[0] -= 0.05 * delta;
//     //     ratios[ratios.length - 2] -= 0.05 * delta;
//     //     ratios[ratios.length - 1] -= 0.05 * delta;
//     //     workingTrain.TrainBodyLengthRatios = ratios;
//     //     workingTrain.updateTrainLocations(tt);
//     // } else if (trainOffsetControlKeyMap['w']) {
//     //     for (let i = 1; i < ratios.length - 2; i++) {
//     //         ratios[i] += 0.05 * delta;
//     //     }
//     //     workingTrain.TrainBodyLengthRatios = ratios;
//     //     workingTrain.updateTrainLocations(tt);
//     // } else if (trainOffsetControlKeyMap['s']) {
//     //     for (let i = 1; i < ratios.length - 2; i++) {
//     //         ratios[i] -= 0.05 * delta;
//     //     }
//     //     workingTrain.TrainBodyLengthRatios = ratios;
//     //     workingTrain.updateTrainLocations(tt);
//     // }

//     if (trainOffsetControlKeyMap['1']) {
//         tt += 0.05 * delta;
//         workingTrain.updateTrainLocation(tt);
//     } else if (trainOffsetControlKeyMap['2']) {
//         tt -= 0.05 * delta;
//         workingTrain.updateTrainLocation(tt);
//     }
// }

function onKeyDown(evt: KeyboardEvent) {
    trainOffsetControlKeyMap[evt.key] = true;
}

function onKeyUp(evt: KeyboardEvent) {
    trainOffsetControlKeyMap[evt.key] = false;
}

function onPointerDown(evt: PointerEvent) {

    if (evt.button === 0) {
        mouseDownPos.x = evt.offsetX;
        mouseDownPos.y = evt.offsetY;
    }
}

function onPointerMove(evt: PointerEvent) {

    const mousePos = new THREE.Vector2(
        (evt.offsetX / engine.Dom.clientWidth) * 2 - 1,
        -(evt.offsetY / engine.Dom.clientHeight) * 2 + 1
    );

    const rayCast = new THREE.Raycaster();
    rayCast.layers.set(Interfaces.CustomLayer.Pickable);
    rayCast.setFromCamera(mousePos, engine.Camera);

    switch (mouseState) {
        case Interfaces.SubwayCreateMouseState.SelectPath: {
            Effect.Outline.clearOutlineObjects();
            const intersects = rayCast.intersectObjects(PathData.getPathObjects(), true);
            if (intersects.length > 0) {
                const path3dTarget = findPath3DObject(intersects[0].object);
                if (path3dTarget) {
                    Effect.Outline.setOutlineObjects(path3dTarget);
                }
            }
        } break;
        case Interfaces.SubwayCreateMouseState.SetExitLocation:
        case Interfaces.SubwayCreateMouseState.SetStopLocation:
        case Interfaces.SubwayCreateMouseState.SetEntranceLocation: {
            Effect.Outline.clearOutlineObjects();
            let pickPoint: THREE.Vector3 | undefined;
            const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), workingTrain!.CurvePath.getPoint(0));
            const planePoint = new THREE.Vector3();
            if (rayCast.ray.intersectPlane(plane, planePoint)) {
                pickPoint = planePoint.clone();
            }

            if (pickPoint) {
                workingTrain!.setTrainLocations(pickPoint);
            }
        } break;
    }
}

function onPointerUp(evt: PointerEvent) {

    if (evt.button === 0) {
        const currMousePos: THREE.Vector2 = new THREE.Vector2(evt.offsetX, evt.offsetY);
        if (currMousePos.distanceTo(mouseDownPos) < 5.0) {
            switch (mouseState) {
                case Interfaces.SubwayCreateMouseState.SelectPath: {
                    // 외각선 대상이 되는 경로 객체만 가시화 처리
                    const outlineObjects = Effect.Outline.getOutlineTargets();
                    if (outlineObjects.length > 0) {
                        const targetPath = outlineObjects[0] as Path3DObject;
                        Effect.Outline.clearOutlineObjects();
                        PathData.HideAll();
                        PathData.Show(targetPath.name);

                        // 기차 생성
                        workingTrain = new SubwayTrain(headModelSrc, bodyModelSrc, tailModelSrc, targetPath, createOption.bodyCount);
                        workingTrain.name = createOption.id;
                        subwayTrainRenderGroup.add(workingTrain);

                        // 마우스 상태 변경
                        mouseState = Interfaces.SubwayCreateMouseState.Default;
                    }
                } break;
                case Interfaces.SubwayCreateMouseState.SetEntranceLocation: {
                    workingTrain!.saveEntranceLocation();
                    mouseState = Interfaces.SubwayCreateMouseState.Default;
                } break;
                case Interfaces.SubwayCreateMouseState.SetStopLocation: {
                    workingTrain!.saveStopLocation();
                    mouseState = Interfaces.SubwayCreateMouseState.Default;
                } break;
                case Interfaces.SubwayCreateMouseState.SetExitLocation: {
                    workingTrain!.saveExitLocation();
                    mouseState = Interfaces.SubwayCreateMouseState.Default;
                } break;
            }
        }
    }
}

/**
 * 지하철 생성
 * @param option - 생성 옵션
 * @param onCreate - 생성 완료 후 호출 콜백
 */
function Create(option: Interfaces.SubwayCreateOption, onCreate?: Function) {

    if (PathData.getPathObjects().length === 0) {
        console.error('경로가 생성되어 있지 않음');
        return;
    }

    if (!headModelSrc || !bodyModelSrc || !tailModelSrc) {
        console.error('지하철 모델이 로드되지 않음');
        return;
    }

    Effect.Outline.clearOutlineObjects();

    // 경로 객체들을 레이캐스트 가능한 객체로 변경
    PathData.getPathObjects().forEach(path => Util.setObjectLayer(path, Interfaces.CustomLayer.Default | Interfaces.CustomLayer.Pickable));

    // 옵션 체크
    option.bodyCount = THREE.MathUtils.clamp(option.bodyCount, 4, option.bodyCount); // 최소 4량이상으로 처리

    createOption = option;
    mouseState = Interfaces.SubwayCreateMouseState.SelectPath;

    registerPointerEvents();
}

// /**
//  * 지하철 차량간 간격 조절 기능 on
//  */
// function EnableTrainOffsetControl() {

//     if (!workingTrain) {
//         console.error('작업중인 지하철 없음');
//         return;
//     }

//     document.body.addEventListener('keydown', onKeyDown);
//     document.body.addEventListener('keyup', onKeyUp);
//     trainOffsetUpdateLoop();
// }

// /**
//  * 지하철 차량간 간격 조절 기능 off
//  */
// function DisableTrainOffsetControl() {
//     document.body.removeEventListener('keydown', onKeyDown);
//     document.body.removeEventListener('keyup', onKeyUp);
//     cancelAnimationFrame(trainOffsetUpdateLoopHandle);
// }

function Cancel() {

    Effect.Outline.clearOutlineObjects();

    // 경로 객체를 가시화 객체로 변경
    PathData.getPathObjects().forEach(path => Util.setObjectLayer(path, Interfaces.CustomLayer.Default));

    // 작업 열차
    if (workingTrain) {
        subwayTrainRenderGroup.remove(workingTrain);
        workingTrain.dispose();
    }

    // DisableTrainOffsetControl();
    unregisterPointerEvents();
}

function EnableSetEntranceLocation() {

    if (!workingTrain) {
        console.error('작업중인 지하철 없음');
        return;
    }

    // DisableTrainOffsetControl();

    mouseState = Interfaces.SubwayCreateMouseState.SetEntranceLocation;
}

function EnableSetStopLocation() {

    if (!workingTrain) {
        console.error('작업중인 지하철 없음');
        return;
    }

    // DisableTrainOffsetControl();

    mouseState = Interfaces.SubwayCreateMouseState.SetStopLocation;

}

function EnableSetExitLocation() {

    if (!workingTrain) {
        console.error('작업중인 지하철 없음');
        return;
    }

    // DisableTrainOffsetControl();

    mouseState = Interfaces.SubwayCreateMouseState.SetExitLocation;

}

function Finish(): Interfaces.SubwayImportOption | undefined {
    if (!workingTrain) {
        console.error('작업중인 지하철 없음');
        return;
    }

    Effect.Outline.clearOutlineObjects();
    // 경로 객체를 가시화 객체로 변경
    PathData.getPathObjects().forEach(path => Util.setObjectLayer(path, Interfaces.CustomLayer.Default));

    // 내부 통지
    const exportData = workingTrain?.ExportData;
    Event.InternalHandler.dispatchEvent({
        type: 'onSubwayTrainCreateFinished',
        target: workingTrain
    });
    workingTrain = undefined;

    // DisableTrainOffsetControl();
    unregisterPointerEvents();

    return exportData!;
}

export {
    Create,

    // EnableTrainOffsetControl,
    // DisableTrainOffsetControl,

    Cancel,
    EnableSetEntranceLocation,
    EnableSetStopLocation,
    EnableSetExitLocation,
    Finish,
}