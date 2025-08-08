[목록으로](../readme.md)
============
Subway
=============
## Px.Subway.LoadTrainHead(url: string, onLoad: Function)
- url: 지하철 머리 모델링 파일 주소
- onLoad: 로드 완료 후 호출 콜백
- 지하철 머리 모델을 로드한다.
```javascript
Px.Subway.LoadTrainHead('/subway_train/head.glb', () => {
    console.log('지하철 머리 모델 로드 완료');
});
```

## Px.Subway.LoadTrainBody(url: string, onLoad: Function)
- url: 지하철 몸체 모델링 파일 주소
- onLoad: 로드 완료 후 호출 콜백
- 지하철 몸체 모델을 로드한다.
```javascript
Px.Subway.LoadTrainBody('/subway_train/body.glb', () => {
    console.log('지하철 몸체 모델 로드 완료');
});
```

## Px.Subway.LoadTrainTail(url: string, onLoad: Function)
- url: 지하철 꼬리 모델링 파일 주소
- onLoad: 로드 완료 후 호출 콜백
- 지하철 꼬리 모델을 로드한다.
```javascript
Px.Subway.LoadTrainTail('/subway_train/tail.glb', () => {
    console.log('지하철 꼬리 모델 로드 완료');
});
```

## Px.Subway.Create(option: [SubwayCreateOption](./Interfaces.md#subwaycreateoption), onCreate?: Function)
- option: 열차 생성 옵션
- onCreate: 생성 완료 후 호출 콜백
- 지하철 열차 생성
- [Path3D](./Path3D.md)를 통한 경로가 생성되어 있어야 하고, [머리](#pxsubwayloadtrainheadurl-string-onload-function), [몸체](#pxsubwayloadtrainbodyurl-string-onload-function), [꼬리](#pxsubwayloadtraintailurl-string-onload-function) 모델이 로드 되어 있어야함
- 호출 후에 마우스 좌클릭으로 경로를 선택하면, 임의 공간에 열차 생성
  - 이후에 열차 [진입](#pxsubwayenablesetentrancelocation)/[정차](#pxsubwayenablesetstoplocation)/[진출](#pxsubwayenablesetexitlocation)등의 열차 위치 설정 필요
```javascript
const id = window.crypto.randomUUID();
const bodyCount = 4; // 4량짜리 열차
Subway.Create({
    id: id,
    bodyCount: bodyCount
}, () => console.log('지하철 생성 완료'));
```

## Px.Subway.Cancel()
- 열차 생성 중지
```javascript
Px.Subway.Cancel();
```

## Px.Subway.EnableSetEntranceLocation()
- 열차 진입 지점 설정
- 함수 호출 후 마우스 이동으로 열차 위치를 지정하고 좌클릭으로 완료
```javascript
Px.Subway.EnableSetEntranceLocation();
```

## Px.Subway.EnableSetStopLocation()
- 열차 정차 지정 설정
- 함수 호출 후 마우스 이동으로 열차 위치를 지정하고 좌클릭으로 완료
```javascript
Px.Subway.EnableSetStopLocation();
```

## Px.Subway.EnableSetExitLocation()
- 열차 진출 지점 설정
- 함수 호출 후 마우스 이동으로 열차 위치를 지정하고 좌클릭으로 완료
```javascript
Px.Subway.EnableSetExitLocation();
```

## Px.Subway.Finish(): [SubwayImportOption](./Interfaces.md#subwayimportoption)
- 열차 생성 완료
- Finish 함수 호출전까지는 [EnableSetEntranceLocation](#pxsubwayenablesetentrancelocation), [EnableSetStopLocation](#pxsubwayenablesetstoplocation), [EnableSetExitLocation](#pxsubwayenablesetexitlocation) Api를 통해 위치 선정
```javascript
const data = Px.Subway.Finish();
console.log('subway ->', data);
```

## Px.Subway.Hide(id: string)
- id: 열차 id값
- id에 해당하는 열차 숨기기
```javascript
Px.Subway.Hide('TestTrain');
```

## Px.Subway.Show(id: string)
- id: 열차 id값
- id에 해당하는 열차 보이기
```javascript
Px.Subway.Show('TestTrain');
```

## Px.Subway.HideAll()
- 모든 열차 숨기기
```javascript
Px.Subway.HideAll();
```

## Px.Subway.ShowAll()
- 모든 열차 보이기
```javascript
Px.Subway.ShowAll();
```

## Px.Subway.DoEnter(id: string, transitionTime: number = 5.0, onComplete?: Function)
- id: 열차 id값
- transitionTime: 애니메이션 진행시간 (초)
- onComplete: 애니메이션 완료 후 호출 콜백
- 열차 진입 애니메이션 실행
- [EnableSetEntranceLocation](#pxsubwayenablesetentrancelocation)를 통해 지정한 위치로부터 [EnableSetStopLocation](#pxsubwayenablesetstoplocation)를 통해 지정한 위치로 이동
```javascript
Px.Subway.Show('TestTrain'); // 열차 보이기
Px.Subway.DoEnter('TestTrain', 5.0, () => { // 열차 진입 애니메이션 5초간 진행
    console.log('열차 진입 완료:', 'TestTrain');
});
```

## Px.Subway.DoExit(id: string, transitionTime: number = 5.0, onComplete?: Function)
- id: 열차 id값
- transitionTime: 애니메이션 진행시간 (초)
- onComplete: 애니메이션 완료 후 호출 콜백
- 열차 진출 애니메이션 실행
- [EnableSetStopLocation](#pxsubwayenablesetstoplocation)를 통해 지정한 위치로부터 [EnableSetExitLocation](#pxsubwayenablesetexitlocation)를 통해 지정한 위치로 이동
```javascript
Px.Subway.Show('TestTrain'); // 열차 보이기
Px.Subway.DoExit('TestTrain', 5.0, () => { // 열차 진출 애니메이션 5초간 진행
    console.log('열차 진출 완료:', 'TestTrain');
    Px.Subway.Hide('TestTrain'); // 애니메이션 완료 후 숨기기
});
```

## Px.Subway.Export(): [SubwayImportOption](./Interfaces.md#subwayimportoption)[]
- 열차 데이터 익스포트
```javascript
const data = Px.Subway.Export();
console.log('subway data ->', data);
// // 출력 예시
// [
//     {
//         "id": "493bac25-4924-450c-8f9f-29565c55950f",
//         "pathId": "fd0427d6-2547-4356-8fb7-273f6aff981e",
//         "bodyCount": 4,
//         "entranceUValue": 0.10743589868267339,
//         "stopUValue": 0.37304624112835644,
//         "exitUValue": 0.654262386662654
//     }
// ]
```

## Px.Subway.Import(data: string | [SubwayImportOption](./Interfaces.md#subwayimportoption) | [SubwayImportOption](./Interfaces.md#subwayimportoption)[])
- data: 열차 데이터
- 열차 데이터 임포트
```javascript
fetch('/subway_train/trainSampleData.json').then(res => res.json()).then(data => {
    console.log('/subway_train/trainSampleData.json', data);
    Px.Subway.Import(data);
});

Px.Subway.Import([
    {
        "id": "493bac25-4924-450c-8f9f-29565c55950f",
        "pathId": "fd0427d6-2547-4356-8fb7-273f6aff981e",
        "bodyCount": 4,
        "entranceUValue": 0.10743589868267339,
        "stopUValue": 0.37304624112835644,
        "exitUValue": 0.654262386662654
    }
]);
```