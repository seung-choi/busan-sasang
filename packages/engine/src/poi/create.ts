import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Interfaces from '../interfaces';
import * as Event from '../eventDispatcher';
import * as Util from '../util';
import { Engine3D } from '../engine';
import { PoiElement } from './element';
import * as PoiData from './data';

let poiRootGroup: THREE.Group;
let iconGroup: THREE.Group;
let lineGroup: THREE.Group;
let textGroup: THREE.Group;
let pointMeshGroup: THREE.Group;

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {

    const engine: Engine3D = evt.engine as Engine3D;

    // poi 최상위 루트 그룹
    poiRootGroup = new THREE.Group();
    poiRootGroup.name = '#PoiRootGroup';
    engine.RootScene.add(poiRootGroup);

    // 아이콘 그룹
    iconGroup = new THREE.Group();
    iconGroup.name = '#IconGroup';
    poiRootGroup.add(iconGroup);

    // 라인 그룹
    lineGroup = new THREE.Group();
    lineGroup.name = '#LineGroup';
    poiRootGroup.add(lineGroup);

    // 텍스트 그룹
    textGroup = new THREE.Group();
    textGroup.name = '#TextGroup';
    poiRootGroup.add(textGroup);

    // 위치점 메시 그룹
    pointMeshGroup = new THREE.Group();
    pointMeshGroup.name = '#PointMeshGroup';
    poiRootGroup.add(pointMeshGroup);

    // poi 관련 씬그룹 생성 이벤트 통지
    Event.InternalHandler.dispatchEvent({
        type: 'onPoiSceneGroupCreated',
        poiRootGroup: poiRootGroup,
        iconGroup: iconGroup,
        textGroup: textGroup,
        lineGroup: lineGroup,
        pointMeshGroup: pointMeshGroup,
    });
});

/**
 * poi 생성
 * @param option - poi 생성 옵션
 */
function Create(option: Interfaces.PoiCreateOption, onComplete?: Function) {
    // 중복 체크
    if( PoiData.exists(option.id)) {
        console.warn(`${option.id} has already exists.`);
        return;
    }

    // 아이콘 재질이 로드된 상태가 아니면 로드
    const iconMaterial = PoiData.getIcon(option.iconUrl);

    // poi용 아이콘 스프라이트 생성
    const iconObj = new THREE.Sprite(iconMaterial);
    iconObj.center.set(0.5, 0.0);
    iconObj.scale.setScalar(0.05);
    iconGroup.add(iconObj);

    // 텍스트 생성
    const textMesh = PoiData.createTextMesh(option.displayText);
    textGroup.add(textMesh);

    // poi 데이터 속성 설정
    const element = new PoiElement(option);
    element.position = new Interfaces.Vector3Custom();
    element.IconObject = iconObj;
    element.TextObject = textMesh;

    // poi 생성 이벤트 내부 통지
    Event.InternalHandler.dispatchEvent({
        type: 'onPoiCreate',
        target: element,
        onCompleteCallback: onComplete,
    });
}

export {
    Create,
}