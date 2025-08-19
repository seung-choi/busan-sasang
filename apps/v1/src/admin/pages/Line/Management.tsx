import {Button, DataTable, Skeleton, ConfirmModal} from '@plug/ui';
import {columns} from './constants/lineColumns';
import {LineModal} from './components/LineModal';
import {useModal} from '../../components/hook/useModal';
import {useLinesSWR, deleteLine} from '@plug/common-services';
import {useLine} from './utils/useLine';
import {StateInfoWrapper} from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import {useState} from 'react';
import {Line} from './types/line.types';
import {useToastStore} from "../../components/hook/useToastStore";

export default function LinePage() {
    const {isOpen, mode, openModal, closeModal} = useModal();
    const {data, error, isLoading, mutate} = useLinesSWR();
    const {addToast} = useToastStore();

    const [selectedLines, setSelectedLines] = useState<Set<Line>>(new Set());
    const [selectedLineId, setSelectedLineId] = useState<number>();
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

    const handleDelete = async (lineId: number, shouldMutate = true) => {
        try {
            await deleteLine(lineId);
            if(shouldMutate) await mutate();
            addToast({
                variant: "normal",
                title: "삭제 완료",
                description: "선택한 항목이 삭제되었습니다."
            });
            if(error) {
              addToast({
                variant: "critical",
                title: "삭제 실패",
                description: error.message,
              })
            }
        } finally {
          mutate();
        }
    };

    const handleDeleteClick = (lineId: number) => {
        setConfirmModal({
            isOpen: true,
            title: '삭제 확인',
            message: '선택한 항목을 삭제하시겠습니까?',
            onConfirm: () => handleDelete(lineId)
        });
    };

    const handleConfirmModalClose = () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleEdit = async (lineId: number) => {
      setSelectedLineId(lineId);
        openModal('edit');
    };

    const lineData = useLine(data || [], handleDeleteClick, handleEdit);

    const handleDeleteSelected = async () => {
        if (selectedLines.size === 0) {
            return addToast({
                variant: "warning",
                title: '선택 필요',
                description: "삭제할 항목을 선택해주세요."
            });
        }

        setConfirmModal({
            isOpen: true,
            title: '삭제 확인',
            message: `${selectedLines.size}개의 항목을 삭제하시겠습니까?`,
            onConfirm: async () => {
                try {
                    await Promise.all(
                        Array.from(selectedLines).map(line => handleDelete(line.id), false)
                    );
                  mutate();
                    addToast({
                        variant: "normal",
                        title: '삭제 완료',
                        description: `${selectedLines.size}개의 항목이 삭제되었습니다.`
                    });
                    setSelectedLines(new Set());
                    if(error) {
                      addToast({
                        variant: "critical",
                        title: "삭제 실패",
                        description: error.message,
                      })
                    }
                } finally {
                  mutate();
                }
            }
        });
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
                {!isLoading && !error && lineData && (
                    <DataTable
                        data={lineData || []}
                        columns={columns}
                        pageSize={8}
                        selectable={true}
                        selectedRows={selectedLines}
                        onSelectChange={setSelectedLines}
                        showSearch
                        filterFunction={(item, search) => {
                            const lowerSearch = search.toLowerCase();
                            return (
                                item.name.toLowerCase().includes(lowerSearch)
                            );
                        }}
                    />
                )}
            </div>
            <LineModal
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
                onSuccess={mutate}
                selectedLineId={selectedLineId}
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
    );
}