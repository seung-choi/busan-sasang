[목록으로](../readme.md)
============
Model
=============
## Px.Model.GetModelHierarchy(): [ModelInfo](./Interfaces.md#ModelInfo)[]
- 로드된 모델의 정보를 얻는다.
```javascript
const data = Px.Model.GetModelHierarchy();
console.log(data);
// 출력 예시
// [
//     {
//         "objectName": ".\\Sillim_2020_12_레일_0.sbm/0",
//         "displayName": "레일",
//         "sortingOrder": -1,
//         "floorId": "0"
//     },
//     {
//         "objectName": ".\\Sillim_2020_12_승강장_1.sbm/1",
//         "displayName": "승강장",
//         "sortingOrder": 1,
//         "floorId": "1"
//     },
//     {
//         "objectName": ".\\Sillim_2020_12_대합실_2.sbm/2",
//         "displayName": "대합실",
//         "sortingOrder": 2,
//         "floorId": "2"
//     },
//     {
//         "objectName": ".\\Sillim_2020_12_출구_계단_3.sbm/3",
//         "displayName": "출구_계단",
//         "sortingOrder": 3,
//         "floorId": "3"
//     },
//     {
//         "objectName": ".\\Sillim_2020_12_출구_4.sbm/4",
//         "displayName": "출구",
//         "sortingOrder": 4,
//         "floorId": "4"
//     }
// ]
```

## Px.Model.Expand(transitionTime: number, interval: number, onComplete: Function)
- transitionTime: 이동시간
- interval: 간격(m)
- onComplete: 펼치기 완료 후 호출될 콜백 함수
- 모델 층 펼치기 수행
    - 층 속성중 sortingOrder값 0을 기준으로 펼치기 수행 
```javascript
Px.Model.Expand(1.0, 10.0, () => console.log('펼치기 완료'));
```

## Px.Model.Collapse(transitionTime: number, onComplete: Function)
- transitionTime: 이동시간
- onComplete: 접기 완료 후 호출될 콜백 함수
- 모델 층 접기 수행
```javascript
Px.Model.Collapse(1.0, () => console.log('접기 완료'));
```

## Px.Model.Hide(floorId: string)
- floorId: 숨길 층 id값
- floorId에 해당하는 층을 숨긴다.
```javascript
Px.Model.Hide('1');
```

## Px.Model.HideAll()
- 모든 층 객체를 숨긴다.
```javascript
Px.Model.HideAll();
```

## Px.Model.Show(floorId: string)
- floorId: 보여질 층 id값
- floorId에 해당하는 층을 가시화한다.
```javascript
Px.Model.Show('1');
```

## Px.Model.ShowAll()
- 모든 층 객체를 가시화 한다.
```javascript
Px.Model.ShowAll()
```