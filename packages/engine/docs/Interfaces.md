[목록으로](../readme.md)
============
Interfaces
============
## ModelInfo
```javascript
/**
 * 모델 정보
 */
interface ModelInfo {
    objectName: string; // 객체 이름
    displayName: string; // 표시명
    sortingOrder: number; // 정렬 순서
    floorId: string; // 층 id값
}
```

## PoiCreateOption
```javascript
/**
 * poi 생성 옵션
 */
interface PoiCreateOption {
    id: string; // poi id값
    iconUrl: string; // 아이콘 이미지 주소
    modelUrl?: string; // 모델링 파일 주소
    displayText: string; // 표시명 텍스트
    property: { [key: string]: any }; // 속성
}
```

## PoiImportOption
```javascript
/**
 * poi 임포트 옵션
 */
interface PoiImportOption {
    id: string; // poi id값
    iconUrl: string; // 아이콘 이미지 주소
    modelUrl?: string; // 모델링 파일 주소
    displayText: string; // 표시명 텍스트
    floorId: string; // poi가 배치된 층 id값
    property: { [key: string]: any }; // 속성
    position: Vector3; // 위치 x,y,z
    rotation: Vector3; // 회전 x,y,z
    scale: Vector3; // 스케일 x,y,z
}
// 사용 예시
Px.Poi.Import({
    "id": "ff8419ab-0b64-40a4-bfc2-0f3b317e0b2e",
    "iconUrl": "SamplePoiIcon.png",
    "modelUrl": "monkeyhead.glb",
    "displayText": "ff8419ab",
    "property": {
        "testText": "테스트 속성",
        "testInt": 11,
        "testFloat": 2.2
    },
    "floorId": "4",
    "position": {
        "x": -11.168609758648447,
        "y": 0.19880974292755127,
        "z": -2.6205250759845735
    },
    "rotation": {
        "x": 0,
        "y": 0,
        "z": 0
    },
    "scale": {
        "x": 1,
        "y": 1,
        "z": 1
    }
});
```

## Vector3
```javascript
/**
 * 임포트용 벡터3 인터페이스
 */
interface Vector3 {
    x: number;
    y: number;
    z: number;
}
```

## Path3DPointData
```javascript
interface Path3DPointData {
    id: string; // 위치점 id
    point: Vector3; // 위치 좌표값
    floorId: string; // 층 id값
    isStraightLine?: boolean; // 제어점일경우 직선 여부
}
```

## Path3DData
```javascript
interface Path3DData {
    id: string; // 경로 id
    color: number; // 색상코드
    points: Path3DPointData[]; // 위치점 배열
}
```

## SubwayCreateOption
```javascript
interface SubwayCreateOption {
    id: string; // 지하철 열차 id
    bodyCount: number; // 열차 개수 (머리,꼬리 포함)
}
```

## SubwayImportOption
```javascript
interface SubwayImportOption {
    id: string; // 열차 id값
    pathId: string; // path3d 경로 id값
    bodyCount: number; // 열차 개수 (머리,꼬리포함)
    entranceUValue: number; // 경로상의 진입지점 거리 비율값
    stopUValue: number; // 경로상의 정차지점 거리 비율값
    exitUValue: number; // 경로상의 진출지점 거리 비율값
}
```

## Label3DCreateOption
```javascript
interface Label3DCreateOption {
    id: string; // 라벨 id
    displayText: string; // 표시명 텍스트
}
```

## Label3DImportOption
```javascript
interface Label3DImportOption {
    id: string; // 라벨 id
    displayText: string; // 표시명 텍스트
    floorId: string; // 층 id값
    position: Vector3; // 위치값
    rotation: Vector3; // 회전값
    scale: Vector3; // 스케일값
}
```