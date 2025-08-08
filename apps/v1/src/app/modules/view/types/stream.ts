type OpCode = '열차 접근' | '출발' | '도착';

export interface TrainData {
  messageNumber: number;
  opCode: OpCode;
  arrivalStationCode: string;
  arrivalStationName: string;
  trainDirection: string;
  thisTrainNumber: string;
  nextTrainNumber: string;
  timestamp: string;
  line: string;
}

export interface EventData {
  id: string;
  message: string;
  level: 'CRITICAL' | 'MAJOR' | 'MINOR';
}

export interface ShutterData {
  id: string;
  status: {
    ioId: string;
    ioValue: string;
  }
}
