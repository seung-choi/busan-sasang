[목록으로](../readme.md)
============
Camera
=============
## Px.Camera.ExtendView(transitionTime: number)
- transitionTime: 이동시간(초)
- 카메라를 배경모델이 어느정도 보이는 각도로 이동시킨다.
- 카메라의 현재 각도를 유지한다.
```javascript
Px.Camera.ExtendView(1.0); // 1초간 이동
```

## Px.Camera.GetState(): object
- 카메라의 현재 상태를 얻는다.
```javascript
const state = Px.Camera.GetState();
console.log(state);
// 출력 예시
// {
//     "position": {
//         "x": -0.801470929798433,
//         "y": 4.550851435900466,
//         "z": -1.1234345885549244
//     },
//     "rotation": {
//         "x": -1.570799242257723,
//         "y": 0.0005416272256549096,
//         "z": 1.5761790599244376
//     }
// }
```

## Px.Camera.SetState(state: Record<string, any>, transitionTime: number)
- state: 카메라 상태 정보(위치, 회전)
- transitionTime: 이동시칸
- 인자값으로 전달받은 상태정보로 카메라를 설정한다
```javascript
const state = {
    "position": {
        "x": -0.801470929798433,
        "y": 4.550851435900466,
        "z": -1.1234345885549244
    },
    "rotation": {
        "x": -1.570799242257723,
        "y": 0.0005416272256549096,
        "z": 1.5761790599244376
    }
};
Px.Camera.SetState(state, 1.0);
```

## Px.Camera.MoveToFloor(floorId: string, transitionTime: number)
- floorId: 층 id값
- transitionTime: 이동시간(초)
- 지정한 층으로 카메라를 이동시킨다.
```javascript
Px.Camera.MoveToFloor('1', 1.0);
```

## Px.Camera.MoveToPoi(id: string, transitionTime: number)
- id: poi id값
- transitionTime: 이동시칸(초)
- id에 해당하는 poi로 카메라를 이동시킨다.
```javascript
Px.Camera.MoveToPoi('TestPoi', 1.0);
```