import * as THREE from 'three';
import * as Interfaces from '../interfaces';
import * as Event from '../eventDispatcher';
import * as ModelInternal from '../model/model';
import * as Util from '../util';

/**
 * poi 개별요소 클래스
 */
class PoiElement implements Interfaces.PoiCreateOption {

    public id: string;
    public iconUrl: string;
    public modelUrl?: string;
    public displayText: string;
    public property: { [key: string]: any };

    public position: Interfaces.Vector3Custom;
    private iconObj?: THREE.Sprite;
    private textObj?: THREE.Object3D;
    private lineHeight: number;

    private floorId?: string;

    private pointMeshData: PoiPointMeshData;

    private visibleState: boolean;
    private lineVisibleState: boolean = true;
    private textVisibleState: boolean = true;

    private mixer: THREE.AnimationMixer | undefined;
    private actions: Record<string, THREE.AnimationAction>;

    /**
     * 생성자
     * @param option - poi 생성 옵션
     */
    constructor(option: Interfaces.PoiCreateOption) {
        // 옵션값
        this.id = option.id;
        this.modelUrl = option.modelUrl;
        this.iconUrl = option.iconUrl;
        this.displayText = option.displayText;
        this.property = option.property;

        this.position = new Interfaces.Vector3Custom();
        this.lineHeight = 1.0;

        this.pointMeshData = {
            instanceMeshRef: undefined,
            instanceIndex: -1,
            rotation: new Interfaces.EulerCustom,
            scale: new Interfaces.Vector3Custom(1, 1, 1),
            animMeshRef: undefined,
        };

        this.visibleState = true;
        this.mixer = undefined;
        this.actions = {};
    }

    /**
     * 아이콘 오브젝트
     */
    set IconObject(value: THREE.Sprite) {
        this.iconObj = value;
    }

    /**
     * 텍스트 오브젝트
     */
    set TextObject(value: THREE.Object3D) {
        this.textObj = value;
    }

    /**
     * 월드 위치 설정
     */
    set WorldPosition(value: THREE.Vector3) {
        // 기준 좌표
        this.position?.copy(value);

        // 아이콘
        this.iconObj?.position.copy(value.clone().addScaledVector(new THREE.Vector3(0, 1, 0), this.lineHeight));

        // 텍스트
        this.textObj?.position.copy(value.clone().addScaledVector(new THREE.Vector3(0, 1, 0), this.lineHeight));

        // 위치점 애니메이션 메시
        this.pointMeshData.animMeshRef?.position.copy(value);
    }

    /**
     * 월드 위치
     */
    get WorldPosition(): THREE.Vector3 {
        return this.position;
    }

    /**
     * 로컬 회전
     */
    set Rotation(value: THREE.Euler) {
        // 회전값
        this.PointMeshData.rotation.copy(value);

        // 애니메이션 메시
        this.pointMeshData.animMeshRef?.rotation.copy(value);
    }
    /**
     * 로컬 회전
     */
    get Rotation(): THREE.Euler {
        return this.pointMeshData.rotation;
    }

    /**
     * 로컬 스케일
     */
    set Scale(value: THREE.Vector3) {
        this.pointMeshData.scale.copy(value);

        this.pointMeshData.animMeshRef?.scale.copy(value);
    }

    /**
     * 로컬 스케일
     */
    get Scale() {
        return this.pointMeshData.scale;
    }

    /**
     * 층 id값
     */
    set FloorId(value: string) {
        this.floorId = value;
    }

    /**
     * 층 id값
     */
    get FloorId(): string {
        return this.floorId as string;
    }

    /**
     * 선길이
     */
    get LineHeight(): number {
        return this.lineHeight;
    }

    /**
     * 위치점 메시 데이터
     */
    get PointMeshData(): PoiPointMeshData {
        return this.pointMeshData;
    }

    /**
     * poi 데이터
     */
    get ExportData() {
        return {
            id: this.id,
            iconUrl: this.iconUrl,
            modelUrl: this.modelUrl,
            displayText: this.displayText,
            property: this.property,
            floorId: this.floorId,
            position: ModelInternal.convertWorldToFloorLocal(this.position.clone(), this.floorId as string),
            rotation: this.pointMeshData.rotation.ExportData,
            scale: this.pointMeshData.scale.ExportData,
        };
    }

    /**
     * 가시화 상태
     */
    get Visible(): boolean {
        return this.visibleState;
    }

