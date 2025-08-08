import {Modal, Form, FormItem, Button, Input} from '@plug/ui';
import {useCallback, useState, useEffect} from 'react';
import {ChromePicker} from 'react-color';
import {useLineCreate, useLineDetailSWR, useLineUpdate} from '@plug/common-services';
import {useToastStore} from '@plug/v1/admin/components/hook/useToastStore';

export interface LineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode: 'create' | 'edit';
    selectedLineId?: number;
}

export const LineModal = ({isOpen, onClose, onSuccess, mode, selectedLineId}: LineModalProps) => {
    const {addToast} = useToastStore();
    const [name, setName] = useState<string>('');
    const [color, setColor] = useState<string>('');

    const {execute: createLine, isLoading: isCreating, error: createError} = useLineCreate();
    const {mutate, data: detailLineData} = useLineDetailSWR(mode === 'edit' && selectedLineId ? Number(selectedLineId) : 0);
    const {
        execute: updateLine,
        isLoading: isLineUpdating,
        error: lineUpdateError
    } = useLineUpdate(Number(selectedLineId));

    useEffect(() => {
        if (mode === 'edit' && detailLineData && isOpen) {
            setName(detailLineData.name);
            setColor(detailLineData.color);
        }
    }, [detailLineData, mode, isOpen]);

    const handleFinish = useCallback(async (values: Record<string, string>) => {
        if (mode === 'edit' && detailLineData) {
            
            const line = await updateLine({
                name: values.name || name,
                color: color
            });

            if (line) {
                await mutate();
                addToast({
                    variant: "normal",
                    title: "수정 완료",
                    description: "호선이 수정되었습니다."
                });
                resetForm();
                if (onSuccess) onSuccess();
            }

            if (lineUpdateError) {
                addToast({
                    variant: "critical",
                    title: "수정 실패",
                    description: lineUpdateError.message
                });
            }
        } else {

            const line = await createLine({
                name: values.name || name,
                color: color
            });

            if (line) {
                addToast({
                    variant: "normal",
                    title: "등록 완료",
                    description: "호선이 등록되었습니다."
                });
                if (onSuccess) onSuccess();
                resetForm();
            }
            if(createError) {
                addToast({
                    variant: "critical",
                    title: "등록 실패",
                    description: createError.message
                });
            }
            
            mutate();
        }
    }, [createLine, updateLine, name, color, mode, detailLineData, onSuccess, addToast]);

    const resetForm = () => {
        setName('');
        setColor('');
        onClose();
        mutate();
    };

    const isProcessing = isCreating || isLineUpdating;

    return (
        <Modal
            key={isOpen ? 'modal-open' : 'modal-closed'}
            title={mode === 'create' ? '호선 등록' : '호선 수정'}
            isOpen={isOpen}
            onClose={isProcessing ? undefined : resetForm}
            closeOnOverlayClick={false}
            overlayClassName="bg-black/50"
        >
            <Form
                key={mode + (detailLineData?.id ?? '')}
                initialValues={
                    mode === 'edit' && detailLineData
                        ? {
                            name: detailLineData.name,
                            color: detailLineData.color
                        }
                        : {
                            name: '',
                            color: ''
                        }
                }
                onSubmit={handleFinish}
            >
                <FormItem name="name" label="호선" required>
                    <Input.Text
                        placeholder="호선 이름을 입력하세요"
                        value={name}
                        onChange={value => setName(value)}
                    />
                </FormItem>

                <FormItem name="color" label="색상" required>
                    <ChromePicker
                        color={color || (mode === 'edit' && detailLineData ? detailLineData.color : '')}
                        onChangeComplete={(colorResult) => setColor(colorResult.hex)}
                    />
                </FormItem>

                <div className="mt-6 flex justify-center gap-2">
                    <Button type="button" onClick={resetForm} disabled={isProcessing}>
                        취소
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        disabled={!name && !color}
                        isLoading={isProcessing}
                    >
                        {mode === 'create' ? '등록' : '수정'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};