import {Button, DataTable, Skeleton, ConfirmModal} from '@plug/ui';
import {columns} from './constants/userColumns';
import {UserModal} from './components/UserModal';
import {UserPasswordModal} from './components/UserPasswordModal';
import {UserRoleModal} from './components/UserRoleModal';
import {useModal} from '../../components/hook/useModal';
import {useUsersSWR, deleteUser, useUserLoggedIn} from "@plug/common-services";
import {useUser} from './utils/useUser';
import {StateInfoWrapper} from "@plug/v1/admin/components/boundary/StateInfoWrapper";
import React, {useState, useEffect, useCallback} from 'react';
import {User} from './types/user.types';
import {useToastStore} from '../../components/hook/useToastStore';

export default function UserListPage(): React.ReactElement {
    const {isOpen, mode, openModal, closeModal} = useModal();
    const {isOpen: isPasswordModalOpen, openModal: openPasswordModal, closeModal: closePasswordModal} = useModal();
    const {isOpen: isRoleModalOpen, openModal: openRoleModal, closeModal: closeRoleModal} = useModal();
    const {data, error, isLoading, mutate} = useUsersSWR();
    const [selectState, setSelectState] = useState<Set<User>>(new Set());
    const [selectedUserId, setSelectedUserId] = useState<number>();
    const [statusData, setStatusData] = useState<Record<number, boolean>>({});
    const {execute: loggedInUser, error: userLoggedInError} = useUserLoggedIn();
    const {addToast} = useToastStore();
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

    // 사용자 정보 수정 모달 
    const handleDelete = async (userId: number) => {
        try {
            await deleteUser(userId);
            await mutate();
            addToast({
                title: '삭제 완료',
                description: '사용자가 성공적으로 삭제되었습니다.',
                variant: 'normal'
            });
        } catch (error) {
            addToast({
                title: '삭제 실패',
                description: error instanceof Error ? error.message : '사용자 삭제 중 오류가 발생했습니다.',
                variant: 'critical'
            });
        }
    };

    const handleDeleteClick = (userId: number) => {
        setConfirmModal({
            isOpen: true,
            title: '삭제 확인',
            message: '선택한 항목을 삭제하시겠습니까?',
            onConfirm: () => handleDelete(userId)
        });
    };

    const handleConfirmModalClose = () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
    };

    const handleEdit = useCallback((userId: number) => {
        setSelectedUserId(userId);
        openModal('edit');
    }, [openModal]);

    // 비밀 번호 수정 모달 
    const handlePasswordEdit = useCallback((userId: number) => {
        setSelectedUserId(userId);
        openPasswordModal('edit');
    }, [openPasswordModal]);

    const handleClosePasswordModal = useCallback(() => {
        closePasswordModal();
        setSelectedUserId(undefined);
    }, [closePasswordModal]);

    // 권한 설정/수정 모달
    const handleRoleEdit = useCallback((userId: number) => {
        setSelectedUserId(userId);
        openRoleModal('edit');
    }, [openRoleModal]);

    const handleCloseRoleModal = useCallback(() => {
        closeRoleModal();
        setSelectedUserId(undefined);
    }, [closeRoleModal]);

    // 로그인 된 사용자 정보 조회 
    useEffect(() => {
        const fetchLoggedInUsers = async () => {
            try {
                const users = await loggedInUser();
                if (Array.isArray(users)) {
                    const statusMap: Record<number, boolean> = {};
                    users.forEach(user => {
                        if (user.isLoggedIn) statusMap[user.id] = true;
                    });
                    setStatusData(statusMap);
                }
                if (userLoggedInError) {
                  addToast({
                    description: userLoggedInError.message,
                    variant: 'critical',
                    title: '로그인 사용자 정보 조회 실패'
                  });
                }
            } finally {
              mutate();
            }
        };
        fetchLoggedInUsers();
      }, []);
      
    
    const userData = useUser(data || [], statusData, handleDeleteClick, handleEdit, handlePasswordEdit, handleRoleEdit);

    const handleDeleteSelected = async () => {
        if (selectState.size === 0) {
            addToast({
                description: '삭제할 항목을 선택해주세요.',
                variant: 'warning',
                title: '선택 필요'
            });
            return;
        }

        setConfirmModal({
            isOpen: true,
            title: '삭제 확인',
            message: `${selectState.size}개의 항목을 삭제하시겠습니까?`,
            onConfirm: async () => {
                try {
                    await Promise.all(
                        Array.from(selectState).map(user => handleDelete(Number(user.id)))
                    );
                    await mutate();
        
                    addToast({
                        description: `${selectState.size}개의 항목이 삭제되었습니다.`,
                        title: '삭제 완료',
                        variant: 'normal'
                    });
                    setSelectState(new Set());
        
                } catch (error) {
                    addToast({
                        title: '삭제 실패',
                        description: error instanceof Error ? error.message : '항목 삭제 중 오류가 발생했습니다.',
                        variant: 'critical'
                    });
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
                            onClick={() => openModal('create')}>등록</Button>
                    <Button color='destructive'
                            className='bg-destructive-150 text-destructive-700 font-semibold hover:bg-destructive-200'
                            onClick={handleDeleteSelected}>삭제</Button>
                </div>
                {error && <StateInfoWrapper preset="defaultError"/>}
                {isLoading && <Skeleton className="w-full h-100"/>}
                {!isLoading && !error && userData && (
                    <DataTable
                        data={userData || []}
                        columns={columns}
                        pageSize={8}
                        selectable={true}
                        selectedRows={selectState}
                        onSelectChange={setSelectState}
                        showSearch={true}
                        filterFunction={(item, search) => {
                            const lowerSearch = search.toLowerCase();
                            return (
                                String(item.id).toLowerCase().includes(lowerSearch) ||
                                item.username.toLowerCase().includes(lowerSearch)
                            );
                        }}
                    />
                )}
            </div>
            <UserModal
                isOpen={isOpen}
                onClose={closeModal}
                mode={mode}
                onSuccess={mutate}
                selectedUserId={selectedUserId}
            />
            <UserPasswordModal
                isOpen={isPasswordModalOpen}
                onClose={handleClosePasswordModal}
                onSuccess={mutate}
                selectedUserId={selectedUserId}
            />
            <UserRoleModal
                isOpen={isRoleModalOpen}
                onClose={handleCloseRoleModal}
                onSuccess={mutate}
                selectedUserId={selectedUserId}
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