    /**
     * 가시화 상태
     */
    set Visible(value: boolean) {
        this.visibleState = value;

        if (this.visibleState) {
            (this.iconObj as THREE.Sprite).visible = true;
            this.iconObj?.layers.set(Interfaces.CustomLayer.Default);

            // (this.textObj as THREE.Object3D).visible = this.textVisibleState;
            // this.textObj?.layers.set(this.textVisibleState ? Interfaces.CustomLayer.Default : Interfaces.CustomLayer.Invisible);

            // 위치점 애니메이션 메시
            if (this.pointMeshData.animMeshRef !== undefined) {
                this.pointMeshData.animMeshRef.visible = true;
                Util.setObjectLayer(this.pointMeshData.animMeshRef, Interfaces.CustomLayer.Default);
            }
        } else {
            (this.iconObj as THREE.Sprite).visible = false;
            this.iconObj?.layers.set(Interfaces.CustomLayer.Invisible);

            // (this.textObj as THREE.Object3D).visible = this.textVisibleState;
            // this.textObj?.layers.set(this.textVisibleState ? Interfaces.CustomLayer.Default : Interfaces.CustomLayer.Invisible);

            // 위치점 애니메이션 메시
            if (this.pointMeshData.animMeshRef !== undefined) {
                this.pointMeshData.animMeshRef.visible = false;
                Util.setObjectLayer(this.pointMeshData.animMeshRef, Interfaces.CustomLayer.Invisible);
            }
        }

        // poi 표시명 텍스트 가시화 상태 설정
        (this.textObj as THREE.Object3D).visible = this.textVisibleState;
        this.textObj?.layers.set((this.textVisibleState && this.visibleState) ? Interfaces.CustomLayer.Default : Interfaces.CustomLayer.Invisible);
    }

    /**
     * 선 가시화 여부
     */
    get LineVisible(): boolean {
        return this.lineVisibleState;
    }

    /**
     * 선 가시화 여부
     */
    set LineVisible(value: boolean) {
        this.lineVisibleState = value;
    }

    /**
     * 표시명 텍스트 가시화 여부
     */
    get TextVisible(): boolean {
        return this.textVisibleState;
    }

    /**
     * 표시명 텍스트 가시화 여부
     */
    set TextVisible(value: boolean) {
        this.textVisibleState = value;

        (this.textObj as THREE.Object3D).visible = this.textVisibleState;
        this.textObj?.layers.set(this.textVisibleState ? Interfaces.CustomLayer.Default : Interfaces.CustomLayer.Invisible);
    }

    /**
     * 애니메이션 믹서
     */
    set Mixer(value: THREE.AnimationMixer | undefined) {
        this.mixer = value;
    }

    /**
     * 애니메이션 믹서
     */
    get Mixer(): THREE.AnimationMixer | undefined {
        return this.mixer;
    }

    /**
     * 관리중인 애니메이션 액션 목록
     */
    get AnimationActions(): Record<string, THREE.AnimationAction> {
        return this.actions;
    }

    /**
     * 메시 바운딩 높이
     */
    set MeshBoundingHeight(value: number) {
        this.iconObj!.position.copy(this.position.clone().addScaledVector(new THREE.Vector3(0, 1, 0), value));
        this.textObj!.position.copy(this.position.clone().addScaledVector(new THREE.Vector3(0, 1, 0), value));
    }

    /**
     * poi 요소 제거 및 메모리 해제
     */
    dispose() {
        // 애니메이션 메시 제거
        this.pointMeshData.animMeshRef?.parent?.remove(this.pointMeshData.animMeshRef);
        this.pointMeshData.animMeshRef?.children.forEach((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                if (Array.isArray(child.material)) {
                    child.material.forEach((material) => {
                        (material as THREE.Material).dispose();
                        (material as THREE.MeshBasicMaterial).map?.dispose();
                    });
                } else {
                    (child.material as THREE.Material).dispose();
                    (child.material as THREE.MeshBasicMaterial).map?.dispose();
                }
            }
        });
        this.pointMeshData.animMeshRef = undefined;

        // 아이콘 제거
        this.iconObj?.parent?.remove(this.iconObj);

        // 텍스트 제거
        this.disposeTextObject();

        // 내부 이벤트 통지
        Event.InternalHandler.dispatchEvent({
            type: 'onPoiElementDisposed',
            id: this.id,
        });
    }

    /**
     * 표시명 텍스트 객체 메모리 해제
     */
    disposeTextObject() {
        this.textObj?.parent?.remove(this.textObj);
        ((this.textObj as THREE.Mesh).material as THREE.MeshBasicMaterial).map?.dispose();
        ((this.textObj as THREE.Mesh).material as THREE.MeshBasicMaterial).dispose();
    }

    /**
     * 애니메이션 재생
     * @param name - 애니메이션 이름
     */
    playAnimation(name: string) {
        if (this.mixer && this.actions[name]) {
            this.mixer.stopAllAction();
            this.actions[name].play();
        }
    }

    /**
     * 재생중인 애니메이션 중지
     */
    stopAnimation() {
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
    }
}

/**
 * poi 위치점 메시 데이터
 */
interface PoiPointMeshData {
    instanceMeshRef: THREE.InstancedMesh | undefined;
    instanceIndex: number;
    rotation: Interfaces.EulerCustom;
    scale: Interfaces.Vector3Custom;

    animMeshRef: THREE.Object3D | undefined;
}

export {
    PoiElement,
    PoiPointMeshData,
}