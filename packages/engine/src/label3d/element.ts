import * as THREE from 'three';
import * as Interfaces from '../interfaces';

/**
 * 라벨3d 요소
 */
class Label3DElement extends THREE.Mesh {

    private baseSize: THREE.Vector2;

    /**
     * 생성자
     * @param material - 텍스트 재질
     * @param size - 가로세로 너비
     */
    constructor(material: THREE.MeshBasicMaterial, size: THREE.Vector2) {
        super();

        this.baseSize = size.clone();
        this.material = material;
        this.geometry = new THREE.PlaneGeometry(1, 1.10, 1, 1);
        // this.geometry.translate(0, 2.0, 0);

        this.geometry.rotateX(Math.PI * -0.5);
        // (this.geometry.attributes.uv as THREE.BufferAttribute).setY(0, 1.5);
        // (this.geometry.attributes.uv as THREE.BufferAttribute).setY(1, 1.5);
        // (this.geometry.attributes.uv as THREE.BufferAttribute).setY(2, -1.0);
        // (this.geometry.attributes.uv as THREE.BufferAttribute).setY(3, -1.0);

        this.scale.set(this.baseSize.x * 0.1, 1, this.baseSize.y * 0.1);
    }

    /**
     * 메모리 해제
     */
    dispose() {
        this.parent?.remove(this);

        (this.material as THREE.MeshBasicMaterial).map?.dispose();
        (this.material as THREE.MeshBasicMaterial).dispose();
        this.geometry.dispose();
    }

    /**
     * 익스포트 옵션
     */
    get ExportData(): Interfaces.Label3DImportOption {

        const pos = new Interfaces.Vector3Custom(this.position.x, this.position.y, this.position.z);
        const rot = new Interfaces.Vector3Custom(this.rotation.x, this.rotation.y, this.rotation.z);
        const scale = new Interfaces.Vector3Custom(this.scale.x, this.scale.y, this.scale.z);

        return {
            id: this.name,
            displayText: this.userData['displayText'],
            floorId: this.userData['floorId'],
            position: pos.ExportData,
            rotation: rot.ExportData,
            scale: scale.ExportData,
        };
    }
}

export {
    Label3DElement,
}