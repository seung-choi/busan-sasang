import {Button, DataTable, Skeleton, ConfirmModal} from '@plug/ui';
import {columns} from './constants/deviceColumns';
import {DeviceModal} from './components/DeviceModal';
import {useModal} from '../../components/hook/useModal';
import {useDevicesSWR, deleteDevice} from '@plug/common-services';
import {useDevice} from './utils/useDevice';
import {StateInfoWrapper} from '../../components/boundary/StateInfoWrapper';
import { useEffect, useState } from 'react';
import {Device} from './types/device.types';
import {useToastStore} from '../../components/hook/useToastStore';
import { useSearchParams } from 'react-router-dom';

export default function DevicePage() {
  const {isOpen, mode, openModal, closeModal} = useModal();
  const {data, error, isLoading, mutate} = useDevicesSWR();
  const {addToast} = useToastStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [ selectedDevices, setSelectedDevices ] = useState<Set<Device>>(new Set());
  const [ selectedDeviceId, setSelectedDeviceId ] = useState<string>();
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

  const handleDelete = async (deviceId: string, shouldMutate = true) => {
    try {
      await deleteDevice(deviceId);
      if(shouldMutate) await mutate();
      addToast({
        variant: "normal",
        title: "삭제 완료",
        description: "선택한 항목이 삭제되었습니다."
      });
    } catch (err){
      addToast({
        variant: "critical",
        title: "삭제 실패",
        description: err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다."
      });
    }
  }

  const handleEdit = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    openModal('edit');
  }

  const handleDeleteClick = (deviceId: string) => {
    setConfirmModal({
      isOpen: true,
      title: '삭제 확인',
      message: '선택한 항목을 삭제하시겠습니까?',
      onConfirm: () => handleDelete(deviceId)
    });
  };

  const handleConfirmModalClose = () => {
    setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

  const deviceData = useDevice(data || [], handleDeleteClick, handleEdit);

  const handleDeleteSelected = async () => {
    if (selectedDevices.size === 0) {
      return addToast({
        description: '삭제할 항목을 선택해주세요.',
        title: '선택 필요',
        variant: 'warning'
      });
    }

    setConfirmModal({
      isOpen: true,
      title: '삭제 확인',
      message: `${selectedDevices.size}개의 항목을 삭제하시겠습니까?`,
      onConfirm: async () => {
        try {
          await Promise.all(
            Array.from(selectedDevices).map(device => handleDelete(device.id, false))
          );

          await mutate();
          addToast({
            title: '삭제 완료',
            description: `${selectedDevices.size}개의 항목이 삭제되었습니다.`,
            variant: 'normal'
          });
          setSelectedDevices(new Set());
        } catch (error) {
          addToast({
            title: '삭제 실패',
            description: error instanceof Error ? error.message : '일부 항목 삭제 중 오류가 발생했습니다.',
            variant: 'critical'
          });
        }
      }
    });
  }

  useEffect(() => {
    if (data && !dataLoaded) {
      setDataLoaded(true);

      const shouldEdit = searchParams.get('edit') === 'true';
      const deviceId = searchParams.get('deviceId');

      if (shouldEdit && deviceId) {
        const device = data.find(item => item.id === deviceId);

        if (device) {
          setSelectedDeviceId(deviceId);
          setTimeout(() => {
            openModal('edit');
          }, 0);
        } else {
          addToast({
            variant: 'warning',
            title: '알림',
            description: `"${deviceId}" 디바이스를 찾을 수 없습니다.`
          });
        }
        setSearchParams({});
      }
    }
  }, [data, searchParams, openModal, addToast, setSearchParams, dataLoaded]);

  const handleModalClose = () => {
    closeModal();
    setSelectedDeviceId(undefined);
  };

  return (
    <>
      <div className='mt-4 relative h-[90%]'>
        <div className='ml-auto flex gap-1 w-48 absolute z-10 right-0'>
          <Button color='primary'
                  className='bg-primary-150 text-primary-700 font-semibold hover:bg-primary-200'
                  onClick={() => (openModal('create'))}>등록</Button>
          <Button color='destructive'
                  className='bg-destructive-150 text-destructive-700 font-semibold hover:bg-destructive-200'
                  onClick={handleDeleteSelected}>삭제</Button>
        </div>
        {error && <StateInfoWrapper preset="defaultError"/>}
        {isLoading && <Skeleton className="w-full h-100"/>}
        {!isLoading && !error && deviceData &&
          <DataTable
            data={deviceData || []}
            columns={columns}
            pageSize={8}
            selectable={true}
            showSearch={true}
            selectedRows={selectedDevices}
            onSelectChange={setSelectedDevices}
            filterFunction={(item, search) => {
              const lowerSearch = search.toLowerCase();
              return (
                item.name.toLowerCase().includes(lowerSearch) ||
                item.id.toLowerCase().includes(lowerSearch) ||
                item.creator.toLowerCase().includes(lowerSearch)
              );
            }}
          />
        }
      </div>
      <DeviceModal
        isOpen={isOpen}
        onClose={handleModalClose}
        mode={mode}
        onSuccess={mutate}
        selectedDeviceId={selectedDeviceId}
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
    </>
  )
}