import {Modal, Form, FormItem, Button, Input, Select} from '@plug/ui';
import {useCallback, useState, useEffect} from 'react';
import {useCategoriesSWR, useCreateDevice, useUpdateDevice, useDeviceDetailSWR} from '@plug/common-services';
import {useToastStore} from '@plug/v1/admin/components/hook/useToastStore';

export interface DeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode: 'create' | 'edit';
    selectedDeviceId?: string;
}

export const DeviceModal = ({
    mode,
    isOpen,
    onClose,
    onSuccess,
    selectedDeviceId
}: DeviceModalProps) => {
    // 장비 상태 관리 
    const [name, setName] = useState<string>('');
    const [id, setId] = useState<string>('');
    const [categoryId, setCategoryId] = useState<number>();

    const { addToast } = useToastStore();

    // 디바이스 생성 훅 
    const { execute: createDevice, isLoading: isCreating, error: createError } = useCreateDevice();

    // 디바이스 생성 - 카테고리 목록 조회 
    const { data: categoryDevice } = useCategoriesSWR();

    // 디바이스 상세 조회 훅 
    const { data: detailDeviceData, mutate } = useDeviceDetailSWR(mode === 'edit' && selectedDeviceId ? selectedDeviceId : '');

    // 디바이스 수정 훅 
    const { execute: updateDevice, isLoading: isUpdating, error: updateError } = useUpdateDevice(selectedDeviceId || '');

    useEffect(() => {
        if (mode === 'edit' && detailDeviceData && isOpen) {
            setName(detailDeviceData.name);
            setCategoryId(detailDeviceData.categoryId);
        } 
    }, [mode, detailDeviceData, isOpen, categoryDevice]);

    // 제출 핸들러
    const handleFinish = useCallback(async (values: Record<string, string>) => {
        if (mode === 'edit' && detailDeviceData) {
            try {
                const device = await updateDevice({
                    name: values.name || name,
                    deviceCategoryId: categoryId
                });

                if (device) {
                    await mutate();
                    addToast({
                        title: '수정 성공',
                        description: '장비가 성공적으로 수정되었습니다.',
                        variant: 'normal'
                    });
                    if (onSuccess) onSuccess();
                    resetForm();
                }
                if (updateError) {
                    addToast({
                        title: '수정 실패',
                        variant: 'critical',
                        description: updateError.message
                    });
                }
            } finally {
                mutate();
            }
        } else {
            try {
                const device = await createDevice({
                    name: values.name,
                    id: values.id,
                    deviceCategoryId: categoryId
                });

                if (device) {
                    addToast({
                        title: '등록 완료',
                        description: '장비가 성공적으로 등록되었습니다.',
                        variant: 'normal'
                    });
                    if (onSuccess) onSuccess();
                    resetForm();
                }
                if (createError) {
                    addToast({
                        title: '등록 실패',
                        description: createError.message,
                        variant: 'critical'
                    });
                }
            } finally {
                mutate();
            }
        }
    }, [mode, detailDeviceData, createDevice, updateDevice, onSuccess, addToast, mutate, createError, updateError, categoryDevice, categoryId, name]);

    // 폼 초기화
    const resetForm = () => {
        setName('');
        setId('');
        onClose();
    };

    // 에러 처리
    const isProcessing = isCreating || isUpdating;

    return (
        <Modal
            title={mode === 'create' ? '장비 등록' : '장비 수정'}
            isOpen={isOpen}
            onClose={isProcessing ? undefined : resetForm}
            closeOnOverlayClick={false}
            overlayClassName="bg-black/50"
        >
            <Form
                key={mode + (detailDeviceData?.id ?? '')}
                initialValues={
                    mode === 'edit' && detailDeviceData
                        ? {
                            categoryId: String(detailDeviceData?.categoryId),
                            name: detailDeviceData?.name,
                        }
                        : {
                            categoryId: '',
                            name: '',
                            id: '',
                        }
                }
                onSubmit={handleFinish}
            >
                <div className='min-h-50'>
                    <FormItem name='categoryId' label='분류' required>
                        <div>
                            <Select 
                                selected={categoryId ? [String(categoryId)] : []}
                                onChange={(value) => {
                                    const selectedValues = value || [];
                                    setCategoryId(Number(selectedValues[0]));
                                }}
                            >
                                <Select.Trigger placeholder='분류를 선택하세요.' />
                                <Select.Content>
                                    {categoryDevice?.map(category => (
                                        <Select.Item
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.name}
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select>
                        </div>
                    </FormItem>

                    <FormItem name="name" label="장비 이름" required>
                        <Input.Text
                            placeholder="장비 이름을 입력하세요"
                            value={name}
                            onChange={value => setName(value)}
                        />
                    </FormItem>

                    {mode === 'create' ? 
                        <FormItem name="id" label="장비 ID" required>
                            <Input.Text
                                placeholder="장비 ID를 입력하세요"
                                value={id}
                                onChange={value => {setId(value);}}
                            />
                        </FormItem> : ''
                    }
                </div>

                <div className="mt-6 flex justify-center gap-2">
                    <Button type="button" onClick={resetForm}>
                        취소
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        isLoading={isProcessing}
                    >
                        {mode === 'create' ? '등록' : '수정'}
                    </Button>
                </div>
            </Form>
        </Modal>
    )
}