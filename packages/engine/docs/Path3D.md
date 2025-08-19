[목록으로](../readme.md)
============
Path3D
=============
## Px.Path3D.CreatePath(pathId: string, color: number)
- pathId: 경로 id값
- color: 색상코드값
- 경로 생성 시작, 함수 호출후 좌클릭 반복하여 생성하고 Finish함수를 호출하기전까지 지속
```javascript
const pathId = window.crypto.randomUUID();
const color = 0xffffff * Math.random();
Px.Path3D.CreatePath(pathId, color);
```

## Px.Path3D.Finish(): [Path3DData](./Interfaces.md#path3ddata)
- 경로 생성 종료
```javascript
const pathData = Path3D.Finish();
console.log('Path3D.Finish -> ', pathData);
```

## Px.Path3D.Cancel()
- 경로 생성 중지
```javascript
Px.Path3D.Cancel();
```

## Px.Path3D.Export(): [Path3DData](./Interfaces.md#path3ddata)[]
- 경로 데이터 익스포트
```javascript
const data = Path3D.Export();
console.log('Path3D.Export -> ', data);
// // 출력 예시
// {
//     "id": "b482aadc-e5fa-4f73-afc4-7474832a35e4",
//     "color": 11520620,
//     "points": [
//         {
//             "id": "ca28abf3-7de2-41b0-849b-13a11cf47b1f",
//             "floorId": "2",
//             "point": {
//                 "x": 12.06592709965659,
//                 "y": -11.59000015258789,
//                 "z": -15.149829420425679
//             }
//         },
//         {
//             "id": "736c1b6b-b5e3-40bf-aa4f-03614221d67f",
//             "floorId": "2",
//             "isStraightLine": true,
//             "point": {
//                 "x": 14.142549285496365,
//                 "y": -11.59000015258789,
//                 "z": -15.719930133717014
//             }
//         },
//         {
//             "id": "686afc76-136c-405d-9468-2821717173c5",
//             "floorId": "2",
//             "point": {
//                 "x": 16.21917147133614,
//                 "y": -11.59000015258789,
//                 "z": -16.29003084700835
//             }
//         }
//     ]
// }
```

## Px.Path3D.Import(data: string | [Path3DData](./Interfaces.md#path3ddata) | [Path3DData](./Interfaces.md#path3ddata)[])
- 경로 데이터 임포트
```javascript
fetch('pathSampleData.json').then(res => res.json()).then(data => {
    Px.Path3D.Import(data);
});

Px.Path3D.Import({
    "id": "6475e459-dfd9-45fc-9456-ab286aebfbcb",
    "color": 12276396,
    "points": [
        {
            "id": "2e5e81e7-6cea-459f-b15d-17e16bb6564b",
            "floorId": "0",
            "point": {
                "x": 90.45034791257176,
                "y": -12.899999618530273,
                "z": 4.967122303835378
            }
        },
        {
            "id": "b6c1e622-d029-4a70-91be-b93bf00977b3",
            "floorId": "0",
            "isStraightLine": true,
            "point": {
                "x": 81.45832612616569,
                "y": -12.899999618530273,
                "z": 2.6199572865372547
            }
        },
        {
            "id": "52d3d570-63bd-4caf-ab4e-c38af68fa8de",
            "floorId": "0",
            "point": {
                "x": 72.46630433975962,
                "y": -12.899999618530273,
                "z": 0.2727922692391318
            }
        },
    ]
});
```

## Px.Path3D.Clear()
- 경로 데이터 모두 지우기
```javascript
Px.Path3D.Clear();
```

## Px.Path3D.Hide(id: string)
- id: 경로 id값
- id에 해당하는 경로 숨기기
```javascript
Px.Path3D.Hide('TestPath');
```

## Px.Path3D.Show(id: string)
- id: 경로 id값
- id에 해당하는 경로 보이기
```javascript
Px.Path3D.Show('TestPath');
```

## Px.Path3D.HideAll()
- 모든 경로 숨기기
```javascript
Px.Path3D.HideAll();
```

## Px.Path3D.ShowAll()
- 모든 경로 보이기
```javascript
Px.Path3D.ShowAll();
```