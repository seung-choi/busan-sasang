[목록으로](../readme.md)
============
Event
=============
## Px.Event.AddEventListener(type: string, callback: Function)
- type: 처리할 이벤트명
  - 'onPoiTransformChange': poi 편집시 위치, 회전, 스케일에 값변화가 일어날때 호출
  - 'onPoiPointerUp': poi에 포인터 업 발생할때 호출
  - 'onLabel3DTransformChange': Label3D 편집시 위치, 회전, 스케일에 값변화가 일어날때 호출
  - 'onLabel3DPointerUp': Label3D 포인터 업 발생할떄 호출
- callback: 이벤트에 따라 호출될 콜백 함수
- 형식에 따라 처리할 이벤트를 등록한다.
```javascript
// poi 편집 이벤트 등록
Event.AddEventListener('onPoiTransformChange' as never, (evt: any) => {
    console.log(evt);
});
```

## Px.Event.RemoveEventListener(type: string, callback: Function)
- type: 제거할 이벤트명
- callback: 제거할 콜백함수
- 형식에 따라 처리하는 이벤트를 제거한다.
```javascript
Px.Event.RemoveEventListener('onPoiTransformChange', transformChangeCallback);
```