import * as THREE from 'three';
import * as Interfaces from '../interfaces';

/**
 * 경로 위치점 객체
 */
class Path3DPointObject extends THREE.Group {
    /**
     * 생성자
     */
    constructor(width: number, color: THREE.Color) {
        super();

        // 3d메시
        const radius = width * 0.5;
        const geometry = new THREE.CylinderGeometry(radius, radius, width, 20);
        const material = new THREE.MeshBasicMaterial({ color: color });
        const mesh = new THREE.Mesh(geometry, material);
        this.add(mesh);

        // 스프라이트
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: 'white', depthTest: false, depthWrite: false, }));
        sprite.scale.set(0.1, 0.1, 1);
        this.add(sprite);
    }

    /**
     * 메모리 해제
     */
    dispose() {
        this.parent?.remove(this);

        this.traverse(child=>{
            if( child instanceof THREE.Sprite ) {
                child.material.dispose();
            } else if (child instanceof THREE.Mesh ) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
    }

    /**
     * 월드 좌표
     */
    get WorldPosition(): THREE.Vector3 {
        const worldPoint = new THREE.Vector3();
        this.getWorldPosition(worldPoint);
        return worldPoint;
    }

    /**
     * 익스포트 데이터
     */
    get ExportData(): Interfaces.Path3DPointData {
        return {
            id: this.name,
            floorId: this.userData['floorId'],
            isStraightLine: this.userData['isStraightLine'],
            point: {
                x: this.position.x,
                y: this.position.y,
                z: this.position.z
            }
        };
    }

    /**
     * 행렬 업데이트 함수 오버라이드
     */
    updateMatrix(): void {
        
        super.updateMatrix();

        // 직선의 제어점인 경우 시작-종료점간의 중간위치로 설정
        if (this.userData['isStraightLine']) {
            const startPos = this.userData['startPointObj'].WorldPosition;
            const endPos = this.userData['endPointObj'].WorldPosition;
            const center = new THREE.Vector3().lerpVectors(startPos, endPos, 0.5);

            const localCenter = this.parent!.worldToLocal(center);
            this.position.copy(localCenter);
        }
    }
}

export {
    Path3DPointObject,
}