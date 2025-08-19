import { useParams } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react'; // useState 추가
import { Header, SideMenu, EventCounter } from "@plug/v1/app/view/layouts";
import { DeviceDetailModal } from '@plug/v1/app/view/components/modals/DeviceDetailModal';
import type { PoiImportOption } from '@plug/engine/dist/src/interfaces';
import useStationStore from '@plug/v1/app/stores/stationStore';
import useEventStore from '@plug/v1/app/stores/eventSourceStore';
import useSideMenuStore from '@plug/v1/app/stores/sideMenuStore';
import { useAssetStore } from '@plug/v1/common/store/assetStore';
import useDeviceModalStore from '@plug/v1/app/stores/deviceModalStore';
import usePoiStore from '@plug/v1/app/stores/poiStore';
import { useEngineIntegration } from '../hooks/useEngineIntegration';
import { useStationData } from '../hooks/useStationData';
import { useFloorData } from '../hooks/useFloorData';
import { EventData, ShutterData, TrainData } from '@plug/v1/app/view/types/stream';
import * as Px from '@plug/engine/src';
import { useToastStore } from '@plug/v1/admin/components/hook/useToastStore';
import { ToastContainer } from '@plug/v1/admin/components/toast/ToastContainer';
import { MapViewer } from '@plug/v1/app/view/map';

