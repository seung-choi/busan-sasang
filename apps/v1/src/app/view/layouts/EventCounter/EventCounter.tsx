import React, { useState, useEffect, useRef } from 'react';
import useEventStore from '@plug/v1/app/stores/eventSourceStore';
import { useStationEvents} from '@plug/v1/app/api';

interface EventCounterProps {
  stationId: string;
}

const EventCounter: React.FC<EventCounterProps> = ({ stationId }) => {
  const { eventData } = useEventStore();
  const [displayData, setDisplayData] = useState({
    critical: 0,
    major: 0,
    minor: 0,
  });
  const { data } = useStationEvents(stationId);
  const initialDataLoaded = useRef(false);

  useEffect(() => {
    if (data && !initialDataLoaded.current) {
      const mergedData = {
        critical: (data.equips?.critical || 0) + (data.electrics?.critical || 0),
        major: (data.equips?.major || 0) + (data.electrics?.major || 0),
        minor: (data.equips?.minor || 0) + (data.electrics?.minor || 0),
      };
      setDisplayData(mergedData);
      initialDataLoaded.current = true;
    }
  }, [data]);

  useEffect(() => {
    if (eventData && eventData.length > 0 && initialDataLoaded.current) {
      const latestEvent = eventData[eventData.length - 1];
      setDisplayData(prevData => {
        const newData = { ...prevData };
        if (latestEvent.level === 'CRITICAL') {
          newData.critical += 1;
        } else if (latestEvent.level === 'MAJOR') {
          newData.major += 1;
        } else if (latestEvent.level === 'MINOR') {
          newData.minor += 1;
        }
        return newData;
      });
    }
  }, [eventData]);

  const eventTypes = [
    {
      label: 'Critical',
      count: displayData.critical,
      textColor: 'text-red-100',
      borderColor: 'border-red-500/50',
      bgColor: 'bg-red-500',
    },
    {
      label: 'Major',
      count: displayData.major,
      textColor: 'text-orange-100',
      borderColor: 'border-orange-500/50',
      bgColor: 'bg-orange-500',
    },
    {
      label: 'Minor',
      count: displayData.minor,
      textColor: 'text-yellow-100',
      borderColor: 'border-yellow-500/50',
      bgColor: 'bg-yellow-500',
    },
  ];

  return (
    <div className="fixed top-20 right-4 z-20">
      <div className="flex items-center gap-4 bg-primary-900/30 backdrop-blur-md px-4 py-2 rounded-lg">
        {eventTypes.map(({ label, count, textColor, borderColor, bgColor }) => (
          <div
            key={label}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${borderColor} ${bgColor}/20 transition-colors`}
          >
            <div className={`w-2 h-2 ${bgColor} rounded-full animate-pulse`} />
            <div className="flex items-center gap-2">
              <span className="text-gray-300 text-xs font-medium">{label}</span>
              <span className={`${textColor} text-sm font-bold tabular-nums`}>{count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCounter;