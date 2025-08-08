[목록으로](../readme.md)
============
Poi
============
## Px.Poi.Create(option: [PoiCreateOption](./Interfaces.md#PoiCreateOption), onComplete?: Function)
- option: 생성 옵션
- onComplete: 생성 완료 후 호출될 콜백 함수
- 전달한 파라미터로 poi배치 작업을 시작한다.(마우스 좌클릭으로 배치 완료)
    - poi의 층id값은 배치완료시 결정
    - 모델은 *.glb파일을 지원
```javascript
const option = {
    "id": "9ecb281f-6638-41f6-8bec-8c8cc4ed094c",
    "iconUrl": "SamplePoiIcon.png",
    "modelUrl": "monkeyhead.glb",
    "displayText": "9ecb281f",
    "property": {
        "testText": "테스트 속성",
        "testInt": 11,
        "testFloat": 2.2
    }
};
Px.Poi.Create(option, (data: unknown) => console.log('Poi.Create Callback', data));
```

## Px.Poi.Delete(id: string)
- id: 제거할 poi id값
- id에 해당하는 poi를 제거한다.
```javascript
Px.Poi.Delete('TestPoi');
```

## Px.Poi.Clear()
- 모든 poi를 제거한다.
```javascript
Px.Poi.Clear();
```

## Px.Poi.Export(id: string)
- id: 익스포트할 poi id값
- id에 해당하는 poi 정보를 얻는다.
```javascript
const data = Px.Poi.Export('TestPoi');
console.log(data);
// 출력 예시
// {
//     "id": "f0839411-a81f-4f9c-94c2-d322219a72e2",
//     "iconUrl": "SamplePoiIcon.png",
//     "modelUrl": "monkeyhead.glb",
//     "displayText": "f0839411",
//     "property": {
//         "testText": "테스트 속성",
//         "testInt": 11,
//         "testFloat": 2.2
//     },
//     "floorId": "2",
//     "position": {
//         "x": -45.489461003413396,
//         "y": -7.349999904632568,
//         "z": -3.2792628759576203
//     },
//     "rotation": {
//         "x": 0,
//         "y": 0,
//         "z": 0
//     },
//     "scale": {
//         "x": 1,
//         "y": 1,
//         "z": 1
//     }
// }
```

## Px.Poi.ExportAll();
- 모든 poi 정보를 얻는다.
```javascript
const data = Px.Poi.ExportAll();
console.log('Poi.ExportAll', data);
```

## Px.Poi.Import(data: [PoiImportOption](./Interfaces.md#PoiImportOption) | [PoiImportOption](./Interfaces.md#PoiImportOption)[] | string);
- data: poi 임포트 옵션
- poi data로부터 poi를 생성한다.
```javascript
fetch('poiSampleData.json').then(res => res.json()).then(data => {
    console.log('Poi.Import', data);
    Px.Poi.Import(data);
});

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

## Px.Poi.Hide(id: string)
- id: 숨길 poi id값
- id에 해당하는 poi를 숨긴다.
```javascript
Px.Poi.Hide('TestPoi');
```

## Px.Poi.HideAll()
- 모든 poi를 숨긴다.
```javascript
Px.Poi.HideAll();
```

## Px.Poi.Show(id: string)
- id: 가시화할 poi id값
- id에 해당하는 poi를 가시화 한다.
```javascript
Px.Poi.Show('TestPoi');
```

## Px.Poi.ShowAll()
- 모든 poi를 가시화 한다.
```javascript
Px.Poi.ShowAll();
```

## Px.Poi.HideLine(id: string)
- id: 선을 숨길 poi id값
- id에 해당하는 poi의 선을 숨김
```javascript
Px.Poi.HideLine('TestPoi');
```

## Px.Poi.HideAllLine()
- 모든 poi의 선을 숨김
```javascript
Px.Poi.HideAllLine();
```

## Px.Poi.ShowLine(id: string)
- id: 선을 가시화할 poi id값
- id에 해당하는 poi의 선을 가시화
```javascript
Px.Poi.ShowLine('TestPoi');
```

## Px.Poi.ShowAllLine()
- 모든 poi의 선을 가시화
```javascript
Px.Poi.ShowAllLine();
```

## HideDisplayText(id: string)
- id: 표시명 텍스트를 숨길 poi id값
- id에 해당하는 poi의 표시명 텍스트를 숨김
```javascript
Px.Poi.HideDisplayText('TestPoi');
```

## HideAllDisplayText()
- 모든 표시명 텍스트 숨김처리
```javascript
Px.Poi.HideAllDisplayText();
```

## ShowDisplayText(id: string)
- id: 표시명 텍스트를 가시화할 poi id값
- id에 해당하는 poi의 표시명 텍스트를 가시화
```javascript
Px.Poi.ShowDisplayText('TestPoi');
```

## ShowAllDisplayText()
- 모든 표시명 텍스트 가시화
```javascript
Px.Poi.ShowAllDisplayText();
```

## SetDisplayText(id: string, text: string)
- id: 표시명을 변경할 poi id값
- text: 변경할 텍스트 문자열
- poi의 표시명 텍스트(displayText)를 설정한다.
```javascript
Px.Poi.SetDisplayText('TestPoi', '변경된텍스트');
```

## Px.Poi.GetAnimationList()
- id: poi id값
- id에 해당하는 poi가 가지고 있는 애니메이션 목록을 얻는다.
```javascript
const data = Px.Poi.GetAnimationList(this.state.getAnimlistPoiIdValue);
console.log('Px.Poi.GetAnimationList', data);
```

## Px.Poi.PlayAnimation(id: string, animName: string)
- id: poi id값
- animName: 애니메이션 이름
- poi의 애니메이션을 재생한다.
```javascript
Px.Poi.PlayAnimation('TestPoi', 'DoorOpen');
```

## Px.Poi.StopAnimation()
- id: poi id값
- 재생중인 poi의 애니메이션을 중지한다.
```javascript
Px.Poi.StopAnimation('TestPoi');
```

## Px.Poi.StartEdit(editMode: string)
- editMode: 'translate', 'rotate', 'scale' 중 택1
- poi의 위치, 회전, 스케일 편집을 시작한다.
```javascript
Px.Poi.StartEdit('translate');
```

## Px.Poi.FinishEdit()
- poi의 편집을 종료한다.
```javascript
Px.Poi.FinishEdit();
```