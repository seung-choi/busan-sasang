import React, { useState, useEffect } from 'react';
import { useStationEnv } from '@plug/v1/app/api/hooks/nflux';

interface HeaderEnvInfoProps {
  externalCode: string;
}

interface EnvDisplayData {
  temperature: {
    watingRoom: number | string;
    platform: number | string;
    external: number | string;
  };
  airQuality: {
    ultrafineDust: number | string;
  };
}

const HeaderEnvInfo: React.FC<HeaderEnvInfoProps> = ({ externalCode }) => {
  const { data, loading, error, refetch } = useStationEnv(externalCode);

  const defaultData: EnvDisplayData = {
    temperature: {
      watingRoom: '-',
      platform: '-',
      external: '-',
    },
    airQuality: {
      ultrafineDust: '-',
    },
  };

  const [displayData, setDisplayData] = useState<EnvDisplayData>(defaultData);

  useEffect(() => {
    if (data && !loading) {
      const formattedData: EnvDisplayData = {
        temperature: {
          watingRoom: data.temperature.watingRoom,
          platform: data.temperature.platform,
          external: data.temperature.external,
        },
        airQuality: {
          ultrafineDust: data.airQuality.ultrafineDust,
        },
      };
      setDisplayData(formattedData);
    }
  }, [data, loading]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="flex items-center gap-3 !bg-primary-900/20 rounded-lg px-3 py-1.5 border border-white/10 backdrop-blur-lg  transition-all duration-200 shadow-lg">
      <div className="flex items-center gap-3">
        {[
          { label: '대합실', value: displayData.temperature.watingRoom },
          { label: '승강장', value: displayData.temperature.platform },
          { label: '외부', value: displayData.temperature.external },
        ].map(({ label, value }) => (
          <div key={label} className="flex items-center gap-2 last:border-r-0">
            <span className="text-gray-100 text-sm font-medium tracking-wide">{label}</span>
            <div className="text-white flex gap-1 text-sm font-medium tracking-wide tabular-nums px-2.5 py-1 bg-white/15 rounded-md backdrop-blur-lg shadow-inner">
              <div className="flex items-center gap-1">
                <span>{value}</span>
                <span className="text-xs">°C</span>
              </div>
              <img
                src="/3d-map/assets/station/temp.svg"
                alt="온도"
                width={12}
                height={14}
                className="brightness-0 invert opacity-90"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1">
        <span className="text-gray-100 text-sm font-medium tracking-wide">초미세먼지</span>
        <div className="flex items-center gap-1">
          {typeof displayData.airQuality.ultrafineDust === 'number' && (
            <span
              className={`text-xs px-2 py-1 rounded-full font-medium ${getAirQualityStatusColor(displayData.airQuality.ultrafineDust)}`}
            >
              {getAirQualityStatus(displayData.airQuality.ultrafineDust)}
            </span>
          )}
          <div className="text-white text-sm font-medium tracking-wide tabular-nums px-2.5 py-1 bg-white/15 rounded-md backdrop-blur-lg shadow-inner flex gap-1">
            <div className="flex items-center gap-1">
              <span>{displayData.airQuality.ultrafineDust}</span>
              <span className="text-xs">㎍/㎥</span>
            </div>
          </div>
        </div>
        {error && !loading && (
          <span className="text-red-400 text-xs font-medium bg-red-500/10 px-2 py-1 rounded-full border border-red-500/30">
            오류
          </span>
        )}
      </div>
    </div>
  );
};

const getAirQualityStatus = (value: number): string => {
  if (value <= 15) return '좋음';
  if (value <= 35) return '보통';
  if (value <= 75) return '나쁨';
  return '매우 나쁨';
};

const getAirQualityStatusColor = (value: number): string => {
  if (value <= 15) return 'bg-green-500/20 text-green-300 border border-green-500/30 shadow-lg shadow-green-500/10';
  if (value <= 35) return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 shadow-lg shadow-yellow-500/10';
  if (value <= 75) return 'bg-orange-500/20 text-orange-300 border border-orange-500/30 shadow-lg shadow-orange-500/10';
  return 'bg-red-500/20 text-red-300 border border-red-500/30 shadow-lg shadow-red-500/10';
};

export default HeaderEnvInfo;