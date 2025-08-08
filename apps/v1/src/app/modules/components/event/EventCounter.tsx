import React, { useState, useEffect } from 'react';
import { useStationEvents } from '@plug/v1/app/api/hooks/nflux';

interface EventInfoPanelProps {
  stationId: string;
}

const EventCounter: React.FC<EventInfoPanelProps> =({ stationId }) => {
  const { data, loading } = useStationEvents(stationId);
  const [displayData, setDisplayData] = useState({
    equips: { critical: 0, major: 0, minor: 0 },
    electrics: { critical: 0, major: 0, minor: 0 }
  });
  // 데이터가 변경될 때만 상태 업데이트
  useEffect(() => {
    if (data && !loading) {
      setDisplayData(data);
    }
  }, [data, loading]);
  
  // 전체 이벤트 계산
  const totalCritical = displayData.equips.critical + displayData.electrics.critical;
  const totalMajor = displayData.equips.major + displayData.electrics.major;
  const totalMinor = displayData.equips.minor + displayData.electrics.minor;

  return (
    <div className="fixed top-20 right-4 z-20">
      <div className="w-[340px] h-9 relative">
        <div className="w-[340px] h-9 left-0 top-0 absolute bg-primary-400/20 rounded-[5px] backdrop-blur-[5px]" />

        {/* Critical */}
        <div className="w-3 h-3 left-[10px] top-[12px] absolute bg-red-600 rounded-full" />
        <div className="left-[29px] top-[7px] absolute justify-start text-white text-sm font-normal font-['Noto_Sans_KR']">Critical</div>        <div className="left-[92px] top-[6px] absolute justify-start text-white text-base font-bold font-['Noto_Sans_KR']">
          {totalCritical}
        </div>
        
        {/* Major */}
        <div className="w-3 h-3 left-[125px] top-[12px] absolute bg-amber-500 rounded-full" />
        <div className="left-[146px] top-[7px] absolute justify-start text-white text-sm font-normal font-['Noto_Sans_KR']">Major</div>
        <div className="left-[207px] top-[6px] absolute justify-start text-white text-base font-bold font-['Noto_Sans_KR']">
          {totalMajor}
        </div>
        
        {/* Minor */}
        <div className="w-3 h-3 left-[240px] top-[12px] absolute bg-primary-400 rounded-full" />
        <div className="left-[261px] top-[7px] absolute justify-start text-white text-sm font-normal font-['Noto_Sans_KR']">Minor</div>
        <div className="left-[322px] top-[6px] absolute justify-start text-white text-base font-bold font-['Noto_Sans_KR']">
          {totalMinor}
        </div>
      </div>
    </div>
  );
};

export default EventCounter;
