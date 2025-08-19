import { useCallback, useState, useEffect } from 'react';
import { Modal, Form, FormItem, Button, Select, ConfirmModal } from '@plug/ui';
import { useFeatureApi } from '../hooks';
import { useDevicesSWR } from '@plug/common-services';
import * as Px from '@plug/engine/src';
import type { PoiImportOption } from '@plug/engine/src/interfaces';
import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";

interface PoiEditModalProps {
  isOpen: boolean;
  poi: PoiImportOption | null;
  onClose: () => void;
  onSuccess?: (deviceId: string) => void;
}

export function PoiEditModal({ isOpen, poi, onClose, onSuccess }: PoiEditModalProps) {
  const { assignDevice } = useFeatureApi();
  const { data: devices } = useDevicesSWR();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(poi?.property?.code || '');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const addToast = useToastStore((state) => state.addToast);

  useEffect(() => {
    if (poi?.property?.deviceId) {
      setSelectedDeviceId(poi.property.deviceId);
    } else {
      setSelectedDeviceId('');
    }
  }, [poi]);

  const handleSubmit = useCallback(async () => {
    if (!poi) return;
    
    try {
      const deviceId = selectedDeviceId;
      if (!deviceId) {
        addToast({
          variant: 'critical',
          title: '장비 선택 필요',
          placement: 'center',
          description: '할당할 장비를 선택해주세요.'
        });
        return;
      }

      // 기존 장비 할당 체크 
      if (poi?.property?.deviceId) {
        setIsConfirmModalOpen(true);
        return;
      }

      // 기존 할당이 없는 경우: 일반 할당
      await assignDevice(poi.id, deviceId, false);

      // 선택된 장비 정보 찾기
      const selectedDevice = devices?.find(device => device.id === deviceId);
      const displayText = selectedDevice?.id || deviceId;
      
      // POI 속성 업데이트
      if (poi.property) {
        poi.property = { ...poi.property, deviceId: deviceId };
      } else {
        poi.property = { deviceId: deviceId };
      }

      Px.Poi.SetDisplayText(poi.id, displayText);
      onSuccess?.(deviceId);
      onClose();
      addToast({
        variant: 'normal',
        title: '장비 할당 완료',
        placement: 'center',
        description: `${displayText} 장비가 성공적으로 할당되었습니다.`
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '';
      if(errorMessage.includes('이미 다른 피처에 할당되어 있습니다')){
        setIsConfirmModalOpen(true);
        return;
      } else{
        addToast({
            variant: 'critical',
            title: '장비 할당 실패',
            placement: 'center',
            description: errorMessage || '장비 할당 중 오류가 발생했습니다.'
        });
      }
    }
  }, [poi, assignDevice, onSuccess, onClose, addToast, devices, selectedDeviceId]);

  // confirm 모달에서 교체 시
  const handleConfirm = useCallback(async () => {
    if (!poi) return;
    
    try {
      const deviceId = selectedDeviceId;

      // 기존 할당 교체 : 강제 할당
      await assignDevice(poi.id, deviceId, true);

      // 선택된 장비 정보 찾기
      const selectedDevice = devices?.find(device => device.id === deviceId);
      const displayText = selectedDevice?.id || deviceId;

      // POI 속성 업데이트
      if (poi.property) {
        poi.property = { ...poi.property, deviceId: deviceId };
      } else {
        poi.property = { deviceId: deviceId }; 
      }

      Px.Poi.SetDisplayText(poi.id, displayText);
      onSuccess?.(deviceId);
      onClose();
      addToast({
        variant: 'normal',
        title: '장비 교체 완료',
        placement: 'center',
        description: `${displayText} 장비가 성공적으로 교체되었습니다.`
      });
      
    } catch (error) {
      addToast({
        variant: 'critical',
        title: '장비 교체 실패',
        placement: 'center',
        description: error instanceof Error ? error.message : '장비 교체 중 오류가 발생했습니다.'
      });
    } finally {
      setIsConfirmModalOpen(false);
    }
  }, [poi, selectedDeviceId, assignDevice, onSuccess, onClose, addToast, devices]);

  if (!poi) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        showCloseButton={true}
        onClose={onClose}
        title={poi?.displayText || 'Feature'}
        contentClassName={'h-full max-h-100 overflow-y-hidden backdrop-blur-none'}
      >      
        <Form
          initialValues={{
            deviceId: poi?.property?.deviceId || ''
          }}
          onSubmit={handleSubmit}
          className={'flex flex-col justify-between h-full'}
        >        
          <FormItem name="deviceId" label="할당할 장비" required>
            <div>
              <Select 
                selected={selectedDeviceId ? [selectedDeviceId] : []} 
                onChange={(values: string[]) => {
                  const deviceId = values[0];
                  setSelectedDeviceId(deviceId || '');
                }}
              >
                <Select.Trigger 
                  placeholder={
                    (() => {
                      const currentDevice = devices?.find(device => device.id === selectedDeviceId);
                      return currentDevice 
                        ? `현재: ${currentDevice.name} (${currentDevice.id})` 
                        : selectedDeviceId ? `${selectedDeviceId}` : "장비를 선택하세요";
                    })()
                  } 
                />
                <Select.Content>
                  {devices?.map((device) => (
                    <Select.Item key={device.id} value={device.id}>
                      {device.name} ({device.id})
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
          </FormItem>
          <Button type="submit" color="primary">
            적용
          </Button>
        </Form>
      </Modal>

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirm}
        title="장비 교체 확인"
        message={`할당된 장비가 있습니다. "${selectedDeviceId}"로 교체하시겠습니까?`}
        confirmText="교체"
        cancelText="취소"
        isDangerous={true}
      />
    </>
  );
}
