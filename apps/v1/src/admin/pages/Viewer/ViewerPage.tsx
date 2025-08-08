import { useState, useCallback, memo, Suspense, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Select, ConfirmModal } from "@plug/ui";
import { useStationStore } from './store/stationStore';
import type { ModelInfo, PoiImportOption } from "@plug/engine/src/interfaces";

import { AssetList, MapViewer, FeatureEditToolbar } from "./components";
import { PoiEditModal, ErrorBoundary, TextLabelModal } from "./components";
import { useStation, useEditMode, useEngineIntegration, useFeatureApi } from "./hooks";
import type { UseEditModeResult } from "./hooks/useEditMode";
import type { StationWithFeatures } from "./types/station";

import { Poi, Label3D } from '@plug/engine/src';
import { v4 as uuidv4 } from 'uuid';
import { label3dService } from "@plug/common-services";
import type { Label3DCreateRequest } from "@plug/common-services";

// Loading and Error components with better UX
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

// Floor selector component
const FloorSelector = memo(({ 
  hierarchies, 
  selectedFloor, 
  onFloorChange 
}: {
  hierarchies: ModelInfo[];
  selectedFloor: string | null;
  onFloorChange: (floorId: string) => void;
}) => {
  const handleFloorSelect = (values: string[]) => {
    const floorId = values[0];
    if (floorId) {
      onFloorChange(floorId);
    }
  };

  return (
    <Select 
      className="text-sm text-gray-300 ml-2 w-64" 
      selected={selectedFloor ? [selectedFloor] : []}
      onChange={handleFloorSelect}
    >
      <Select.Trigger />
      <Select.Content>
        {hierarchies
          .sort((a, b) => Number(b.floorId) - Number(a.floorId))
          .map(floor => (
            <Select.Item key={floor.floorId} value={floor.floorId}>
              {floor.displayName}
            </Select.Item>
          ))
        }
      </Select.Content>
    </Select>
  );
});

// Main header component
const ViewerHeader = memo(({ 
  stationName, 
  hierarchies, 
  selectedFloor, 
  onFloorChange
}: {
  stationName: string;
  hierarchies: ModelInfo[] | null;
  selectedFloor: string | null;
  onFloorChange: (floorId: string) => void;
}) => (
  <div className="flex absolute text-white pl-4 pt-2 items-center z-10 space-x-4">
    <h2 className="text-xl font-bold">{stationName}</h2>
    {hierarchies && (
      <FloorSelector 
        hierarchies={hierarchies}
        selectedFloor={selectedFloor}
        onFloorChange={onFloorChange}
      />
    )}
  </div>
));

// Main viewer content component
const ViewerContent = memo(({
  stationData,
  hierarchies,
  selectedFloor,
  onFloorChange,
  onModelLoaded,
  editMode,
  selectedPoi,
  isModalOpen,
  onModalClose
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
}) => {
  const modelPath = stationData?.facility?.drawing?.url || '';

  return (
    <>
      <aside className="bg-white w-1/4 overflow-y-auto shrink-0">
        <AssetList />
      </aside>
      <main className="w-full">
        <ViewerHeader
          stationName={stationData?.facility?.name || ''}
          hierarchies={hierarchies}
          selectedFloor={selectedFloor}
          onFloorChange={onFloorChange}
        />        <Suspense fallback={<LoadingSpinner />}>
          <MapViewer 
            modelPath={modelPath}
            onModelLoaded={onModelLoaded}
          />
        </Suspense>
        <FeatureEditToolbar
          onTranslateMode={editMode.setTranslateMode}
          onRotateMode={editMode.setRotateMode}
          onScaleMode={editMode.setScaleMode}
          onDeleteMode={editMode.setDeleteMode}
          onExitEdit={editMode.exitEdit}
          currentMode={editMode.currentMode}
        />
      </main>
      
      {/* POI Edit Modal */}
      <PoiEditModal
        poi={selectedPoi}
        isOpen={isModalOpen}
        onClose={onModalClose}
      />
    </>
  );
});

