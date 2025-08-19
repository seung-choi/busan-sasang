import {Button, DataTable, Skeleton, ConfirmModal} from '@plug/ui';
import {columns} from './constants/categoryColumns';
import {CategoryModal} from './components/CategoryModal';
import {useModal} from '../../components/hook/useModal';
import {useCategoriesSWR, deleteCategory} from '@plug/common-services';
import {useCategory} from './utils/useCategory';
import {StateInfoWrapper} from '../../components/boundary/StateInfoWrapper';
import {useState} from 'react';
import {Category} from './types/category.types';
import {useToastStore} from '../../components/hook/useToastStore';

export default function DeviceCategory() {
    const {isOpen, mode, openModal, closeModal} = useModal();
    const {data, error, isLoading, mutate} = useCategoriesSWR();
    const {addToast} = useToastStore();

    const [selectedCategories, setSelectedCategories] = useState<Set<Category>>(new Set());
    const [selectedCategoryId, setSelectedCategoryId] = useState<number>();
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

    const handleDelete = async (categoryId: number, shouldMutate = true) => {
        try {
            await deleteCategory(categoryId);
            if(shouldMutate) await mutate();
            addToast({
                title: '삭제 완료',
                description: '분류가 성공적으로 삭제되었습니다.',
                variant: 'normal'
            });
            if (error) {
              addToast({
                title: '삭제 실패',
                description: error.message,
                variant: 'critical'
              });
            }
        } finally {
          mutate();
        }
    };

    const handleDeleteClick = (categoryId: number) => {
      setConfirmModal({
          isOpen: true,
          title: '삭제 확인',
          message: '선택한 항목을 삭제하시겠습니까?',
          onConfirm: () => handleDelete(categoryId)
      });
  };

  const handleConfirmModalClose = () => {
      setConfirmModal(prev => ({ ...prev, isOpen: false }));
  };

    const handleEdit = (categoryId: number) => {
        setSelectedCategoryId(categoryId);
        openModal('edit');
    };

    const categoryData = useCategory(data || [], handleDeleteClick, handleEdit);

    const handleDeleteSelected = async () => {
        if (selectedCategories.size === 0) {
            addToast({
                description: '삭제할 항목을 선택해주세요.',
                variant: 'warning'
            });
            return;
        }

        setConfirmModal({
          isOpen: true,
          title: '삭제 확인',
          message: `${selectedCategories.size}개의 항목을 삭제하시겠습니까?`,
          onConfirm: async () => {
              try{
                await Promise.all(
                    Array.from(selectedCategories).map(category => handleDelete(category.id), false)
                )
                await mutate();
                addToast({
                    title: '삭제 완료',
                    description: `${selectedCategories.size}개의 분류가 삭제되었습니다.`,
                    variant: 'normal'
                });
                setSelectedCategories(new Set());
            } catch (error){
                addToast({
                    title: '삭제 실패',
                    description: error instanceof Error ? error.message : '분류 삭제 중 오류가 발생했습니다.',
                    variant: 'critical'
                });
            }
          }
      });  
    }

    return (
      <>
        <div className="mt-4 relative h-[90%]">
          <div className="ml-auto flex gap-1 w-48 absolute z-10 right-0">
            <Button
              color="primary"
              className="bg-primary-150 text-primary-700 font-semibold hover:bg-primary-200"
              onClick={() => openModal('create')}
            >
              등록
            </Button>
            <Button
              color="destructive"
              className="bg-destructive-150 text-destructive-700 font-semibold hover:bg-destructive-200"
              onClick={handleDeleteSelected}
            >
              삭제
            </Button>
          </div>
          {error && <StateInfoWrapper preset="defaultError" />}
          {isLoading && <Skeleton className="w-full h-100" />}
          {!isLoading && !error && categoryData && (
            <DataTable
              data={categoryData || []}
              columns={columns}
              pageSize={8}
              selectable={true}
              selectedRows={selectedCategories}
              onSelectChange={setSelectedCategories}
              showSearch={true}
              filterFunction={(item, search) => {
                const lowerSearch = search.toLowerCase();
                return item.name.toLowerCase().includes(lowerSearch);
              }}
            />
          )}
        </div>
        <CategoryModal
          isOpen={isOpen}
          onClose={closeModal}
          mode={mode}
          onSuccess={mutate}
          selectedCategoryId={selectedCategoryId}
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