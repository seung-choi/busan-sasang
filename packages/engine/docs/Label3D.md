[목록으로](../readme.md)
============
Label3D
=============
## Px.Label3D.Create(option: [Label3DCreateOption](./Interfaces.md#label3dcreateoption), onComplete?: Function)
- option: 생성 옵션
- onComplete: 생성 완료 후 호출될 콜백
- 공간명 텍스트 생성
```javascript
Px.Label3D.Create({
    id: id,
    displayText: '공간명' + (Math.floor(Math.random() * 10).toString()),
}, (data: Label3DImportOption) => {
    console.log('라벨 생성', data);
});
```

## Px.Label3D.Cancel()
- 공간명 텍스트 생성 작업 중지
```javascript
Px.Label3D.Cancel();
```

## Px.Label3D.Hide(id: string)
- id: 공간명 객체 id값
- id에 해당하는 공간명 숨기기
```javascript
Px.Label3D.Hide('TestLabel');
```

## Px.Label3D.Show(id: string)
- id: 공간명 객체 id값
- id에 해당하는 공간명 보이기
```javascript
Px.Label3D.Show('TestLabel');
```

## Px.Label3D.HideAll()
- 모든 공간명 숨기기
```javascript
Px.Label3D.HideAll();
```

## Px.Label3D.ShowAll()
- 모든 공간명 보이기
```javascript
Px.Label3D.ShowAll();
```

## Px.Label3D.Delete(id: string)
- id: 공간명 객체 id값
- id에 해당하는 공간명 객체 제거
```javascript
Px.Label3D.Delete('TestLabel');
```

## Px.Label3D.Clear()
- 모든 공간명 제거
```javascript
Px.Label3D.Clear();
```

## Px.Label3D.Export(): [Label3DImportOption](./Interfaces.md#label3dimportoption)[]
- 생성된 공간명 데이터 익스포트
```javascript
const data = Px.Label3D.Export();
console.log('Label3D.Export ->', data);
// // 출력 예시
// [
//     {
//         "id": "7ca205eb-0c48-4623-8d89-e19c47907b71",
//         "displayText": "공간명3",
//         "floorId": "2",
//         "position": { "x": 31.88416720827651, "y": -11.59000015258789, "z": -22.289722916027277 },
//         "rotation": { "x": 0, "y": 0, "z": 0 },
//         "scale": { "x": 11.111683654785157, "y": 1, "z": 4 }
//     }
// ]
```

## Px.Label3D.Import(data: string | [Label3DImportOption](./Interfaces.md#label3dimportoption) | [Label3DImportOption](./Interfaces.md#label3dimportoption)[])
- data: 공간명 데이터
- 공간명 데이터 임포트
```javascript
fetch('/label3dsampledata.json').then(res => res.json()).then(data => {
    console.log('/label3dsampledata.json', data);
    Px.Label3D.Import(data);
});

Px.Label3D.Import([
    {
        "id": "7ca205eb-0c48-4623-8d89-e19c47907b71",
        "displayText": "공간명3",
        "floorId": "2",
        "position": {
            "x": 31.88416720827651,
            "y": -11.59000015258789,
            "z": -22.289722916027277
        },
        "rotation": {
            "x": 0,
            "y": 0,
            "z": 0
        },
        "scale": {
            "x": 11.111683654785157,
            "y": 1,
            "z": 4
        }
    }
]);
```

## Px.Label3D.StartEdit(editMode: string)
- editMode: 'translate', 'rotate', 'scale' 중 택1
- 공간명 객체의 위치, 회전, 스케일 편집을 시작한다.
- 호출 후에 편집할 공간명 객체를 마우스 좌클릭으로 선택
```javascript
Px.Label3D.StartEdit('translate');
```

## Px.Label3D.FinishEdit()
- 공간명 객체 편집 종료
```javascript
Px.Label3D.FinishEdit();
```