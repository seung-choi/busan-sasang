import { useCallback, useState, useEffect } from 'react';
import { Modal, Form, FormItem, Button, Select } from '@plug/ui';
import { useFeatureApi } from '../hooks';
import { useDevicesSWR } from '@plug/common-services';
import * as Px from '@plug/engine/src';
import type { PoiImportOption } from '@plug/engine/src/interfaces';
import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";

interface PoiEditModalProps {
  isOpen: boolean;
  poi: PoiImportOption | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PoiEditModal({ isOpen, poi, onClose, onSuccess }: PoiEditModalProps) {
  const { assignDevice } = useFeatureApi();
  const { data: devices } = useDevicesSWR();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(poi?.property?.code || '');

  const addToast = useToastStore((state) => state.addToast);

  // poi가 변경될 때마다 selectedDeviceId 업데이트
  useEffect(() => {
    setSelectedDeviceId(poi?.property?.code || '');
  }, [poi]);  const handleSubmit = useCallback(async () => {
    if (!poi) return;
    
    try {
      // selectedDeviceId 상태값 사용
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
      
      await assignDevice(poi.id, deviceId);
      
      // 선택된 장비 정보 찾기
      const selectedDevice = devices?.find(device => device.id === deviceId);
      const displayText = selectedDevice?.id || deviceId;
      
      Px.Poi.SetDisplayText(poi.id, displayText);
      onSuccess?.();
      onClose();
        addToast({
        variant: 'normal',
        title: '장비 할당 완료',
        placement: 'center',
        description: `${displayText} 장비가 성공적으로 할당되었습니다.`
      });
    } catch (error) {
      addToast({
          variant: 'critical',
          title: '장비 할당 실패',
          placement: 'center',
          description: error instanceof Error ? error.message : '장비 할당 중 오류가 발생했습니다.'
      });
    }
  }, [poi, assignDevice, onSuccess, onClose, addToast, devices, selectedDeviceId]);

  if (!poi) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={poi.displayText || 'Feature'}
      contentClassName={'h-full max-h-100 overflow-y-hidden'}
    >      
    <Form
        initialValues={{
          deviceId: poi.property?.code || ''
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
              <Select.Trigger />
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
  );
}
