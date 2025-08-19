import {Button, DataTable, Skeleton, ConfirmModal} from '@plug/ui';
import {columns} from './constants/assetColumns';
import {AssetRegistModal} from './components/AssetModal';
import {useModal} from '../../components/hook/useModal';
import {useAssetsSWR, deleteAsset} from '@plug/common-services';
import {useAsset} from './utils/useAsset';
import {StateInfoWrapper} from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import {useState} from 'react';
import {Asset} from './types/asset.types';
import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";

export default function AssetPage() {
    const {isOpen, mode, openModal, closeModal} = useModal();
    const {data, error, isLoading, mutate} = useAssetsSWR();

    const [selectedAssets, setSelectedAssets] = useState<Set<Asset>>(new Set());
    const [selectedAssetId, setSelectedAssetId] = useState<number>();
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

    const addToast = useToastStore((state) => state.addToast);

    const handleDelete = async (assetId: number, shouldMutate = true) => {
        try {
            await deleteAsset(assetId);
            if (shouldMutate) await mutate();
            addToast({
                variant: 'normal',
                title: '삭제 완료',
                description: '선택한 항목이 삭제되었습니다.'
            });
            if(error) {
              addToast({
                variant: 'critical',
                title: '삭제 실패',
                description: error.message,
              })
            }
        } finally {
          mutate();
        }
    };

    const handleDeleteClick = (assetId: number) => {
        setConfirmModal({
            isOpen: true,
            title: '삭제 확인',
            message: '선택한 항목을 삭제하시겠습니까?',
            onConfirm: () => handleDelete(assetId)
        });
    };

    const handleConfirmModalClose = () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleEdit = (assetId: number) => {
        setSelectedAssetId(assetId);
        openModal('edit');
    };

    const AssetData = useAsset(data || [], handleDeleteClick, handleEdit);

    const handleDeleteSelected = async () => {
        if (selectedAssets.size === 0) {
            addToast({
                variant: 'warning',
                title: '선택 필요',
                description: '삭제할 항목을 선택해주세요.'
            });
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: '삭제 확인',
            message: `${selectedAssets.size}개의 항목을 삭제하시겠습니까?`,
            onConfirm: async () => {
                try {
                    await Promise.all(
                        Array.from(selectedAssets).map(asset => handleDelete(Number(asset.id)), false)
                    );
                    await mutate();
                    addToast({
                        variant: 'normal',
                        title: '삭제 완료',
                        description: `${selectedAssets.size}개의 항목이 삭제되었습니다.`
                    });
                    setSelectedAssets(new Set());
        
                    if(error) {
                      addToast({
                        variant: 'critical',
                        title: '삭제 실패',
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
            <div className='mt-4 relative'>
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
                {!isLoading && !error && AssetData && (
                    <DataTable
                        data={AssetData || []}
                        columns={columns}
                        pageSize={7}
                        selectable={true}
                        selectedRows={selectedAssets}
                        onSelectChange={setSelectedAssets}
                        showSearch={true}
                        filterFunction={(item, search) => {
                            const lowerSearch = search.toLowerCase();
                            return (
                                item.name.toLowerCase().includes(lowerSearch)
                            );
                        }}
                    />
                )}
            </div>
            <AssetRegistModal
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
                onSuccess={mutate}
                selectedAssetId={selectedAssetId}
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