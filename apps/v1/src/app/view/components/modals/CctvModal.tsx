import React from 'react';
import { Button, Modal } from '@plug/ui';
import type { CCTV } from '@plug/v1/app/api/types/nflux';

export interface CctvModalProps {
  isOpen: boolean;
  onClose: () => void;
  cctvList: CCTV[];
  deviceName: string;
  deviceType: 'elevator' | 'escalator' | 'shutter';
}

const getDeviceTheme = (deviceType: 'elevator' | 'escalator' | 'shutter') => {
  switch (deviceType) {
    case 'elevator':
      return {
        color: 'blue',
        bgColor: 'bg-blue-950/20',
        borderColor: 'border-blue-500/20',
        textColor: 'text-blue-300',
        iconColor: 'text-blue-400'
      };
    case 'escalator':
      return {
        color: 'purple',
        bgColor: 'bg-purple-950/20',
        borderColor: 'border-purple-500/20',
        textColor: 'text-purple-300',
        iconColor: 'text-purple-400'
      };
    case 'shutter':
      return {
        color: 'orange',
        bgColor: 'bg-orange-950/20',
        borderColor: 'border-orange-500/20',
        textColor: 'text-orange-300',
        iconColor: 'text-orange-400'
      };
  }
};

const getDeviceIcon = (deviceType: 'elevator' | 'escalator' | 'shutter') => {
  switch (deviceType) {
    case 'elevator':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
             className="w-5 h-5">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M15 3v18"/>
        </svg>
      );
    case 'escalator':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 4h18M9 3v2m6-2v2M9 19v2m6-2v2" />
        </svg>
      );
    case 'shutter':
      return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 9l-7 7-7-7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zM8 12h8" />
        </svg>
      );
  }
};

export const CctvModal: React.FC<CctvModalProps> = ({
  isOpen,
  onClose,
  cctvList,
  deviceName,
  deviceType
}) => {
  const theme = getDeviceTheme(deviceType);
  const DeviceIcon = () => getDeviceIcon(deviceType);

  const getGridLayout = () => {
    const count = cctvList.length;
    if (count <= 2) return 'grid-cols-1 lg:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-2';
    return 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closable={false}
      title={
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg ${theme.bgColor} ${theme.borderColor} border flex items-center justify-center`}>
            <div className={theme.iconColor}>
              <DeviceIcon />
            </div>
          </div>
          <div>
            <span className="text-primary-100 font-medium">{deviceName}</span>
            <span className={`ml-2 text-sm ${theme.textColor}`}>CCTV 영상 ({cctvList.length}개)</span>
          </div>
        </div>
      }
      contentClassName="
        !bg-primary-900/30 backdrop-blur-xl
        border border-primary-600/20
        shadow-2xl shadow-primary-500/10
        !max-w-7xl !w-[95vw]
      "
      headerClassName="!bg-transparent !border-b !border-primary-600/20 !px-6 !py-4"
      bodyClassName="!bg-transparent !px-6 !py-4"
      footerClassName="!bg-transparent !border-t !border-primary-600/20 !px-6 !py-4"
      footer={
        <Button
          variant="outline"
          onClick={onClose}
          className="
            text-primary-100 border-primary-400/30
            hover:bg-primary-400/10 hover:border-primary-400/50
            transition-all duration-200
          "
        >
          닫기
        </Button>
      }
    >
      <div className="min-h-[50vh] max-h-[75vh] overflow-y-auto custom-scrollbar pr-1">
        <div className={`grid gap-6 ${getGridLayout()}`}>
          {cctvList.map((cctv, index) => (
            <div 
              key={index} 
              className={`${theme.bgColor} rounded-lg border ${theme.borderColor} overflow-hidden shadow-lg`}
            >
              {/* CCTV 헤더 */}
              <div className="p-4 border-b border-primary-700/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                    <div>
                      <h3 className="text-primary-100 font-medium">{cctv.cctvName}</h3>
                      <p className="text-xs text-primary-400 mt-1">ID: {cctv.cctvId}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${theme.bgColor} ${theme.borderColor} border`}>
                    <span className={`text-xs font-medium ${theme.textColor}`}>LIVE</span>
                  </div>
                </div>
              </div>

              {/* CCTV 영상 */}
              <div className="p-4">
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border border-gray-700/50">
                  <iframe 
                      // src={`http://192.168.4.29:8888/${cctv.cctvId.replace(/[()]/g, '_')}`} 
                    src={`http://101.254.21.120:10300/3d-map/cctv/${cctv.cctvId.replace(/[()]/g, '_')}`} 
                    className="w-full h-full"
                    title={`CCTV ${cctv.cctvName}`}
                  />
                  
                  {/* 로딩 오버레이 */}
                  <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="text-white/70 text-sm">
                      {cctv.cctvName}
                    </div>
                  </div>
                </div>

                {/* CCTV 정보 */}
                <div className="mt-3 flex items-center justify-between text-xs text-primary-400">
                  <span>해상도: 1920x1080</span>
                  <span>상태: 정상</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 빈 상태 */}
        {cctvList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-800/50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-primary-200 font-medium mb-2">CCTV 없음</h3>
            <p className="text-primary-400 text-sm text-center max-w-md">
              이 {deviceType === 'elevator' ? '엘리베이터' : deviceType === 'escalator' ? '에스컬레이터' : '셔터'}에는 연결된 CCTV가 없습니다.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
