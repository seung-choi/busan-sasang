import React, { useState, useEffect } from 'react';
import { Button, Modal } from '@plug/ui';
import { nfluxService, nfluxWidgetService } from '@plug/v1/app/api';
import type { Light, Shutter, CCTV, FireSensor, Elevator, Escalator, WaterTank, Catchpit, AirPurifier, LightGroup, ShutterGroup, VentilationMachine } from '@plug/v1/app/api/types/nflux';
import DeviceDetailContent, { CommonInfo } from './DeviceDetailContent';
import CctvStream from './CctvStream';

type DeviceData = Light | Shutter | CCTV | FireSensor | Elevator | Escalator | WaterTank | Catchpit | AirPurifier | LightGroup | ShutterGroup | VentilationMachine;

// Device types that should not show CommonInfo
const HIDE_COMMON_INFO_DEVICES = ['cctv', 'cctvs', 'ventilationmachine', 'ventilationmachines'];

export interface DeviceDetailProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  deviceType: string;
  stationId: string;
  deviceId: string | null;
}

const useDeviceData = (isOpen: boolean, deviceId: string | null, deviceType: string, stationId: string) => {
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !deviceId) {
      setDeviceData(null);
      setError(null);
      return;
    }

    const fetchDeviceData = async () => {
      setLoading(true);
      setError(null);

      try {
        let data: DeviceData | null = null;

        switch (deviceType.toLowerCase()) {
          case 'light':
          case 'lights': {
            const result = await nfluxService.getLights(stationId);
            data = result.find(item => item.lightId === deviceId) || null;
            break;
          }
          case 'cctv':
          case 'cctvs': {
            const result = await nfluxService.getCCTV(stationId);
            data = result.find((item: CCTV) => item.cctvId === deviceId) || null;
            break;
          }
          case 'shutter':
          case 'shutters': {
            const result = await nfluxService.getShutters(stationId);
            data = result.find(item => item.shutterId === deviceId) || null;
            break;
          }
          case 'fire-sensor':
          case 'fire-sensors': {
            const result = await nfluxService.getFireSensors(stationId);
            data = result.find(item => item.fireSensorId === deviceId) || null;
            break;
          }
          case 'elevator':
          case 'elevators': {
            const result = await nfluxService.getElevators(stationId);
            data = result.find(item => item.elevatorId === deviceId) || null;
            break;
          }
          case 'escalator':
          case 'escalators': {
            const result = await nfluxService.getEscalators(stationId);
            data = result.find(item => item.escalatorId === deviceId) || null;
            break;
          }
          case 'watertank':
          case 'watertanks': {
            const result = await nfluxService.getWaterTanks(stationId);
            data = result.find(item => item.waterTankId === deviceId) || null;
            break;
          }
          case 'catchpit':
          case 'catchpits': {
            const result = await nfluxService.getCatchpits(stationId);
            data = result.find(item => item.catchpitId === deviceId) || null;
            break;
          }
          case 'airpurifier':
          case 'airpurifiers': {
            const result = await nfluxService.getAirPurifiers(stationId);
            data = result.find(item => item.airPurifierId === deviceId) || null;
            break;
          }
          case 'lightgroup':
          case 'lightgroups': {
            const result = await nfluxWidgetService.getLightGroups(stationId);
            console.log('Light Groups:', result);
            data = result.find(item => item.lightGroupId === deviceId) || null;
            break;
          }
          case 'shuttergroup':
          case 'shuttergroups': {
            const result = await nfluxWidgetService.getShutterGroups(stationId);
            console.log('Shutter Groups:', result);
            data = result.find(item => item.shutterGroupId === deviceId) || null;
            break;
          }
          case 'ventilationmachine':
          case 'ventilationmachines': {
            const result = await nfluxWidgetService.getVentilationMachine(deviceId);
            data = result["ventilationMachine"];
            break;
          }
          default:
            throw new Error(`지원하지 않는 장비 타입: ${deviceType}`);
        }

        if (!data) {
          throw new Error(`장비를 찾을 수 없습니다: ${deviceId}`);
        }

        setDeviceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '장비 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceData();
  }, [isOpen, deviceId, deviceType, stationId]);

  return { deviceData, loading, error };
};

