[목록으로](../readme.md)
============
Loader
=============
## Px.Loader.LoadGltf(url: string, onLoad: Function)
- url: *.glb 모델링 파일 주소
- onLoad: 로드 완료 후 호출될 콜백 함수
- gltf 모델을 로드한다.
- gltf 모델은 층객체가 특정한 속성값을 가지고 있어야 하며, 자세한 사항은 레포지터리의 'funeralhall.glb'파일을 참고 바람.
```javascript
Px.Loader.LoadGltf('funeralhall.glb', () => console.log('모델 로드 완료.'));
```

## Px.Loader.LoadSbm(url: string, onLoad: Function)
- url: *.xml 파일 주소
- onLoad: 로드 완료 후 호출될 콜백 함수
- sbm익스포트시 생성되는 sbm용 *.xml파일로부터 층정보, *.sbm파일등을 읽어 로드한다.
```javascript
Px.Loader.LoadSbm( 'sinlim_station/Sillim_2020_12.xml', ()=>console.log('모델 로드 완료'));
```
