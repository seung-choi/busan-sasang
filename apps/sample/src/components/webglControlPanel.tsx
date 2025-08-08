import * as React from 'react';
import { Camera, Event, Interfaces, Label3D, Model, Path3D, Poi, Subway, Util } from '@plug/engine/src';

// 컴포넌트 상태 타입 정의
interface WebGLControlPanelState {
    selectedApiName: string;
    deletePoiId: string;
    setVisiblePoiId: string;
    setLineVisiblePoiId: string;
    setTextVisiblePoiId: string;
    poiDisplayTextIdValue: string;
    poiDisplayTextValue: string;
    moveToPoiIdValue: string;
    getAnimlistPoiIdValue: string;
    poiAnimNameValue: string;
    moveToFloorIdValue: string;
    backgroundImageUrl: string;
    pathVisibleId: string;
    subwayCreateBodyCount: string;
    subwayId: string;
    label3DId: string;
    floorData: Interfaces.FloorInfo[];
}

// 컴포넌트 프롭스 타입 정의
type WebGLControlPanelProps = Record<string, never>;

/**
 * WebGL 조작 패널
 */
class WebGLControlPanel extends React.Component<WebGLControlPanelProps, WebGLControlPanelState> {
    /**
     * 생성자
     * @param props - 옵션
     */
    constructor(props: WebGLControlPanelProps) {
        super(props);

        // 스테이트
        this.state = {
            selectedApiName: 'None',
            deletePoiId: '',
            setVisiblePoiId: '',
            setLineVisiblePoiId: '',
            setTextVisiblePoiId: '',
            poiDisplayTextIdValue: '',
            poiDisplayTextValue: '',
            moveToPoiIdValue: '',
            moveToFloorIdValue: '',
            getAnimlistPoiIdValue: '',
            poiAnimNameValue: '',
            backgroundImageUrl: '',
            pathVisibleId: '',
            subwayCreateBodyCount: '',
            subwayId: '',
            label3DId: '',
            floorData: []
        };

        this.registerViewerEvents();

        // window.addEventListener('keydown', (evt) => {
        //     if (evt.key === '1') {
        //         Subway.DoEnter('1c233aed-f849-4797-b5e1-03a373cc51e6', 5.0, () => console.log('비동기 이동 테스트'));
        //     }
        //     if (evt.key === '2') {
        //         Subway.DoExit('1c233aed-f849-4797-b5e1-03a373cc51e6', 5.0, () => console.log('비동기 이동 테스트'));
        //     }

        //     if (evt.key === '3') {
        //         Subway.DoEnter('b83eacbc-feea-47f7-bed3-68f01f8cbdec', 5.0, () => console.log('비동기 이동 테스트'));
        //     }
        //     if (evt.key === '4') {
        //         Subway.DoExit('b83eacbc-feea-47f7-bed3-68f01f8cbdec', 5.0, () => console.log('비동기 이동 테스트'));
        //     }
        // });
    }

