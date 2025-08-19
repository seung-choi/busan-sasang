[목록으로](../readme.md)
============
Util
=============
## Px.Util.SetBackground(backgroundData: number | string)
- backgroundData: number값(0xff00ff등)의 형식일경우 색상코드로 인식하고, 문자열일경우 이미지 주소로 인식하여 배경을 설정
```javascript
Px.Util.SetBackground(0xff0000); // 색상으로 배경설정
Px.Util.SetBackground('testBackground.png'); // 이미지로 배경설정
```