const ViewerPage = memo(() => {
  const { stationId: stationIdParam } = useParams<{ stationId: string }>();
  const navigate = useNavigate();
  const { currentStationId, setStationId } = useStationStore();
  
  // stationId를 number로 처리
  const stationId = useMemo(() => {
    if (stationIdParam) {
      const parsed = parseInt(stationIdParam, 10);
      return isNaN(parsed) ? null : parsed;
    }
    return currentStationId;
  }, [stationIdParam, currentStationId]);

  // Custom hooks for state management (항상 호출)
  const { data: stationData, isLoading, error } = useStation(stationId ? stationId.toString() : null);
  const editMode = useEditMode();
  const { deleteFeature } = useFeatureApi();
  
  // Local state (항상 호출)
  const [hierarchies, setHierarchies] = useState<ModelInfo[] | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<PoiImportOption | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 3D 텍스트 라벨 모달 상태
  const [isTextLabelModalOpen, setIsTextLabelModalOpen] = useState(false);
  
  // ConfirmModal 상태
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

  // stationId가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (stationId === null) {
      navigate('/');
      return;
    }
    
    // Ensure station ID is set in store
    if (stationId !== currentStationId) {
      setStationId(stationId.toString());
    }
  }, [stationId, currentStationId, setStationId, navigate]);

  // Event handlers
  const handlePoiSelect = useCallback((poi: PoiImportOption) => {
    setSelectedPoi(poi);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPoi(null);
  }, []);

  const handleHierarchyLoaded = useCallback((hierarchy: ModelInfo[]) => {
    setHierarchies(hierarchy);
    // Set initial floor to the highest floor (or first floor if needed)
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

  // ConfirmModal 닫기 핸들러
  const handleConfirmModalClose = useCallback(() => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  // 3D 텍스트 라벨 관련 핸들러
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

  // Engine integration with cleanup
  const { handleModelLoaded, handleFloorChange } = useEngineIntegration({
    features: stationData?.features || [],
    onPoiSelect: handlePoiSelect,
    onHierarchyLoaded: handleHierarchyLoaded,
    onFloorChange: handleFloorChangeUI,
    onPoiDeleteClick: editMode.currentMode === 'delete' ? handlePoiDelete : undefined
  });
  // Custom model loaded handler to import Label3Ds after model loading
  const handleCustomModelLoaded = useCallback(() => {
    // First call the original handler from useEngineIntegration
    handleModelLoaded();
    
    // Then import Label3Ds if available
    if (stationData?.label3Ds && stationData.label3Ds.length > 0) {
      try {
        // Convert Label3Ds to the format expected by Label3D.Import
        const label3DsForImport = stationData.label3Ds.map(label => ({
          id: label.id,
          displayText: label.displayText,
          floorId: label.floorId,
          position: label.position,
          rotation: label.rotation,
          scale: label.scale
        }));
        
        // Import the Label3Ds
        Label3D.Import(JSON.stringify(label3DsForImport));
        console.log('Label3Ds imported successfully:', label3DsForImport.length);
      } catch (error) {
        console.error('Failed to import Label3Ds:', error);
      }
    }
  }, [handleModelLoaded, stationData?.label3Ds]);

  // Combined floor change handler for UI interactions
  const handleFloorSelect = useCallback((floorId: string) => {
    // Call the engine integration's floor change handler
    handleFloorChange(floorId);
  }, [handleFloorChange]);

  // stationId가 없으면 렌더링하지 않음
  if (stationId === null) {
    return null;
  }

  // Error boundary states
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
      />
      
      {/* 플로팅 버튼 - 3D 텍스트 추가 */}
      <button
        onClick={handleOpenTextLabelModal}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
        title="3D 텍스트 추가"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.5,4L19.66,8.35L18.7,8.61C18.25,7.74 17.79,7.16 17.26,6.73C16.73,6.3 16.05,6.08 15.27,6.08H13.05V18.4C13.05,19.08 13.27,19.55 13.72,19.82C14.17,20.08 14.65,20.22 15.14,20.22V21H8.96V20.22C9.42,20.22 9.88,20.08 10.33,19.82C10.78,19.55 11,19.08 11,18.4V6.08H8.75C8,6.08 7.31,6.3 6.78,6.73C6.25,7.16 5.79,7.74 5.34,8.61L4.38,8.35L5.54,4H18.5Z"/>
        </svg>
        <span className="absolute right-full mr-3 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          3D 텍스트 추가
        </span>
      </button>
      
      {/* 3D 텍스트 라벨 생성 모달 */}
      <TextLabelModal
        isOpen={isTextLabelModalOpen}
        onClose={handleCloseTextLabelModal}
        onCreateLabel={handleCreateTextLabel}
      />
      
      {/* Confirm Modal for POI deletion */}
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
