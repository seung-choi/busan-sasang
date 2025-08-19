import { useState, useCallback, memo, Suspense, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ConfirmModal, Button } from "@plug/ui";
import { useStationStore } from './store/stationStore';
import type { Label3DImportOption, ModelInfo, PoiImportOption } from '@plug/engine/src/interfaces';
import { AssetList, MapViewer, FeatureEditToolbar } from "./components";
import { PoiEditModal, ErrorBoundary, TextLabelModal } from "./components";
import { useStation, useEditMode, useEngineIntegration, useFeatureApi } from "./hooks";
import type { UseEditModeResult } from "./hooks/useEditMode";
import type { StationWithFeatures } from "./types/station";
import { Poi, Label3D } from '@plug/engine/src';
import { v4 as uuidv4 } from 'uuid';
import { label3dService, useDevicesSWR } from '@plug/common-services';
import type { Label3DCreateRequest } from "@plug/common-services";
import * as Px from '@plug/engine/src';
import SearchList from '@plug/v1/admin/pages/Viewer/components/SearchList';
import { FloorSelector } from '@plug/v1/admin/pages/Viewer/components/FloorSelector';
import ZoomControls from '@plug/v1/admin/pages/Viewer/components/ZoomControls';


const LoadingSpinner = memo(() => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-pulse text-gray-500">역사 데이터 로딩 중...</div>
  </div>
));

const ErrorMessage = memo(({ message }: { message: string }) => (
  <div className="flex justify-center items-center h-screen">
    <div className="text-red-500">{message}</div>
  </div>
));


const ViewerHeader = memo(({ 
  hierarchies,
  selectedFloor,
  onFloorChange,
}: {
  hierarchies: ModelInfo[] | null;
  selectedFloor: string | null;
  onFloorChange: (floorId: string) => void;
}) => (
  <div className="flex absolute pl-4 pt-2 items-center z-10 space-x-4">
    <div className="flex items-center justify-center">
      {hierarchies && (
        <FloorSelector
          hierarchies={hierarchies}
          selectedFloor={selectedFloor}
          onFloorChange={onFloorChange}
        />
      )}
    </div>
  </div>
));

