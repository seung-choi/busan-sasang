import * as THREE from 'three';

/**
 * 데이터 익스포트를 위한 벡터3 클래스
 */
class Vector3Custom extends THREE.Vector3 {
    /**
     * three.js의 vector3 관련 함수를 제거하고 데이터 값만 반환
     * @returns - 좌표값
     */
    get ExportData() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
        };
    }
}

/**
 * 임포트용 벡터3 인터페이스
 */
interface Vector3 {
    x: number;
    y: number;
    z: number;
}

/**
 * 데이터 익스포트를 위한 Euler 클래스
 */
class EulerCustom extends THREE.Euler {
    get ExportData() {
        return {
            x: this.x,
            y: this.y,
            z: this.z,
        }
    }
}

/**
 * 카메라, 픽킹등에 사용할 레이어 열거형
 */
enum CustomLayer {
    Default = 0,
    Invisible,
    Pickable,
}

/**
 * 마우스 버튼 열거형
 */
enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
}

/**
 * 조합키 열거형
 */
enum ModifyKey {
    Shift = 'shiftKey',
    Control = 'ctrlKey',
    Alt = 'altKey',
}

/**
 * 경로 생성기 마우스 상태 열거형
 */
enum PathCreatorMouseState {
    Default = 0,
    SetStartPoint,
    SetEndPoint,
}

/**
 * 지하철 생성 마우스 상태 열거형
 */
enum SubwayCreateMouseState {
    Default = 0,
    SelectPath,
    SetEntranceLocation,
    SetStopLocation,
    SetExitLocation,
}

/**
 * 모델 정보
 */
interface ModelInfo {
    objectName: string;
    displayName: string;
    sortingOrder: number;
    floorId: string;
}

/**
 * poi 생성 옵션
 */
interface PoiCreateOption {
    id: string;
    iconUrl: string;
    modelUrl?: string;
    displayText: string;
    property: { [key: string]: any };
}

/**
 * poi 임포트 옵션
 */
interface PoiImportOption {
    id: string;
    iconUrl: string;
    modelUrl?: string;
    displayText: string;
    floorId: string;
    property: { [key: string]: any };
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
}

/**
 * Sbm 파일 헤더 정보
 */
interface SBMHeader {
    formatName: string;
    version: number;
    materialCount: number;
    meshCount: number;
}

/**
 * SBM 재질 정보
 */
interface SBMMaterial {
    id: number;
    ambient: THREE.Color;
    diffuse: THREE.Color;
    opacity: number;
    specular: THREE.Color;
    facing: number;
    textureMapPath: string;
}

/**
 * SBM 메시 정보
 */
interface SBMMesh {
    id: number;
    usedMaterialId: number;

    vertexCount: number;
    posVertices: number[];
    normVertices: number[];
    uvVertices: number[];
    indices: number[];
}

/**
 * Path3D 위치점 데이터 인터페이스
 */
interface Path3DPointData {
    id: string;
    point: Vector3;
    floorId: string;
    isStraightLine?: boolean;
}

/**
 * Path3D 데이터 인터페이스
 */
interface Path3DData {
    id: string;
    color: number;
    points: Path3DPointData[];
}

/**
 * 지하철 생성 옵션
 */
interface SubwayCreateOption {
    id: string;
    bodyCount: number;
}

/**
 * 지하철 임포트/익스포트 옵션
 */
interface SubwayImportOption {
    id: string;
    pathId: string;
    bodyCount: number;
    entranceUValue: number;
    stopUValue: number;
    exitUValue: number;
}

/**
 * 라벨3d 생성 옵션
 */
interface Label3DCreateOption {
    id: string;
    displayText: string;
}

/**
 * 라벨3d 임포트 옵션
 */
interface Label3DImportOption {
    id: string;
    displayText: string;
    floorId: string;
    position: Vector3;
    rotation: Vector3;
    scale: Vector3;
}

export {
    Vector3Custom,
    Vector3,
    EulerCustom,
    CustomLayer,
    MouseButton,
    ModifyKey,
    PathCreatorMouseState,
    SubwayCreateMouseState,
    ModelInfo,
    ModelInfo as FloorInfo,
    PoiCreateOption,
    PoiImportOption,
    SBMHeader,
    SBMMaterial,
    SBMMesh,
    Path3DPointData,
    Path3DData,
    SubwayCreateOption,
    SubwayImportOption,
    Label3DCreateOption,
    Label3DImportOption,
}