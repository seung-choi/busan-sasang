import * as THREE from 'three';
import * as Camera from '../camera';
import * as Interfaces from '../interfaces';
import * as Event from '../eventDispatcher';
import * as Util from '../util';
import { Path3DObject } from './path3dobject';
import { Path3DLineObject } from './path3dlineobject';
import { Engine3D } from '../engine';
import * as Data from './data';

let engine: Engine3D;
let workingPath: Path3DObject;
let pathRenderGroup: THREE.Group;
let bLeftBtnDown: boolean = false;
let controlPoint: THREE.Vector3 | undefined;
let mouseDownPickData: any;
let cursor: THREE.Mesh;
let previewLine: Path3DLineObject;
let isStraightLine: boolean = false;
const mouseDownPos: THREE.Vector2 = new THREE.Vector2();
const rayCast: THREE.Raycaster = new THREE.Raycaster();

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    // 경로 객체 렌더링 그룹
    pathRenderGroup = new THREE.Group();
    pathRenderGroup.name = '#PathRenderGroup';
    engine.RootScene.add(pathRenderGroup);

    // 커서
    cursor = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 32, 32),
        new THREE.MeshBasicMaterial({ color: 'red' })
    );
    cursor.name = '#Cursor';
    cursor.layers.set(Interfaces.CustomLayer.Invisible);
    pathRenderGroup.add(cursor);

    rayCast.layers.set(Interfaces.CustomLayer.Pickable);

    // pathcreator.ts 초기화 완료 내부 통지
    Event.InternalHandler.dispatchEvent({
        type: 'onPathCreatorInitialized',
        pathRenderGroup: pathRenderGroup,
    });
});

/**
 * 마우스 좌표에 대해 공간상의 픽킹 좌표 계산
 * @param mousePos - 마우스 좌표
 * @returns - 공간상의 픽킹 위치
 */
function getPickPoint(mousePos: THREE.Vector2) {

    // 마우스 좌표를 뷰포트 공간으로
    const viewportMousePos = new THREE.Vector2(
        (mousePos.x / engine.Dom.clientWidth) * 2 - 1,
        -(mousePos.y / engine.Dom.clientHeight) * 2 + 1
    );

    // 마우스 위치를 기준으로 레이캐스트 생성
    rayCast.setFromCamera(viewportMousePos, engine.Camera);

    // 씬에서 충돌하는 객체 찾기
    const intersects = rayCast.intersectObjects(engine.RootScene.children, true);

    // 충돌한 객체가 있으면 첫번째 객체의 위치 반환
    if (intersects.length > 0) {

        // 픽킹좌표를 층기준 로컬 좌표로 전환
        const floorObject = Util.getFloorObject(intersects[0].object);
        const pickedPointLocal = floorObject.worldToLocal(intersects[0].point.clone());

        return {
            worldPoint: intersects[0].point,
            localPoint: pickedPointLocal,
            pickedFloor: floorObject,
        };
    } else {
        // 배경 모델과 충돌하지 않는 경우 평면과 교차 테스트
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const point = new THREE.Vector3();
        if (rayCast.ray.intersectPlane(plane, point)) {
            const floorObject = Util.getFloorObject();
            const pickedPointLocal = floorObject.worldToLocal(point.clone());

            return {
                worldPoint: point,
                localPoint: pickedPointLocal,
                pickedFloor: floorObject,
            };
        }
    }

    return undefined;
}

/**
 * 마우스 좌표에 대해 공간상의 평면 픽킹 좌표 계산
 * @param mousePos - 마우스 좌표
 * @param planeBasePoint - 평면의 기준점 (기본값: 원점)
 * @returns - 평면과 교차하는 픽킹 위치
 */
function getPickPointFromPlane(mousePos: THREE.Vector2, planeBasePoint: THREE.Vector3) {
    // 마우스 좌표를 뷰포트 공간으로
    mousePos.x = (mousePos.x / engine.Dom.clientWidth) * 2 - 1;
    mousePos.y = -(mousePos.y / engine.Dom.clientHeight) * 2 + 1;

    // 마우스 위치를 기준으로 레이캐스트 생성
    rayCast.setFromCamera(mousePos, engine.Camera);

    // 평면과 교차 테스트
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), planeBasePoint);
    const point = new THREE.Vector3();
    if (rayCast.ray.intersectPlane(plane, point)) {
        const floorObject = Util.getFloorObject();
        const pickedPointLocal = floorObject.worldToLocal(point.clone());

        return {
            worldPoint: point,
            localPoint: pickedPointLocal,
            pickedFloor: floorObject,
        };
    }

    return undefined;
}

/**
 * 포인터 다운 이벤트 처리
 * @param event - 포인터 다운 이벤트 정보
 */
function onPointerDown(evt: PointerEvent) {
    if (evt.button === 0) {
        mouseDownPos.x = evt.offsetX;
        mouseDownPos.y = evt.offsetY;

        mouseDownPickData = getPickPoint(mouseDownPos);
        controlPoint = undefined;

        bLeftBtnDown = true;
    }
}

/**
 * 포인터 이동 이벤트 처리
 * @param event - 포인터 이동 이벤트 정보
 */