const ViewerContent = memo(({
  stationData,
  hierarchies,
  selectedFloor,
  onFloorChange,
  onModelLoaded,
  editMode,
  selectedPoi,
  isModalOpen,
  onModalClose,
  navigate,
  isTextLabelModalOpen,
  handleOpenTextLabelModal,
  handleCloseTextLabelModal,
  handleCreateTextLabel
}: {
  stationData: StationWithFeatures;
  hierarchies: ModelInfo[] | null;
  selectedFloor: string | null;
  onFloorChange: (floorId: string) => void;
  onModelLoaded: () => void;
  editMode: UseEditModeResult;
  selectedPoi: PoiImportOption | null;
  isModalOpen: boolean;
  onModalClose: () => void;
  onPoiSuccess: (deviceId: string) => void;
  navigate: (value: string) => void;
  isTextLabelModalOpen: boolean;
  handleOpenTextLabelModal: () => void;
  handleCloseTextLabelModal: () => void;
  handleCreateTextLabel: (text: string) => void;
}) => {
  const modelPath = stationData?.facility?.drawing?.url || '';
  const { data: devices } = useDevicesSWR();
  const [showSearchList, setShowSearchList] = useState(false);

  const toggleSearchList = () => {
    setShowSearchList(!showSearchList);
  };

  return (
    <>
      <aside className="bg-white w-1/4 shrink-0 flex flex-col h-screen">
        <div className="flex items-center justify-between p-3 border-b border-gray-200">
          <div
            className="flex items-center space-x-2 hover:bg-gray-100 rounded-lg transition-all duration-200 group relative"
            onClick={() => navigate('/admin/dashboard/facility')}
          >
            <Button
              variant="ghost"
              size="icon"
              className="flex items-center justify-center w-9 h-9 "
              aria-label="뒤로가기"
            >
              <div className="w-6 h-6 flex items-center justify-center text-primary-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-left-icon lucide-chevron-left"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </div>
            </Button>
            <h2 className="text-xl font-bold text-gray-800 pr-3">{stationData?.facility?.name}</h2>
            <span className="absolute top-full mt-2 px-3 py-2 z-30 bg-primary-100/80 backdrop-blur-md text-zinc-700 text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
              역사 선택으로 돌아가기
            </span>
          </div>
          <div
            className="flex items-center space-x-2 cursor-pointer bg-primary-100 hover:bg-primary-200 rounded-lg px-3 py-2 transition-all duration-300"
            onClick={toggleSearchList}
          >
            {!showSearchList ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="text-gray-700 text-sm">목록</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-list"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                <span className="text-gray-700 text-sm">에셋</span>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-auto bg-gray-100 mb-[60px]">
          {showSearchList ? (
            <SearchList
              deviceData={devices || []}
              featureData={stationData}
              onFloorChange={onFloorChange}
            />
          ) : (
            <AssetList />
          )}
        </div>
      </aside>
      <div className="w-full relative">
        <ViewerHeader
          hierarchies={hierarchies}
          selectedFloor={selectedFloor}
          onFloorChange={onFloorChange}
        />
        <Suspense fallback={<LoadingSpinner />}>
          <MapViewer modelPath={modelPath} onModelLoaded={onModelLoaded} />
        </Suspense>
        <FeatureEditToolbar
          onTranslateMode={editMode.setTranslateMode}
          onRotateMode={editMode.setRotateMode}
          onScaleMode={editMode.setScaleMode}
          onDeleteMode={editMode.setDeleteMode}
          onExitEdit={editMode.exitEdit}
          currentMode={editMode.currentMode}
        />
        <ZoomControls
          hierarchies={hierarchies || []}
          selectedFloor={selectedFloor}
          onFloorChange={onFloorChange}
        />
        <div className="absolute bottom-20 left-6 flex gap-4">
          <Button
            onClick={handleOpenTextLabelModal}
            className="w-10 h-10 bg-white hover:bg-gray-50 text-zinc-700 rounded-lg transition-all duration-300 flex items-center justify-center z-50 group p-2.5"
            title="텍스트 추가"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-type-icon lucide-type"
            >
              <path d="M12 4v16" />
              <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" />
              <path d="M9 20h6" />
            </svg>
            <span className="absolute left-full ml-3 px-3 py-2 bg-white/80 backdrop-blur-md text-zinc-700 text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
              3D 텍스트 추가
            </span>
          </Button>
        </div>
      </div>

      <PoiEditModal poi={selectedPoi} isOpen={isModalOpen} onClose={onModalClose} />

      <TextLabelModal
        isOpen={isTextLabelModalOpen}
        onClose={handleCloseTextLabelModal}
        onCreateLabel={handleCreateTextLabel}
      />
    </>
  );
});

const ViewerPage = memo(() => {
  const navigate = useNavigate();

  const { stationId: stationIdParam } = useParams<{ stationId: string }>();
  const { currentStationId, setStationId } = useStationStore();

  const stationId = useMemo(() => {
    if (stationIdParam) {
      const parsed = parseInt(stationIdParam, 10);
      return isNaN(parsed) ? null : parsed;
    }
    return currentStationId;
  }, [stationIdParam, currentStationId]);

  const editMode = useEditMode();

  const { data: stationData, isLoading, error } = useStation(stationId ? stationId.toString() : null);
  const { deleteFeature } = useFeatureApi();

  const [hierarchies, setHierarchies] = useState<ModelInfo[] | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<PoiImportOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTextLabelModalOpen, setIsTextLabelModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title?: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    if (stationId === null) {
      navigate('/');
      return;
    }

    if (stationId !== currentStationId) {
      setStationId(stationId.toString());
    }
  }, [stationId, currentStationId, setStationId, navigate]);

  const handlePoiSelect = useCallback((poi: PoiImportOption) => {
    setSelectedPoi(poi);
    setIsModalOpen(true);
  }, []);

  const handleLabel3DDelete = useCallback((label: Label3DImportOption) => {
    setConfirmModal({
      isOpen: true,
      title: '3D 텍스트 삭제 확인',
      message: `"${label.displayText}" 텍스트 라벨을 삭제하시겠습니까?`,
      onConfirm: async () => {
        try {
          Label3D.Delete(label.id);
          await label3dService.delete(label.id);
          console.log('라벨 삭제 완료:', label);
        } catch (error) {
          console.error('라벨 삭제 중 오류 발생:', error);
        }
      }
    });
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPoi(null);
  }, []);

  const handleHierarchyLoaded = useCallback((hierarchy: ModelInfo[]) => {
    setHierarchies(hierarchy);
    if (hierarchy && hierarchy.length > 0) {
      const sortedFloors = hierarchy.sort((a, b) => Number(b.floorId) - Number(a.floorId));
      const initialFloor = sortedFloors[0]?.floorId;
      if (initialFloor) {
        setSelectedFloor(initialFloor);
      }
    }
  }, []);

  const handleFloorChangeUI = useCallback((floorId: string) => {
    setSelectedFloor(floorId);
  }, []);

  const handlePoiSuccess = useCallback((deviceId: string) => {
    if (selectedPoi) {
      setSelectedPoi(prev => prev ? {
        ...prev,
        property: {
          ...prev.property,
          deviceId: deviceId
        }
      } : null);
    }
    handleModalClose();
  }, [selectedPoi, handleModalClose]);

  const handlePoiDelete = useCallback((poi: PoiImportOption) => {
    setConfirmModal({
      isOpen: true,
      title: 'POI 삭제 확인',
      message: `"${poi.displayText}" POI를 삭제하시겠습니까?`,
      onConfirm: async () => {
        try {
          Poi.Delete(poi.id);
          await deleteFeature(poi.id);
          console.log('POI 삭제 완료:', poi);
        } catch (error) {
          console.error('POI 삭제 중 오류 발생:', error);
        }
      }
    });
  }, [deleteFeature]);

  const handleConfirmModalClose = useCallback(() => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const handleOpenTextLabelModal = useCallback(() => {
    setIsTextLabelModalOpen(true);
  }, []);

  const handleCloseTextLabelModal = useCallback(() => {
    setIsTextLabelModalOpen(false);
  }, []);

  const handleCreateTextLabel = useCallback((text: string) => {
    const id = uuidv4();

    Label3D.Create({
      id: id,
      displayText: text
    }, async (data: Omit<Label3DCreateRequest, 'facilityId'>) => {
      const labelData: Label3DCreateRequest = {
        ...data,
        facilityId: stationData?.facility?.id || 0,
      };

      try {
        const savedLabel = await label3dService.post(labelData);
        console.log('라벨 서버 저장 완료:', savedLabel);
      } catch (error) {
        console.error('라벨 서버 저장 중 오류:', error);
      }
    });
  }, [stationData?.facility?.id]);

  useEffect(() => {
    if (editMode.currentMode === 'delete') {
      const label3DClickListener = (event: { target: Label3DImportOption }) => {
        if (event.target) handleLabel3DDelete(event.target);
      };
      Px.Event.AddEventListener("onLabel3DPointerUp", label3DClickListener);
      return () => {
        Px.Event.RemoveEventListener("onLabel3DPointerUp", label3DClickListener);
      };
    }
  }, [editMode.currentMode, handleLabel3DDelete]);

  const { handleModelLoaded, handleFloorChange } = useEngineIntegration({
    features: stationData?.features || [],
    onPoiSelect: handlePoiSelect,
    onHierarchyLoaded: handleHierarchyLoaded,
    onFloorChange: handleFloorChangeUI,
    onPoiDeleteClick: editMode.currentMode === 'delete' ? handlePoiDelete : undefined,
  });

  const handleCustomModelLoaded = useCallback(() => {
    handleModelLoaded();
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
        Label3D.Import(JSON.stringify(label3DsForImport));
        console.log('Label3Ds imported successfully:', label3DsForImport.length);
      } catch (error) {
        console.error('Failed to import Label3Ds:', error);
      }
    }
  }, [handleModelLoaded, stationData?.label3Ds]);

  const handleFloorSelect = useCallback((floorId: string) => {
    handleFloorChange(floorId);
  }, [handleFloorChange]);

  if (stationId === null) {
    return null;
  }

  if (error) {
    return <ErrorMessage message="역사 데이터를 불러오는데 실패했습니다." />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!stationData) {
    return <ErrorMessage message="Station ID를 찾을 수 없습니다." />;
  }

  return (
    <ErrorBoundary>
      <ViewerContent
        stationData={stationData}
        hierarchies={hierarchies}
        selectedFloor={selectedFloor}
        onFloorChange={handleFloorSelect}
        onModelLoaded={handleCustomModelLoaded}
        editMode={editMode}
        selectedPoi={selectedPoi}
        isModalOpen={isModalOpen}
        onModalClose={handleModalClose}
        isTextLabelModalOpen={isTextLabelModalOpen}
        handleOpenTextLabelModal={handleOpenTextLabelModal}
        handleCloseTextLabelModal={handleCloseTextLabelModal}
        handleCreateTextLabel={handleCreateTextLabel}
        onPoiSuccess={handlePoiSuccess}
        navigate={navigate}
      />
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleConfirmModalClose}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="삭제"
        cancelText="취소"
        isDangerous={true}
      />
    </ErrorBoundary>
  );
});

ViewerPage.displayName = 'ViewerPage';

export default ViewerPage;