const ViewerPage = () => {
  const { code } = useParams<{ code: string }>();
  const parsedCode = code ?? '119';

  const { setExternalCode, setStationCode } = useStationStore();
  const { fetchAssets } = useAssetStore();
  const { openMenuByDeviceId } = useSideMenuStore();
  const { openModal, closeModal, isOpen, title, deviceId, deviceType, stationId } = useDeviceModalStore();
  const { pendingPoiData, clearPendingPoiData } = usePoiStore();
  const { stationData, stationLoading, error } = useStationData(parsedCode);
  const { floorItems, modelPath } = useFloorData(stationData);
  const { setTtcData, setEventData, setShutterData } = useEventStore();
  const { addToast } = useToastStore();

  const [simulationActive, setSimulationActive] = useState(false);

  const handleLoadError = useCallback((loadError: Error) => {
    console.error('3D 모델 로드 실패:', loadError);
  }, []);

  const handlePoiSelect = useCallback((poi: PoiImportOption) => {
    const deviceId = poi.property?.deviceId;
    const displayText = poi.displayText || '장치 정보';
    const deviceType = poi.property?.deviceType || 'shutter';

    if (deviceId && stationData?.externalCode) {
      openMenuByDeviceId(deviceId);
      openModal(displayText, deviceId, deviceType, stationData.externalCode);
    }
  }, [openMenuByDeviceId, openModal, stationData?.externalCode]);

  const { handleModelLoaded: engineModelLoaded } = useEngineIntegration({
    features: [],
    onPoiSelect: handlePoiSelect,
  });  const handleModelLoadedWithEngine = useCallback(() => {
    engineModelLoaded();
    if (pendingPoiData && pendingPoiData.length > 0) {
      Px.Poi.Import(JSON.stringify(pendingPoiData));

      Px.Poi.HideAllLine();
      Px.Poi.HideAllDisplayText();

      clearPendingPoiData();
    } else {
      setTimeout(() => {
        const currentPoiData = usePoiStore.getState().pendingPoiData;
        if (currentPoiData && currentPoiData.length > 0) {
          Px.Poi.Import(JSON.stringify(currentPoiData));

          Px.Poi.HideAllLine();
          Px.Poi.HideAllDisplayText();

          usePoiStore.getState().clearPendingPoiData();
        }
      }, 2000);
    }

    if (stationData?.label3Ds && stationData.label3Ds.length > 0) {
      try {
        const label3DsForImport = stationData.label3Ds.map(label => ({
          id: label.id,
          displayText: label.displayText,
          floorId: label.floorId,
          position: label.position,
          rotation: label.rotation,
          scale: label.scale
        }));
        Px.Label3D.Import(JSON.stringify(label3DsForImport));
        console.log('Label3Ds imported successfully:', label3DsForImport.length);
      } catch (error) {
        console.error('Failed to import Label3Ds:', error);
      }
    }

    if (stationData?.route) {
      Px.Path3D.Import(JSON.parse(stationData?.route));
      Px.Path3D.HideAll();
    }

    const loadTrainModels = () => {
      return Promise.all([
        new Promise<void>((resolve) => {
          Px.Subway.LoadTrainHead("/3d-map/assets/models/head.glb", () => {
            resolve();
          });
        }),
        new Promise<void>((resolve) => {
          Px.Subway.LoadTrainBody("/3d-map/assets/models/body.glb", () => {
            resolve();
          });
        }),
        new Promise<void>((resolve) => {
          Px.Subway.LoadTrainTail("/3d-map/assets/models/tail.glb", () => {
            resolve();
          });
        })
      ]);
    };    loadTrainModels().then(() => {
      if (stationData?.subway) {
        Px.Subway.Import(JSON.parse(stationData?.subway));
        Px.Subway.HideAll();
      }
      setSimulationActive(true);
    });

    Px.Camera.ExtendView(1.0);
  }, [engineModelLoaded, stationData, pendingPoiData, clearPendingPoiData]);

  useEffect(() => {
    if (!simulationActive || !stationData) return;

    const testInterval = 30000;
    const interval = setInterval(() => {
      Px.Subway.Show("1_UP_SUBWAY");
      Px.Subway.Show("1_DOWN_SUBWAY");

      Px.Subway.DoEnter("1_UP_SUBWAY", 5, () => {
        console.log('Train 1_UP_SUBWAY entered');

        setTimeout(() => {
          Px.Subway.DoExit("1_UP_SUBWAY", 5, () => {
            console.log('Train 1_UP_SUBWAY exited');
            Px.Subway.Hide("1_UP_SUBWAY");
          });
        }, 3000);
      });

      Px.Subway.DoEnter("1_DOWN_SUBWAY", 5, () => {
        console.log('Train 1_DOWN_SUBWAY entered');

        setTimeout(() => {
          Px.Subway.DoExit("1_DOWN_SUBWAY", 5, () => {
            console.log('Train 1_DOWN_SUBWAY exited');
            Px.Subway.Hide("1_DOWN_SUBWAY");
          });
        }, 3000);
      });
    }, testInterval);

    return () => {
      console.log('Cleaning up train simulation');
      clearInterval(interval);
    };
  }, [simulationActive, parsedCode, setTtcData, stationData]);

  useEffect(() => {
    setStationCode(parsedCode);
  }, [parsedCode, setStationCode]);

  useEffect(() => {
    setExternalCode(stationData?.externalCode);
  }, [setExternalCode, stationData]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  useEffect(() => {
    // TODO: 개발서버에서는 3d-map 빼기
    const eventSource = new EventSource('/3d-map/api/sse');

    eventSource.addEventListener('ttc-data', (event) => {
      if (simulationActive) return;

      const data = JSON.parse(event.data) as TrainData[];
      const filteredData = data.filter(d => d.arrivalStationCode === parsedCode);
      if (filteredData.length > 0) {
        setTtcData(filteredData);
      }
    });

    eventSource.addEventListener('event-data', (event) => {
      try {
        const data = JSON.parse(event.data) as EventData;
        setEventData([data]);
        let toastVariant: 'critical' | 'warning' | 'caution' = 'caution';
        if (data.level === 'CRITICAL') {
          toastVariant = 'critical';
        } else if (data.level === 'MAJOR') {
          toastVariant = 'warning';
        } else if (data.level === 'MINOR') {
          toastVariant = 'caution';
        }

        addToast({
          description: data.message,
          title: data.level,
          variant: toastVariant,
          duration: 5000,
        });      } catch (error) {
        console.error('이벤트 데이터 파싱 오류:', error);
      }
    });

    eventSource.addEventListener('shutter', (event) => {
      const data = JSON.parse(event.data) as ShutterData[];
      if (data.length > 0) {
        setShutterData(data);
      }
    });    eventSource.onerror = (err) => {
      console.error('SSE 에러:', err);
    };

    return () => {
      eventSource.close();
    };
  }, [parsedCode, setTtcData, setEventData, setShutterData, addToast, simulationActive]);

  if (error && !stationLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="bg-red-900/30 backdrop-blur-lg border border-red-500/30 rounded-xl px-8 py-6 flex items-center gap-4 shadow-lg">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <div className="text-red-200 text-xl font-semibold tracking-wide">
            스테이션 정보를 불러올 수 없습니다: {error.message}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-indigo-950">
      {!stationLoading && stationData && (
        <MapViewer
          modelPath={modelPath}
          floors={floorItems}
          onModelLoaded={handleModelLoadedWithEngine}
          onLoadError={handleLoadError}
        />
      )}
      {stationLoading && (
        <div className="absolute inset-0 bg-gray-900/95 flex items-center justify-center z-10 backdrop-blur-sm">
          <div className="bg-primary-900/30 backdrop-blur-md border border-primary-500/20 rounded-xl px-8 py-6 flex items-center gap-4 shadow-lg">
            <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full"></div>
            <div className="text-primary-100 text-xl font-medium tracking-wide">
              스테이션 {parsedCode} 정보 로딩 중...
            </div>
          </div>
        </div>
      )}
      <Header />
      <SideMenu />
      <ToastContainer />
      {stationData && <EventCounter stationId={stationData.externalCode} />}
      <DeviceDetailModal
        isOpen={isOpen}
        onClose={closeModal}
        title={title}
        stationId={stationId}
        deviceId={deviceId}
        deviceType={deviceType}
      />
    </div>
  );
};

export default ViewerPage;