function onPointerMove(evt: PointerEvent) {

    const currMousePos = new THREE.Vector2(evt.offsetX, evt.offsetY);

    let pickData = getPickPoint(currMousePos);

    if (!pickData) {
        console.warn('경로 생성 실패: 픽킹 좌표를 찾을 수 없습니다.');
        return;
    }

    cursor.position.copy(pickData?.worldPoint as THREE.Vector3);

    const lastPoint = workingPath.LastPoint;
    if (lastPoint) {
        if (bLeftBtnDown) {
            const mouseDistance = mouseDownPos.distanceTo(currMousePos);
            if (mouseDistance <= 10.0)
                return;

            let currPickData = getPickPointFromPlane(new THREE.Vector2(evt.offsetX, evt.offsetY), lastPoint.WorldPosition);
            const distance = mouseDownPickData!.worldPoint.distanceTo(currPickData!.worldPoint);
            const direction = new THREE.Vector3().subVectors(mouseDownPickData!.worldPoint, currPickData!.worldPoint).normalize();
            controlPoint = mouseDownPickData!.worldPoint.clone().addScaledVector(direction, distance);

            previewLine.Curve.v0 = lastPoint.WorldPosition;
            previewLine.Curve.v1 = controlPoint!;
            previewLine.Curve.v2 = mouseDownPickData!.worldPoint;
            previewLine.updateGeometry();

            isStraightLine = false;
        } else {

            const centerPoint = new THREE.Vector3().lerpVectors(lastPoint.WorldPosition, pickData.worldPoint, 0.5);

            previewLine.Curve.v0 = lastPoint.WorldPosition;
            previewLine.Curve.v1 = centerPoint.clone();
            previewLine.Curve.v2 = pickData.worldPoint;
            previewLine.updateGeometry();

            isStraightLine = true;
        }
    }
}

/**
 * 포인터 업 이벤트 처리
 * @param event - 포인터 업 이벤트 정보
 */
function onPointerUp(evt: PointerEvent) {
    if (evt.button === 0) {
        const mouseUpPos = new THREE.Vector2(evt.offsetX, evt.offsetY);
        const pickData = getPickPoint(mouseUpPos);

        if (pickData) {
            const lastPoint = workingPath.LastPoint;
            if (lastPoint) {
                const cp = (controlPoint) ? controlPoint : new THREE.Vector3().lerpVectors(lastPoint.WorldPosition, pickData.worldPoint, 0.5);
                const ep = (controlPoint) ? mouseDownPickData.worldPoint : pickData.worldPoint;
                const floorObj = (controlPoint) ? mouseDownPickData.pickedFloor : pickData.pickedFloor;
                workingPath.addCurvePoint(cp, ep, floorObj, isStraightLine);
            } else {
                workingPath.addPathPoint(pickData.worldPoint, pickData.pickedFloor);
            }
        }

        bLeftBtnDown = false;
    }
}

/**
 * 포인터 이벤트 등록
 */
function registerEventListeners() {
    engine.Dom.addEventListener('pointerdown', onPointerDown);
    engine.Dom.addEventListener('pointermove', onPointerMove);
    engine.Dom.addEventListener('pointerup', onPointerUp);
}

/**
 * 포인터 이벤트 등록 해제
 */
function unregisterEventListeners() {
    engine.Dom.removeEventListener('pointerdown', onPointerDown);
    engine.Dom.removeEventListener('pointermove', onPointerMove);
    engine.Dom.removeEventListener('pointerup', onPointerUp);
}

/**
 * 경로 생성 작업 시작
 * @param id - 경로id
 * @param color - 색상
 */
function CreatePath(id: string, color: string | number) {

    // 중복생성확인
    if (Data.exists(id)) {
        console.warn('id에 해당하는 경로가 이미 생성되어 있음: ', id);
        return;
    }

    // 카메라 회전을 휠버튼으로 설정
    Camera.SetRotateButton(Interfaces.MouseButton.Middle);

    // 새 경로 객체 생성
    workingPath = new Path3DObject(color);
    workingPath.name = id;
    pathRenderGroup.add(workingPath);

    // 커서 가시화 상태
    cursor.layers.set(Interfaces.CustomLayer.Default);

    // 미리보기 선객체
    previewLine = new Path3DLineObject(
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        workingPath.ExtrudeShape,
        workingPath.PathWidth,
        workingPath.PathColor
    );
    pathRenderGroup.add(previewLine);

    // 이벤트 등록
    registerEventListeners();
}

/**
 * 경로 생성 작업 취소
 */
function Cancel() {

    // 카메라 회전 버튼값 복구
    Camera.SetRotateButton(Interfaces.MouseButton.Left);

    // 커서 가시화 상태
    cursor.layers.set(Interfaces.CustomLayer.Invisible);

    // 작업객체
    pathRenderGroup.add(workingPath);
    workingPath.dispose();

    // 미리보기 선객체    
    pathRenderGroup.remove(previewLine);
    previewLine.dispose();

    // 이벤트 등록 해제
    unregisterEventListeners();
}

/**
 * 경로 생성 작업 완료
 */
function Finish(): Interfaces.Path3DData {

    // 카메라 회전 버튼값 복구
    Camera.SetRotateButton(Interfaces.MouseButton.Left);

    // 작업 완료 내부 통지
    Event.InternalHandler.dispatchEvent({
        type: 'onPathCreatorFinished',
        target: workingPath
    });

    // 커서 가시화 상태
    cursor.layers.set(Interfaces.CustomLayer.Invisible);

    // 미리보기 선객체    
    pathRenderGroup.remove(previewLine);
    previewLine.dispose();

    // 이벤트 등록 해제
    unregisterEventListeners();

    return workingPath.ExportData;
}

export {
    CreatePath,
    Cancel,
    Finish,
}