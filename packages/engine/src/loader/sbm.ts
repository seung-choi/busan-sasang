import * as THREE from 'three';
import * as Addon from 'three/addons';
import * as Event from '../eventDispatcher';
import * as Interfaces from '../interfaces';
import { Engine3D } from '../engine';
import { SbmBinaryReader } from './sbmBinaryReader';
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
 * 대상 객체의 재질에 환경맵을 적용한다.
 * @param target - 대상 객체
 */
function setEnvMap(target: THREE.Object3D) {
    target.traverse((child) => {
        if (child instanceof THREE.Mesh) {
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
}

/**
 * sbm용 xml파일로부터 정보를 읽어 모델을 로드
 * @param url - *.xml파일 주소
 * @param onLoad - 로드 완료 후 호출될 콜백 함수
 */
async function LoadSbm(url: string, onLoad: Function) {

    const urlFull = url;
    const dirName = urlFull.substring(0, urlFull.lastIndexOf('/')) + '/';
    const fileName = urlFull.substring(urlFull.lastIndexOf('/') + 1);

    // sbm 루트 그룹 생성
    const sbmRootGroup = new THREE.Group();
    sbmRootGroup.name = fileName;
    ModelInternal.ModelGroup.add(sbmRootGroup);

    // sbm용 *.xml 데이터 요청
    const response = await fetch(urlFull);
    const xmlText = await response.text();
    const xmlDoc = new DOMParser().parseFromString(xmlText, 'text/xml');

    // xml로부터 층정보 읽기
    const floors = xmlDoc.querySelector('Floors') as Element;
    for (let i = 0; i < floors.children.length; i++) {
        // 층
        const floor = floors.children[i];
        // 층정보
        const floorId = floor.getAttribute('id');
        const displayName = floor.getAttribute('name');
        const order = floor.getAttribute('baseFloor');

        const fileSource = floor.querySelector('FileSource') as Element;
        const sbmFileName = fileSource.getAttribute('name') as string;

        const sbmFileUrl = dirName + sbmFileName;
        const sbmReader = new SbmBinaryReader(dirName, await (await fetch(sbmFileUrl)).arrayBuffer());
        const floorMesh = sbmReader.generateMesh();
        floorMesh.name = `${sbmFileName}/${floorId}`;
        floorMesh.userData['type'] = 'floor';
        floorMesh.userData['displayName'] = displayName;
        floorMesh.userData['floorId'] = floorId;
        floorMesh.userData['sortingorder'] = order;
        setEnvMap(floorMesh); // 환경맵 적용

        sbmRootGroup.attach(floorMesh);
    }

    // 로드 완료 내부 이벤트 통지
    Event.InternalHandler.dispatchEvent({
        type: 'onGltfLoaded',
        target: sbmRootGroup,
    });
    // 그림자맵 업데이트 이벤트 통지
    Event.InternalHandler.dispatchEvent({
        type: 'onShadowMapNeedsUpdate',
        shadowMapTarget: ModelInternal.ModelGroup,
    });

    // 로드 완료 콜백 호출
    onLoad?.();
}

export {
    LoadSbm,
}