    /**
     * 선택한 api에 따라 메뉴 표출
     * @returns - 메뉴항목
     */
    renderMenu() {
        if (this.state.selectedApiName === 'Camera') {
            return (
                <span>
                    <button disabled>SetEnabled</button>
                    <button onClick={() => Camera.ExtendView(1.0)}>ExtendView</button><br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Camera.GetState')}>GetState</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Camera.SetState')}>SetState</button><br />
                    <input type='text' value={this.state.moveToPoiIdValue} onChange={this.onMoveToPoiTextInputValueChanged.bind(this)} placeholder='이동할 Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Camera.MoveToPoi')}>MoveToPoi</button><br />
                    <input type='text' value={this.state.moveToFloorIdValue} onChange={this.onMoveToFloorTextInputValueChanged.bind(this)} placeholder='이동할 층 Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Camera.MoveToFloor')}>MoveToFloor</button>
                </span>
            );
        } else if (this.state.selectedApiName === 'Loader') {
            return (
                <button disabled>LoadGltf</button>
            );
        } else if (this.state.selectedApiName === 'Model') {
            return (
                <span>
                    <button onClick={this.onApiBtnClick.bind(this, 'Model.GetHierarchy')}>GetModelHierarchy</button>
                    <br />
                    {this.state.floorData.map((data: Interfaces.FloorInfo) => (
                        <span key={data.floorId}>
                            <input type='checkbox' id={data.floorId} value={data.floorId} defaultChecked={true} onChange={this.onFloorVisibleCheckChanged.bind(this)}></input>
                            <label htmlFor={data.floorId}>{data.displayName}</label><br />
                        </span>
                    ))}
                    {
                        this.state.floorData.length > 0 &&
                        <span>
                            <button onClick={() => this.setFloorVisibility(true)}>ShowAll</button>
                            <button onClick={() => this.setFloorVisibility(false)}>HideAll</button><br />
                            <button onClick={() => Model.Expand(1.0, 15.0)}>Expand</button>
                            <button onClick={() => Model.Collapse(1.0)}>Collapse</button>
                        </span>
                    }
                </span>
            );
        } else if (this.state.selectedApiName === 'Poi') {
            return (
                <span>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Create')}>Create</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Create(MonkeyHead.glb)')}>Create(MonkeyHead.glb)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Create(ScreenDoor.glb)')}>Create(ScreenDoor.glb)</button><br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Create(head.glb)')}>Create(subway_train/head.glb)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Create(body.glb)')}>Create(subway_train/body.glb)</button><br />
                    <input type='text' value={this.state.deletePoiId} onChange={this.onDeletePoiTextInputValueChanged.bind(this)} placeholder='제거할 Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Delete')}>Delete</button> &nbsp;
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Clear')}>Clear</button>
                    <br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ExportAll')}>ExportAll</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Import')}>Import(JSON)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ImportSingle')}>Import(Single Object)</button>
                    <br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ExportAll(LocalStorage)')}>ExportAll(LocalStorage)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Import(LocalStorage)')}>Import(LocalStorage)</button>
                    <br />
                    <input type='text' value={this.state.setVisiblePoiId} onChange={this.onSetVisiblePoiTextInputValueChanged.bind(this)} placeholder='Show/Hide Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Show')}>Show</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.Hide')}>Hide</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ShowAll')}>Show All</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.HideAll')}>Hide All</button><br /><br />

                    <input type='text' value={this.state.setLineVisiblePoiId} onChange={this.onSetLineVisibleTextInputValueChanged.bind(this)} placeholder='Line Show/Hide Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ShowLine')}>Show Line</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.HideLine')}>Hide Line</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ShowAllLine')}>Show All Line</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.HideAllLine')}>Hide All Line</button><br /><br />

                    <input type='text' value={this.state.setTextVisiblePoiId} onChange={this.onSetPoiTextVisibleInputValueChanged.bind(this)} placeholder='DisplayText Show/Hide Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ShowDisplayText')}>Show DisplayText</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.HideDisplayText')}>Hide DisplayText</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.ShowAllDisplayText')}>Show All DisplayText</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.HideAllDisplayText')}>Hide All DisplayText</button><br /><br />

                    <input type='text' value={this.state.poiDisplayTextIdValue} onChange={this.onPoiDisplayTextIdInputValueChanged.bind(this)} placeholder='표시명 변경할 poi id'></input>
                    <input type='text' value={this.state.poiDisplayTextValue} onChange={this.onPoiDisplayTextInputValueChanged.bind(this)} placeholder='표시명 입력'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.SetDisplayText')}>SetDisplayText</button><br /><br />

                    <input type='text' value={this.state.getAnimlistPoiIdValue} onChange={this.onGetAnimListTextInputValueChanged.bind(this)} placeholder='Animation Poi Id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.GetAnimationList')}>GetAnimationList</button><br />
                    <input type='text' value={this.state.poiAnimNameValue} onChange={this.onAnimNameTextInputValueChanged.bind(this)} placeholder='Animation Name'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.PlayAnimation')}>PlayAnimation</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.StopAnimation')}>StopAnimation</button><br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.StartEdit(translate)')}>StartEdit(translate)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.StartEdit(rotate)')}>StartEdit(rotate)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Poi.StartEdit(scale)')}>StartEdit(scale)</button>&nbsp;
                    <button onClick={() => Poi.FinishEdit()}>Finish</button>
                </span>
            );
        } else if (this.state.selectedApiName === 'Path') {
            return (
                <span>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.CreatePath')}>CreatePath</button>
                    <button onClick={() => Path3D.Cancel()}>Cancel</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.Finish')}>Finish</button><br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.Export')}>Export</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.Import')}>Import</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.Clear')}>Clear</button><br />
                    <input type='text' value={this.state.pathVisibleId} onChange={this.onPathVisibleInputValueChanged.bind(this)} placeholder='경로명'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.Hide')}>Hide</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.Show')}>Show</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.HideAll')}>HideAll</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Path.ShowAll')}>ShowAll</button>
                </span>
            );
        } else if (this.state.selectedApiName === 'Util') {
            return (
                <span>
                    <label htmlFor='bgColor'>색상으로 배경설정:</label><input id='bgColor' type='color' onChange={this.onBackgroundColorChange.bind(this)}></input><br />
                    <label htmlFor='bgImgUrl'>이미지Url로 배경설정:</label><input id="bgImgUrl" type="text" value={this.state.backgroundImageUrl} onChange={this.onBackgroundImageUrlChange.bind(this)}></input><button onClick={this.onApiBtnClick.bind(this, 'Util.SetBackgroundImage')}>설정</button><br />
                </span>
            );
        } else if (this.state.selectedApiName === 'Subway') {
            return (
                <span>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.LoadTrainHead')}>LoadTrainHead</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.LoadTrainBody')}>LoadTrainBody</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.LoadTrainTail')}>LoadTrainTail</button><br />

                    <input type='text' value={this.state.subwayCreateBodyCount} onChange={this.onSubwayBodyCountInputValueChanged.bind(this)} placeholder='차량개수'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.Create')}>Create</button><br />
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.Cancel')}>Cancel</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.EnableSetEntranceLocation')}>EnableSetEntranceLocation</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.EnableSetStopLocation')}>EnableSetStopLocation</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.EnableSetExitLocation')}>EnableSetExitLocation</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.Finish')}>Finish</button><br />

                    <input type='text' value={this.state.subwayId} onChange={this.onSubwayIdInputValueChanged.bind(this)} placeholder='열차id'></input>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.Hide')}>Hide</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.Show')}>Show</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.HideAll')}>HideAll</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.ShowAll')}>ShowAll</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.DoEnter')}>DoEnter</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.DoExit')}>DoExit</button><br />

                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.Export')}>Export</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Subway.Import')}>Import</button>
                </span>
            );
        } else if (this.state.selectedApiName === 'Label3D') {
            return (
                <span>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.Create')}>Create</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.Cancel')}>Cancel</button><br /><br />

                    <input type='text' value={this.state.label3DId} onChange={this.onLabel3DIdInputValueChanged.bind(this)} placeholder='라벨3did'></input><br/>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.Hide')}>Hide</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.Show')}>Show</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.HideAll')}>HideAll</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.ShowAll')}>ShowAll</button><br/><br/>

                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.Delete')}>Delete</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.Clear')}>Clear</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.Export')}>Export</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.Import')}>Import</button><br/><br/>

                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.StartEdit(translate)')}>StartEdit(translate)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.StartEdit(rotate)')}>StartEdit(rotate)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.StartEdit(scale)')}>StartEdit(scale)</button>
                    <button onClick={this.onApiBtnClick.bind(this, 'Label3D.FinishEdit')}>FinishEdit</button><br/><br/>
                </span>
            );
        } else if (this.state.selectedApiName === 'Test') {
            return (
                <span>
                    <button onClick={this.onApiBtnClick.bind(this, 'Test')}>Test</button>
                </span>
            );
        }

        return null;
    }

    /**
     * 렌더링
     */
    render(): React.ReactNode {
        return (
            <div className="control-panel">
                <fieldset className="control-fieldset">
                    <legend>WebGL</legend>
                    <label htmlFor='ApiList'>Api List:</label>
                    <select id='ApiList' defaultValue='None' onChange={this.onApiSelectChange.bind(this)}>
                        <option value='None' disabled>Api 선택</option>
                        <option value='Loader'>Loader</option>
                        <option value='Camera'>Camera</option>
                        <option value='Model'>Model</option>
                        <option value='Poi'>Poi</option>
                        <option value='Path'>Path</option>
                        <option value='Util'>Util</option>
                        <option value='Subway'>Subway</option>
                        <option value='Label3D'>Label3D</option>
                        <option value='Test'>Test</option>
                    </select>
                    <br />
                    {this.renderMenu()}
                </fieldset>
            </div>
        );
    }

    /**
     * api 선택 변경 이벤트
     * @param event - 이벤트 정보
     */
    onApiSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({ selectedApiName: event.target.value });
    }

    /**
     * api 버튼 클릭 이벤트
     * @param apiName - Api 명
     */
    onApiBtnClick(apiName: string) {
        switch (apiName) {
            /**
             * Camera
             */
            case 'Camera.GetState': {
                const state = Camera.GetState();
                localStorage.setItem('CameraState', JSON.stringify(state));
            } break;
            case 'Camera.SetState': {
                const state = localStorage.getItem('CameraState');
                if (state === undefined || state === null) {
                    console.warn('no such data of camera state.');
                } else {
                    Camera.SetState(JSON.parse(state), 1.0);
                }
            } break;
            case 'Camera.MoveToPoi': {
                if (this.state.moveToPoiIdValue !== '') {
                    Camera.MoveToPoi(this.state.moveToPoiIdValue, 1.0);
                }
            } break;
            case 'Camera.MoveToFloor': {
                if (this.state.moveToFloorIdValue !== '') {
                    Camera.MoveToFloor(this.state.moveToFloorIdValue, 1.0);
                }
            } break;

            /**
             * Model
             */
            case 'Model.GetHierarchy': {
                const data = Model.GetModelHierarchy();

                console.log('Model.GetModelHierarchy -> ', data);

                this.setState({ floorData: data }); // 얻은 층정보로 state 설정
            } break;

            /**
             * Path
             */
            case 'Path.CreatePath': {
                const pathId = window.crypto.randomUUID();
                const color = 0xffffff * Math.random();
                Path3D.CreatePath(pathId, color);
            } break;
            case 'Path.Finish': {
                const pathData = Path3D.Finish();
                console.log('Path3D.Finish -> ', pathData);
            } break;
            case 'Path.Export': {
                const data = Path3D.Export();
                console.log('Path3D.Export -> ', data);
            } break;
            case 'Path.Import': {
                fetch('pathSampleData.json').then(res => res.json()).then(data => Path3D.Import(data));
            } break;
            case 'Path.Clear': {
                Path3D.Clear();
            } break;
            case 'Path.Hide': {
                Path3D.Hide(this.state.pathVisibleId);
            } break;
            case 'Path.Show': {
                Path3D.Show(this.state.pathVisibleId);
            } break;
            case 'Path.HideAll': {
                Path3D.HideAll();
            } break;
            case 'Path.ShowAll': {
                Path3D.ShowAll();
            } break;

            /**
             * Poi
             */
            case 'Poi.Create': {
                const id: string = window.crypto.randomUUID();
                const iconUrl: string = 'SamplePoiIcon.png';
                const displayText: string = id.substring(0, 8) + '테스트__-';
                const property: { [key: string]: unknown } = {
                    testText: '테스트 속성',
                    testInt: 11,
                    testFloat: 2.2
                };

                Poi.Create({
                    id: id,
                    iconUrl: iconUrl,
                    displayText: displayText,
                    property: property
                }, (data: unknown) => console.log('Poi.Create Callback', data));
            } break;
            case 'Poi.Create(MonkeyHead.glb)': {
                const id: string = window.crypto.randomUUID();
                const iconUrl: string = 'SamplePoiIcon.png';
                const displayText: string = id.substring(0, 8);
                const property: { [key: string]: unknown } = {
                    testText: '테스트 속성',
                    testInt: 11,
                    testFloat: 2.2
                };

                Poi.Create({
                    id: id,
                    iconUrl: iconUrl,
                    displayText: displayText,
                    modelUrl: 'monkeyhead.glb',
                    property: property
                }, (data: unknown) => console.log('Poi.Create(MonkeyHead.glb) Callback', data));
            } break;
            case 'Poi.Create(ScreenDoor.glb)': {
                const id: string = window.crypto.randomUUID();
                const iconUrl: string = 'SamplePoiIcon.png';
                const displayText: string = id.substring(0, 8);
                const property: { [key: string]: unknown } = {
                    testText: '테스트 속성',
                    testInt: 11,
                    testFloat: 2.2
                };

                Poi.Create({
                    id: id,
                    iconUrl: iconUrl,
                    displayText: displayText,
                    modelUrl: 'ScreenDoor.glb',
                    property: property
                }, (data: unknown) => console.log('Poi.Create(ScreenDoor.glb) Callback', data));
            } break;
            case 'Poi.Create(head.glb)': {
                const id: string = window.crypto.randomUUID();
                const iconUrl: string = 'SamplePoiIcon.png';
                const displayText: string = id.substring(0, 8);
                const property: { [key: string]: unknown } = {
                    testText: '테스트 속성',
                    testInt: 11,
                    testFloat: 2.2
                };

                Poi.Create({
                    id: id,
                    iconUrl: iconUrl,
                    displayText: displayText,
                    modelUrl: 'subway_train/head.glb',
                    property: property
                }, (data: unknown) => console.log('Poi.Create(ScreenDoor.glb) Callback', data));
            } break;
            case 'Poi.Create(body.glb)': {
                const id: string = window.crypto.randomUUID();
                const iconUrl: string = 'SamplePoiIcon.png';
                const displayText: string = id.substring(0, 8);
                const property: { [key: string]: unknown } = {
                    testText: '테스트 속성',
                    testInt: 11,
                    testFloat: 2.2
                };

                Poi.Create({
                    id: id,
                    iconUrl: iconUrl,
                    displayText: displayText,
                    modelUrl: 'subway_train/body.glb',
                    property: property
                }, (data: unknown) => console.log('Poi.Create(ScreenDoor.glb) Callback', data));
            } break;
            case 'Poi.Delete': {
                if (this.state.deletePoiId !== '') {
                    Poi.Delete(this.state.deletePoiId);
                }
            } break;
            case 'Poi.ExportAll': {
                const data = Poi.ExportAll();
                console.log('Poi.ExportAll', data);
            } break;
            case 'Poi.Import': {
                fetch('poiSampleData.json').then(res => res.json()).then(data => {
                    console.log('Poi.Import', data);
                    Poi.Import(data);
                });
            } break;
            case 'Poi.ImportSingle': {
                Poi.Import('{ "id": "ff8419ab-0b64-40a4-bfc2-0f3b317e0b2e", "iconUrl": "SamplePoiIcon.png", "modelUrl": "monkeyhead.glb", "displayText": "ff8419ab", "property": { "testText": "테스트 속성", "testInt": 11, "testFloat": 2.2 }, "floorId": "4", "position": { "x": -11.168609758648447, "y": 0.19880974292755127, "z": -2.6205250759845735 }, "rotation": { "x": 0, "y": 0, "z": 0 }, "scale": { "x": 1, "y": 1, "z": 1 } }');
            } break;
            case 'Poi.ExportAll(LocalStorage)': {
                const data = Poi.ExportAll();
                console.log('Poi.ExportAll', data);
                localStorage.setItem('PoiData', JSON.stringify(data));
            } break;
            case 'Poi.Import(LocalStorage)': {
                const data = localStorage.getItem('PoiData');
                if (data === undefined || data === null) {
                    console.warn('no such data of PoiData.');
                } else {
                    Poi.Import(JSON.parse(data));
                }
            } break;
            case 'Poi.Clear': {
                Poi.Clear();
            } break;
            case 'Poi.Show': {
                Poi.Show(this.state.setVisiblePoiId);
            } break;
            case 'Poi.Hide': {
                Poi.Hide(this.state.setVisiblePoiId);
            } break;
            case 'Poi.ShowAll': {
                Poi.ShowAll();
            } break;
            case 'Poi.HideAll': {
                Poi.HideAll();
            } break;
            case 'Poi.ShowLine': {
                Poi.ShowLine(this.state.setLineVisiblePoiId);
            } break;
            case 'Poi.HideLine': {
                Poi.HideLine(this.state.setLineVisiblePoiId);
            } break;
            case 'Poi.ShowAllLine': {
                Poi.ShowAllLine();
            } break;
            case 'Poi.HideAllLine': {
                Poi.HideAllLine();
            } break;
            case 'Poi.ShowDisplayText': {
                Poi.ShowDisplayText(this.state.setTextVisiblePoiId);
            } break;
            case 'Poi.HideDisplayText': {
                Poi.HideDisplayText(this.state.setTextVisiblePoiId);
            } break;
            case 'Poi.ShowAllDisplayText': {
                Poi.ShowAllDisplayText();
            } break;
            case 'Poi.HideAllDisplayText': {
                Poi.HideAllDisplayText();
            } break;
            case 'Poi.SetDisplayText': {
                Poi.SetDisplayText(this.state.poiDisplayTextIdValue, this.state.poiDisplayTextValue);
            } break;
            case 'Poi.GetAnimationList': {
                const data = Poi.GetAnimationList(this.state.getAnimlistPoiIdValue);
                console.log('Poi.GetAnimationList', data);
            } break;
            case 'Poi.PlayAnimation': {
                Poi.PlayAnimation(this.state.getAnimlistPoiIdValue, this.state.poiAnimNameValue);
            } break;
            case 'Poi.StopAnimation': {
                Poi.StopAnimation(this.state.getAnimlistPoiIdValue);
            } break;
            case 'Poi.StartEdit(translate)': {
                Poi.StartEdit('translate');
            } break;
            case 'Poi.StartEdit(rotate)': {
                Poi.StartEdit('rotate');
            } break;
            case 'Poi.StartEdit(scale)': {
                Poi.StartEdit('scale');
            } break;

            /**
             * Util
             */
            case 'Util.SetBackgroundImage': {
                Util.SetBackground(this.state.backgroundImageUrl);
            } break;

            /**
             * Subway
             */
            case 'Subway.LoadTrainHead': {
                Subway.LoadTrainHead('/subway_train/head.glb', () => console.log('지하철 머리 모델 로드 완료'));
            } break;
            case 'Subway.LoadTrainBody': {
                Subway.LoadTrainBody('/subway_train/body.glb', () => console.log('지하철 몸체 모델 로드 완료'));
            } break;
            case 'Subway.LoadTrainTail': {
                Subway.LoadTrainTail('/subway_train/tail.glb', () => console.log('지하철 꼬리 모델 로드 완료'));
            } break;
            case 'Subway.Create': {
                const id = window.crypto.randomUUID();
                const bodyCount = Number.parseInt(this.state.subwayCreateBodyCount);
                Subway.Create({
                    id: id,
                    bodyCount: bodyCount
                }, () => console.log('지하철 생성 완료'));
            } break;
            case 'Subway.Cancel': {
                Subway.Cancel();
            } break;
            case 'Subway.EnableSetEntranceLocation': {
                Subway.EnableSetEntranceLocation();
            } break;
            case 'Subway.EnableSetStopLocation': {
                Subway.EnableSetStopLocation();
            } break;
            case 'Subway.EnableSetExitLocation': {
                Subway.EnableSetExitLocation();
            } break;
            case 'Subway.Finish': {
                const data = Subway.Finish();
                console.log('subway ->', data);
            } break;
            case 'Subway.Hide': {
                Subway.Hide(this.state.subwayId);
            } break;
            case 'Subway.Show': {
                Subway.Show(this.state.subwayId);
            } break;
            case 'Subway.HideAll': {
                Subway.HideAll();
            } break;
            case 'Subway.ShowAll': {
                Subway.ShowAll();
            } break;
            case 'Subway.DoEnter': {
                Subway.Show(this.state.subwayId);
                Subway.DoEnter(this.state.subwayId, 5.0, () => console.log('열차 진입 완료:', this.state.subwayId));
            } break;
            case 'Subway.DoExit': {
                Subway.Show(this.state.subwayId);
                Subway.DoExit(this.state.subwayId, 5.0, () => {
                    console.log('열차 진출 완료:', this.state.subwayId);
                    Subway.Hide(this.state.subwayId);
                });
            } break;
            case 'Subway.Export': {
                const data = Subway.Export();
                console.log('subway data ->', data);
            } break;
            case 'Subway.Import': {
                fetch('/subway_train/trainSampleData.json').then(res => res.json()).then(data => {
                    console.log('/subway_train/trainSampleData.json', data);
                    Subway.Import(data);
                });
            } break;

            /**
             * Label3D
             */
            case 'Label3D.Create': {
                const id = window.crypto.randomUUID();
                Label3D.Create({
                    id: id,
                    displayText: '공간명' + (Math.floor(Math.random() * 10).toString()),
                }, (data: unknown) => {
                    console.log('라벨 생성', data);
                });
            } break;
            case 'Label3D.Cancel': {
                Label3D.Cancel();
            } break;
            case 'Label3D.Hide': {
                Label3D.Hide(this.state.label3DId);
            } break;
            case 'Label3D.Show': {
                Label3D.Show(this.state.label3DId);
            } break;
            case 'Label3D.HideAll': {
                Label3D.HideAll();
            } break;
            case 'Label3D.ShowAll': {
                Label3D.ShowAll();
            } break;
            case 'Label3D.Delete': {
                Label3D.Delete(this.state.label3DId);
            } break;
            case 'Label3D.Clear': {
                Label3D.Clear();
            } break;
            case 'Label3D.Export': {
                const data = Label3D.Export();
                console.log('Label3D.Export ->', data);
            } break;
            case 'Label3D.Import': {
                fetch('/label3dsampledata.json').then(res => res.json()).then(data => {
                    console.log('/label3dsampledata.json', data);
                    Label3D.Import(data);
                });
            } break;
            case 'Label3D.StartEdit(translate)': {
                Label3D.StartEdit('translate');
            } break;
            case 'Label3D.StartEdit(rotate)': {
                Label3D.StartEdit('rotate');
            } break;
            case 'Label3D.StartEdit(scale)': {
                Label3D.StartEdit('scale');
            } break;
            case 'Label3D.FinishEdit': {
                Label3D.FinishEdit();
            } break;

            /**
             * Test
             */
            case 'Test': {
                Model.HideAll();
                Model.Show('0');
            } break;
        }
    }

    /**
     * 층 객체 체크박스값 변화 이벤트 처리
     */
    onFloorVisibleCheckChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        const target: HTMLInputElement = evt.target;
        if (target.checked)
            Model.Show(target.id);
        else
            Model.Hide(target.id);
    }

    /**
     * 층객체 모든 층 보이기/숨기기
     * @param isVisible - 가시화 여부
     */
    setFloorVisibility(isVisible: boolean) {
        if (isVisible)
            Model.ShowAll();
        else
            Model.HideAll();
    }

    /**
     * poi로 카메라 이동 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onMoveToPoiTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ moveToPoiIdValue: evt.target.value });
    }

    /**
     * 층으로 카메라 이동 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onMoveToFloorTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ moveToFloorIdValue: evt.target.value });
    }

    /**
     * poi 제거 텍스트 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onDeletePoiTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ deletePoiId: evt.target.value });
    }

    /**
     * poi 기사화 설정 텍스트 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onSetVisiblePoiTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ setVisiblePoiId: evt.target.value });
    }

    /**
     * poi 선 가시화 설정 텍스트 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onSetLineVisibleTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ setLineVisiblePoiId: evt.target.value });
    }

    /**
     * poi 표시명 텍스트 가시화 설정 텍스트 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onSetPoiTextVisibleInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ setTextVisiblePoiId: evt.target.value });
    }

    /**
     * poi 표시명 텍스트 변경 id입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onPoiDisplayTextIdInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ poiDisplayTextIdValue: evt.target.value });
    }

    /**
     * poi 표시명 텍스트 변경 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onPoiDisplayTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ poiDisplayTextValue: evt.target.value });
    }

    /**
     * poi 애니메이션 얻기 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onGetAnimListTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ getAnimlistPoiIdValue: evt.target.value });
    }

    /**
     * poi 애니메이션 이름 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onAnimNameTextInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ poiAnimNameValue: evt.target.value });
    }

    /**
     * util 색상코드로 배경색 설정 값변경 처리
     * @param evt - 이벤트 정보
     */
    onBackgroundColorChange(evt: React.ChangeEvent<HTMLInputElement>) {
        const colorNumber = parseInt(evt.target.value.replace('#', ''), 16);
        Util.SetBackground(colorNumber);
    }

    /**
     * util 이미지로 배경설정 input 값변경 처리
     * @param evt - 이벤트 정보
     */
    onBackgroundImageUrlChange(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ backgroundImageUrl: evt.target.value });
    }

    /**
     * 경로 가시화 설정 입력창 값변경 처리
     * @param evt - 이벤트 정보
     */
    onPathVisibleInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ pathVisibleId: evt.target.value });
    }

    /**
     * 지하철 생성 차량 개수 값변경 처리
     * @param evt - 이벤트 정보
     */
    onSubwayBodyCountInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ subwayCreateBodyCount: evt.target.value });
    }

    /**
     * 지하철 id 값변경 처리
     * @param evt - 이벤트 정보
     */
    onSubwayIdInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ subwayId: evt.target.value });
    }

    /**
     * 라벨3d id값 변경 처리
     * @param evt - 이벤트 정보
     */
    onLabel3DIdInputValueChanged(evt: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ label3DId: evt.target.value });
    }

    /**
     * 뷰어 이벤트 등록
     */
    registerViewerEvents() {
        // poi 편집 이벤트 등록
        Event.AddEventListener('onPoiTransformChange' as never, (evt: any) => {
            console.log('onPoiTransformChange', evt);
        });
        // poi 객체 포인터업 이벤트 등록
        Event.AddEventListener('onPoiPointerUp' as never, (evt: any) => {
            console.log('onPoiPointerUp', evt);
        });
        // 라벨 3d 편집 이벤트 등록
        Event.AddEventListener('onLabel3DTransformChange' as never, (evt: any) => {
            console.log('onLabel3DTransformChange', evt);
        });
        // 라벨 3d 포인터업 이벤트 등록
        Event.AddEventListener('onLabel3DPointerUp' as never, (evt: any) => {
            console.log('onLabel3DPointerUp', evt);
        });
    }
}

export default WebGLControlPanel;