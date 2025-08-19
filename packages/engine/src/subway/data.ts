import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as PathData from '../path3d/data';
import { SubwayTrain } from './subwaytrain';
import { Engine3D } from '../engine';

let engine: Engine3D;
let subwayTrainRenderGroup: THREE.Group;
let headModelSrc: THREE.Group;
let bodyModelSrc: THREE.Group;
let tailModelSrc: THREE.Group;
let trains: Record<string, SubwayTrain> = {};

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;
});

/**
 * 열차 렌더링 그룹 생성 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onSubwayTrainRenderGroupCreated' as never, (evt: any) => {
    subwayTrainRenderGroup = evt.target;
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
 * 열차 생성 완료 콜백
 */
Event.InternalHandler.addEventListener('onSubwayTrainCreateFinished' as never, (evt: any) => {
    const train = evt.target;
    trains[train.name] = train;
});

/**
 * 열차 숨기기
 * @param id - 열차 id값
 */
function Hide(id: string) {
    if (trains.hasOwnProperty(id))
        trains[id].visible = false;
}

/**
 * 열차 보이기
 * @param id - 열차 id값
 */
function Show(id: string) {
    if (trains.hasOwnProperty(id))
        trains[id].visible = true;
}

/**
 * 모든 열차 숨기기
 */
function HideAll() {
    Object.values(trains).forEach(train => train.visible = false);
}

/**
 * 모든 열차 보이기
 */
function ShowAll() {
    Object.values(trains).forEach(train => train.visible = true);
}

/**
 * 열차 진입 애니메이션 시작
 * @param id - 열차 id값
 * @param transitionTime - 애니메이션 시간
 * @param onComplete - 완료후 콜백
 */
function DoEnter(id: string, transitionTime: number = 5.0, onComplete: Function | undefined) {
    if (trains.hasOwnProperty(id))
        trains[id].doEnter(engine.TweenUpdateGroups, transitionTime, onComplete);
}

/**
 * 열차 진출 애니메이션 시작
 * @param id - 열차 id값
 * @param transitionTime - 애니메이션 시간
 * @param onComplete - 완료후 콜백
 */
function DoExit(id: string, transitionTime: number = 5.0, onComplete: Function | undefined) {
    if (trains.hasOwnProperty(id))
        trains[id].doExit(engine.TweenUpdateGroups, transitionTime, onComplete);
}

/**
 * 모든 기차 제거
 */
function Clear() {
    Object.values(trains).forEach(train => {
        train.parent?.remove(train);
        train.dispose();
    });
    trains = {};
}

/**
 * 데이터 익스포트
 */
function Export(): Interfaces.SubwayImportOption[] {
    const result: Interfaces.SubwayImportOption[] = [];

    Object.values(trains).forEach(train => result.push(train.ExportData));

    return result;
}

/**
 * 데이터 임포트
 */
function Import(data: Interfaces.SubwayImportOption | Interfaces.SubwayImportOption[] | string) {

    if (!headModelSrc || !bodyModelSrc || !tailModelSrc) {
        console.warn('열차 모델링 로드 안됨');
        return;
    }

    Clear();

    // 파라미터가 문자열이면 object로 전환
    if (typeof data === 'string')
        data = JSON.parse(data);

    // 배열로 전환
    if (Array.isArray(data) === false)
        data = [data as Interfaces.SubwayImportOption];

    // 생성
    data.forEach(item => {

        const path = PathData.getPathObject(item.pathId);
        if (!path) {
            console.warn('경로를 찾을 수 없음:', item.pathId);
            return;
        }

        const train = new SubwayTrain(headModelSrc, bodyModelSrc, tailModelSrc, path, item.bodyCount);
        train.name = item.id;
        subwayTrainRenderGroup.add(train);

        train.EntranceUValue = item.entranceUValue;
        train.StopUValue = item.stopUValue;
        train.ExitUValue = item.exitUValue;
        train.updateTrainLocation(train.EntranceUValue);

        trains[train.name] = train;
    });
}

export {
    Hide,
    Show,
    HideAll,
    ShowAll,
    DoEnter,
    DoExit,

    Clear,
    Export,
    Import,
}