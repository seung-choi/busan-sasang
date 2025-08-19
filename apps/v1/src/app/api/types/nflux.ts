// NFlux API 관련 타입들
export interface Location {
  lat: number;
  lon: number;
}

export interface Position {
  xValue: number;
  yValue: number;
}

export interface Temperature {
  watingRoom: number;
  platform: number;
  external: number;
}

export interface AirQuality {
  ultrafineDust: number;
}

export interface StationEnv {
  temperature: Temperature;
  airQuality: AirQuality;
}

export interface Station {
  lineNo: string;
  stationId: string;
  stationName: string;
  fcltsType: string;
  location: Location;
  stationEnv: StationEnv;
  eventNumbers: number;
  fireStatus: '0' | '1';
}

export interface CCTV {
  lineNo?: string;
  stationId?: string;
  stationName?: string;
  cctvId: string;
  cctvName: string;
  fcltsType: string;
  cctvAngle: string;
  streamAddress: string;
  location: Position;
  collectedTime?: string;
}

export interface WindGauge {
  lineNo: string;
  gaugeId: string;
  gaugeName: string;
  fcltsType: string;
  location: Location;
  windDirection: string;
  windSpeed: string;
  maxWindSpeed: string;
  avgWindSpeed: string;
  collectedTime?: string;
}

export interface IOStatus {
  ioId: string;
  ioValue: string;
}

export interface Light {
  stationId: string;
  stationName: string;
  lightId: string;
  lightName: string;
  fcltsType: string;
  collectedTime: string;
  status: IOStatus;
  controlPosition: IOStatus;
  location: Position;
  orderingSequence: number;
}

export interface ScheduleTime {
  on: string;
  off: string;
}

export interface LightGroup {
  stationId: string;
  stationName: string;
  lightGroupId: string;
  lightGroupName: string;
  fcltsType: string;
  collectedTime: string;
  status: IOStatus;
  controlPosition: IOStatus;
}

export interface Shutter {
  stationId: string;
  stationName: string;
  shutterId: string;
  shutterName: string;
  fcltsType: string;
  collectedTime: string;
  status: IOStatus;
  cctvList: CCTV[];
  location: Position;
}

export interface ShutterInGroup {
  stationId: string;
  stationName: string;
  shutterId: string;
  shutterName: string;
  fcltsType: string;
  status: IOStatus;
}

export interface CCTVInGroup {
  cctvId: string;
  cctvName: string;
  streamAddress: string;
}

export interface ShutterGroup {
  stationId: string;
  stationName: string;
  shutterGroupId: string;
  shutterGroupName: string;
  fcltsType: string;
  collectedTime: string;
  scheduleSetting: string;
  scheduleTime: ScheduleTime;
  shutterList: ShutterInGroup[];
  cctvList: CCTVInGroup[];
}

export interface FireSensor {
  fireSensorId: string;
  fireSensorName: string;
  fcltsType: string;
  collectedTime: string;
  status: IOStatus;
  location: Position;
}

export interface Pump {
  pumpName: string;
  status: IOStatus;
  error: IOStatus;
  remoteSetting?: IOStatus;
  operationTime?: IOStatus;
  operationMinute?: IOStatus;
  overtime?: IOStatus;
}

export interface Elevator {
  stationId: string;
  stationName: string;
  elevatorId: string;
  elevatorName: string;
  fcltsType: string;
  collectedTime: string;
  status: IOStatus;
  downMoveStatus?: IOStatus;
  error: IOStatus;
  pumps: Pump[] | null;
  cctvList: CCTV[];
  location: Position;
}

export interface Escalator {
  stationId: string;
  stationName: string;
  escalatorId: string;
  escalatorName: string;
  fcltsType: string;
  collectedTime: string;
  status: IOStatus;
  error: IOStatus;
  cctvList: CCTV[];
  location: Position;
}

export interface WaterTank {
  stationId: string;
  stationName: string;
  waterTankId: string;
  waterTankName: string;
  fcltsType: string;
  collectedTime: string;
  waterPressure: IOStatus;
  waterLevel: IOStatus;
  lowWaterLevelSetting: IOStatus;
  highWaterLevelSetting: IOStatus;
  fullWaterLevelSetting: IOStatus;
  lowWaterLevelStatus: IOStatus;
  highWaterLevelStatus: IOStatus;
  fullWaterLevelStatus: IOStatus;
  pumps: Pump[];
  location: Position;
}

export interface Catchpit {
  stationId: string;
  stationName: string;
  catchpitId: string;
  catchpitName: string;
  fcltsType: string;
  collectedTime: string;
  waterLevel: IOStatus;
  lowWaterLevelSetting: IOStatus;
  highWaterLevelSetting: IOStatus;
  fullWaterLevelSetting: IOStatus;
  lowWaterLevelStatus: IOStatus;
  highWaterLevelStatus: IOStatus;
  fullWaterLevelStatus: IOStatus;
  pumps: Pump[];
  location: Position;
}

export interface AirPurifier {
  stationId: string;
  stationName: string;
  airPurifierId: string;
  airPurifierName: string;
  fcltsType: string;
  collectedTime: string;
  status: IOStatus;
  error: IOStatus;
  communicationFailure: IOStatus;
  location: Position;
}

export interface StationEvents {
  equips: {
    critical: number;
    major: number;
    minor: number;
  };
  electrics: {
    critical: number;
    major: number;
    minor: number;
  };
}

export interface AlarmCurrentStat {
  critical: number;
  major: number;
  minor: number;
  equip: number;
  electric: number;
  fire: number;
}

export interface AlarmTodayStat {
  critical: number;
  major: number;
  minor: number;
  equip: number;
  electric: number;
  fire: number;
}

export interface Alarm {
  eventOccrrncUuid: string;
  siteCd: string;
  siteNm: string;
  svcGrupCd: string;
  svcGrupNm: string;
  svcCd: string;
  svcNm: string;
  eventCd: string;
  eventNm: string;
  eventTypCd: string;
  eventTypNm: string;
  fcltsId: string;
  eventGradCd: string;
  procSttus: string;
  procSttusNm: string;
  eventCn: string;
  occrrncLcNm: string;
  svcOccrrncId: string;
  occrrncDtm: string;
  relesDtm: string;
  endDtm: string;
  endTyp: string;
  eventId: string;
  eventGradNm: string;
}

// 조명/셔터 제어 관련
export interface ControlRequest {
  cmd: string;
  fcltsId: string;
  fcltsType?: string;
}

export interface ControlResponse {
  fcltsId: string;
  result: 'SUCCESS' | 'FAIL';
}

// 알람 조회 파라미터
export interface AlarmQueryParams {
  fcltsType?: 'FIRE' | 'EQUIP' | 'ELECTRIC';
  grade?: 'CRITICAL' | 'MAJOR' | 'MINOR';
  dayFrom?: string;
  dayTo?: string;
  keyword?: string;
}

// 환기설비 개별 조회
export interface VentilationMachine {
  fcltsId: string;
  name: string;
  remote: string;
  forward: string;
  auto: string;
  active: string;
  error: string;
  collectedTime: string;
}