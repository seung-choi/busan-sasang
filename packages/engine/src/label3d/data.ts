import * as THREE from 'three';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import * as Util from '../util';
import * as ModelInternal from '../model/model';
import { Engine3D } from '../engine';
import { Label3DElement } from './element';

let engine: Engine3D;
let labels: Record<string, Label3DElement> = {};

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;
});

/**
 * 라벨 생성 완료 콜백
 */
Event.InternalHandler.addEventListener('onLabel3DCreated' as never, (evt: any) => {
    const label: Label3DElement = evt.target;
    labels[label.name] = label;
});

/**
 * 레이캐스트 대상 얻기
 */
function getPickableObjects(): Label3DElement[] {
    return Object.values(labels);
}

/**
 * 라벨 숨기기
 * @param id - 라벨id값
 */
function Hide(id: string) {
    if (labels.hasOwnProperty(id))
        labels[id].visible = false;
}

/**
 * 라벨 가시화
 * @param id - 라벨id값
 */
function Show(id: string) {
    if (labels.hasOwnProperty(id))
        labels[id].visible = true;
}

/**
 * 라벨 모두 숨기기
 */
function HideAll() {
    Object.values(labels).forEach(label => label.visible = false);
}

/**
 * 라벨 모두 보이기
 */
function ShowAll() {
    Object.values(labels).forEach(label => label.visible = true);
}

/**
 * id로 라벨 제거
 * @param id - 제거할 라벨 id값
 */
function Delete(id: string) {
    if (labels.hasOwnProperty(id)) {
        const label = labels[id];
        label.dispose();
        delete labels[id];
    }
}

/**
 * 데이터 비우기
 */
function Clear() {
    Object.values(labels).forEach(label => label.dispose());
    labels = {};
}

/**
 * 데이터 익스포트
 * @returns - 라벨3d 데이터 배열
 */
function Export(): Interfaces.Label3DImportOption[] {
    const result: Interfaces.Label3DImportOption[] = [];

    Object.values(labels).forEach(label => result.push(label.ExportData));

    return result;
}

/**
 * 데이터 임포트
 * @param data - 임포트 데이터
 */
function Import(data: Interfaces.Label3DImportOption | Interfaces.Label3DImportOption[] | string) {

    // 비주얼 리소스 업데이트 없이 이전의 생성 요소 제거
    Clear();

    // 파라미터가 문자열이면 object로 전환
    if (typeof data === 'string')
        data = JSON.parse(data);

    // 배열로 전환
    if (Array.isArray(data) === false)
        data = [data as Interfaces.Label3DImportOption];

    // 생성
    data.forEach(item => {

        const floorObj = ModelInternal.getFloorObject(item.floorId);
        if (!floorObj) {
            console.error('층객체 못찾음', item.floorId);
            return;
        }

        const size = new THREE.Vector2();
        const material = Util.createTextMaterial(item.displayText, size, false, 32);
        const label = new Label3DElement(material, size);
        label.name = item.id;
        label.userData['displayText'] = item.displayText;
        label.userData['floorId'] = item.floorId;
        floorObj.add(label);

        label.position.set(item.position.x, item.position.y, item.position.z);
        label.rotation.set(item.rotation.x, item.rotation.y, item.rotation.z);
        label.scale.set(item.scale.x, item.scale.y, item.scale.z);

        labels[label.name] = label;

    });

}

export {
    getPickableObjects,

    Hide,
    Show,
    HideAll,
    ShowAll,

    Delete,
    Clear,
    Export,
    Import,
}
