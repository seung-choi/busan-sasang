import * as THREE from "three";
import * as Addon from 'three/addons';
import * as Event from '../eventDispatcher';
import { Engine3D } from '../engine';

let engine: Engine3D;
let headModelSrc: THREE.Group;
let bodyModelSrc: THREE.Group;
let tailModelSrc: THREE.Group;

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;
});

/**
 * 지하철 열차 머리 모델 로드
 * @param url - 모델링 주소
 * @param onLoad - 로드 완료 후 호출 콜백
 */
function LoadTrainHead(url: string, onLoad: Function) {
    new Addon.GLTFLoader().load(url, (gltf)=>{

        headModelSrc = gltf.scene;

        // 이벤트 내부 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onSubwayModelLoader_HeadModelLoaded',
            target: headModelSrc
        });

        // 완료 콜백 호출
		onLoad?.();
    });
}

/**
 * 지하철 열차 몸체 모델 로드
 * @param url - 모델링 주소
 * @param onLoad - 로드 완료 후 호출 콜백
 */
function LoadTrainBody(url: string, onLoad: Function) {
    new Addon.GLTFLoader().load(url, (gltf)=>{

        bodyModelSrc = gltf.scene;
        
        // 이벤트 내부 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onSubwayModelLoader_BodyModelLoaded',
            target: bodyModelSrc
        });

        // 완료 콜백 호출
        onLoad?.();
    });
}

/**
 * 지하철 열차 꼬리 모델 로드
 * @param url - 모델링 주소
 * @param onLoad - 로드 완료 후 호출 콜백
 */
function LoadTrainTail(url: string, onLoad: Function) {
    new Addon.GLTFLoader().load(url, (gltf)=>{

        tailModelSrc = gltf.scene;
        
        // 이벤트 내부 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onSubwayModelLoader_TailModelLoaded',
            target: tailModelSrc
        });

        // 완료 콜백 호출
        onLoad?.();
    });
}

export {
    LoadTrainHead,
    LoadTrainBody,
    LoadTrainTail,
};
