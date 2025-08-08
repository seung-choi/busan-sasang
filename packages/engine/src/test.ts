import * as THREE from 'three';
import * as Event from './eventDispatcher';
import { Engine3D } from './engine';

let engine: Engine3D;
let bStart: boolean = false;
let initialFov: number;
let targetFov: number;
let ratio: number;

let initialPos: THREE.Vector3, finalPos: THREE.Vector3;

/**
 * Engine3D 초기화 이벤트 콜백
 */
Event.InternalHandler.addEventListener('onEngineInitialized' as never, (evt: any) => {
    engine = evt.engine as Engine3D;

    window.addEventListener('keydown', (evt) => {
        if (evt.key === 'c') {
            initialFov = engine.Camera.fov;
            targetFov = 1.0;
            ratio = 0.0;

            const modelRoot = engine.RootScene.getObjectByName('#ModelGroup');
            const bounding = new THREE.Box3().setFromObject(modelRoot as THREE.Object3D);
            const sphere = new THREE.Sphere();
            bounding.getBoundingSphere(sphere);

            initialPos = engine.Camera.position.clone();
            finalPos = engine.Camera.position.clone().addScaledVector(engine.Camera.position.clone().normalize(), sphere.radius);

            bStart = true;
        }
    });
});

Event.InternalHandler.addEventListener('onBeforeRender' as never, (evt: any) => {
    const deltaTime = evt.deltaTime;
    if (bStart) {
        ratio += deltaTime;

        if (ratio >= 1.0) {
            ratio = 1.0;
            bStart = false;
        }

        const fov = THREE.MathUtils.lerp(initialFov, targetFov, ratio);
        engine.Camera.fov = fov;
        engine.Camera.updateProjectionMatrix();

        engine.Camera.position.copy(new THREE.Vector3().lerpVectors(initialPos, finalPos, ratio));
        console.log('fov', fov);
    }
});