export const DeviceDetailModal = ({
  isOpen,
  onClose,
  title,
  deviceType,
  stationId,
  deviceId,
}: DeviceDetailProps) => {

  const { deviceData, loading, error } = useDeviceData(isOpen, deviceId, deviceType, stationId);

  // Get CCTV list from device data
  const cctvList: CCTV[] = (() => {
    if (!deviceData) return [];

    if ('cctvList' in deviceData && deviceData.cctvList) {
      return deviceData.cctvList.map(cctv => {
        if ('streamAddress' in cctv && 'cctvId' in cctv && 'cctvName' in cctv) {
          return {
            cctvId: cctv.cctvId,
            cctvName: cctv.cctvName,
            streamAddress: cctv.streamAddress,
            fcltsType: 'cctv',
            cctvAngle: '0',
            location: { xValue: 0, yValue: 0 }
          } as CCTV;
        }
        return cctv as CCTV;
      });
    }

    return [];
  })();

  // const hasCctvs = cctvList.length > 0;
  const hasCctvs = cctvList.map(cctv =>  cctv.streamAddress)
    .filter(streamAddress => streamAddress.length > 0).length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closable={false}
      width={"100%"}
      title={
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          <span className="text-primary-100">{title} 상세정보</span>
          {hasCctvs && (
            <span className="text-primary-400 text-sm">
              (CCTV {cctvList.length}개)
            </span>
          )}
        </div>
      }
      contentClassName={`
        !bg-primary-900/30 backdrop-blur-xl
        border border-primary-600/20
        shadow-2xl shadow-primary-500/10
        ${hasCctvs ? '!max-w-7xl !w-[95vw]' : '!max-w-xl !w-[50vw]'}
      `}
      headerClassName="!bg-transparent !border-b !border-primary-600/20 !px-6 !py-4"
      bodyClassName="!bg-transparent !px-6 !py-4  overflow-y-auto scrollbar-thin scrollbar-thumb-primary-400/30 scrollbar-track-primary-600/20"
      footer={
        <Button
          variant="outline"
          onClick={onClose}
          className="text-primary-100 border-primary-400/30 hover:bg-primary-400/10 hover:border-primary-400/50 transition-all duration-200"
        >
          닫기
        </Button>
      }
    >
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-primary-100 flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>장비 정보를 불러오는 중...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500/90 text-center py-4 bg-red-900/40 border border-red-500/20 rounded-lg backdrop-blur-xl shadow-lg">
          {error}
        </div>
      )}      {deviceData && !loading && !error && (
        <>
          {(deviceType.toLowerCase() === 'cctv' || deviceType.toLowerCase() === 'cctvs') ? (
            <div className="flex items-center justify-center">
              <div className="w-full max-w-4xl">
                <CctvStream cctv={deviceData as CCTV} />
              </div>
            </div>
          ) : (
            hasCctvs ? (
            <div className="flex gap-6 h-[60vh]">
                <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-400/30 scrollbar-track-primary-600/20">
                  <h3 className="text-primary-100 font-medium flex items-center gap-2 sticky top-0 bg-primary-900/50 backdrop-blur-sm py-2 rounded-lg px-3">
                    <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    CCTV 영상
                  </h3>
                  {cctvList.map((cctv, index) => {
                    const shouldShowOnLeft = cctvList.length === 1 || index % 2 === 0;
                    if (!shouldShowOnLeft) return null;

                    return (
                      <CctvStream
                        key={`left-${index}`}
                        cctv={cctv}
                        className="mb-4"
                      />
                    );
                  })}
                </div>

                <div className="flex-1">
                  <div className="top-0 bg-primary-900/50 backdrop-blur-sm py-2 rounded-lg px-3 mb-4">
                    <h3 className="text-primary-100 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      장비 정보
                    </h3>                  </div>
                  {!HIDE_COMMON_INFO_DEVICES.includes(deviceType.toLowerCase()) && <CommonInfo device={deviceData} />}
                  <DeviceDetailContent deviceData={deviceData} deviceType={deviceType} />
                </div>

                {cctvList.length > 1 && (
                  <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-400/30 scrollbar-track-primary-600/20">
                    <h3 className="text-primary-100 font-medium flex items-center gap-2 sticky top-0 bg-primary-900/50 backdrop-blur-sm py-2 rounded-lg px-3">
                      <svg className="w-4 h-4 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      CCTV 영상
                    </h3>
                    {cctvList.map((cctv, index) => {
                      const shouldShowOnRight = index % 2 === 1;
                      if (!shouldShowOnRight) return null;

                      return (
                        <CctvStream
                          key={`right-${index}`}
                          cctv={cctv}
                          className="mb-4"
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (              <div className="min-h-[50vh] max-h-[75vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-400/30 scrollbar-track-primary-600/20">
                {!HIDE_COMMON_INFO_DEVICES.includes(deviceType.toLowerCase()) && <CommonInfo device={deviceData} />}
                <DeviceDetailContent deviceData={deviceData} deviceType={deviceType} />
              </div>
            )
          )}
        </>
      )}
    </Modal>
  );
};
