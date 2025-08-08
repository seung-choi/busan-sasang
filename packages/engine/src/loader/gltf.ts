import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import { Engine3D } from '../engine';
import * as ModelInternal from '../model/model';

let engine: Engine3D;

/**
 * Engine3D 초기화 이벤트 콜백
 * 
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;
});

/**
 * Gltf모델 로드
 * @param url - *.glb 모델링 파일 주소
 * @param onLoad - 로드 완료 후 호출될 콜백함수
 */
function LoadGltf(url: string, onLoad: Function) {
    new Addon.GLTFLoader().load(url, (gltf) => {

        // 객체 그림자 설정
        gltf.scene.traverse((child) => {
            // 클릭가능한 객체로
            child.layers.enable(Interfaces.CustomLayer.Pickable);

            // 메시 객체면 그림자 설정
            if (child instanceof THREE.Mesh) {
                child.receiveShadow = true;
                child.castShadow = true;

                // 재질 환경맵
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => {
                        mat.envMap = engine.GeneratedCubeRenderTarget.texture;
                        mat.envMapIntensity = 0.1;
                        mat.needsUpdate = true;
                    });
                } else {
                    child.material.envMap = engine.GeneratedCubeRenderTarget.texture;
                    child.material.envMapIntensity = 0.1;
                    child.material.needsUpdate = true;
                }

            }
        });

        // 씬에 추가
        ModelInternal.ModelGroup.add(gltf.scene);

        // 로드 완료 내부 이벤트 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onGltfLoaded',
            target: gltf.scene,
        });
        // 그림자맵 업데이트 이벤트 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onShadowMapNeedsUpdate',
            shadowMapTarget: ModelInternal.ModelGroup,
        });

        // 로드 완료 콜백 호출
        onLoad?.();
    }, undefined, (error: unknown) => console.error(error));
}

/**
 * url주소에 해당하는 gltf 모델링을 로드하여 애니메이션과 씬을 반환한다
 * @param url - gltf 모델링 주소
 * @returns - gltf 씬 객체와 애니메이션 정보
 */
async function getGltfWithAnimation(url: string) {

    if (url === undefined || url === 'undefined') {
        return {
            animations: [],
            scene: undefined,
        }
    };

    let animations: THREE.AnimationClip[] = [];
    let scene: any;

    await new Addon.GLTFLoader().loadAsync(url).then(gltf => {

        // 그림자, 재질 설정
        gltf.scene.traverse((child) => {
            if( child instanceof THREE.Mesh ) {
                child.receiveShadow = true;
                child.castShadow = true;

                if( Array.isArray(child.material) ) {
                    child.material.forEach(mat => {
                        mat.envMap = engine.GeneratedCubeRenderTarget.texture;
                        mat.envMapIntensity = 0.1;
                        mat.needsUpdate = true;
                    });
                } else {
                    child.material.envMap = engine.GeneratedCubeRenderTarget.texture;
                    child.material.envMapIntensity = 0.1;
                    child.material.needsUpdate = true;
                }
            }
        });

        // 결과값
        animations = gltf.animations;
        scene = gltf.scene;
    });

    return {
        animations: animations,
        scene: scene,
    }

}

export {
    getGltfWithAnimation,

    LoadGltf,
}