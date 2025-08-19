import {Modal, Form, FormItem, Button, Input} from '@plug/ui';
import {useCallback, useState, useEffect} from 'react';
import {
    useFileUpload,
    createFileFormData,
    useCreateCategory,
    useCategoryDetailSWR,
    useUpdateCategory
} from '@plug/common-services';
import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";

export interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode: 'create' | 'edit';
    selectedCategoryId?: number;
}

export const CategoryModal = ({isOpen, onClose, onSuccess, mode, selectedCategoryId}: CategoryModalProps) => {
    const {addToast} = useToastStore();
    const [name, setName] = useState<string>('');
    const [contextPath, setContextPath] = useState<string>('');
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadIconFileId, setUploadIconFileId] = useState<number | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const {execute: uploadFile, isLoading: isFileUploading, error: fileError} = useFileUpload();
    const {execute: createCategory, isLoading: isCreating, error: createError} = useCreateCategory();
    const {data: detailCategoryData, mutate} = useCategoryDetailSWR(mode === 'edit' && selectedCategoryId ? Number(selectedCategoryId) : 0);
    const {
        execute: updateCategory,
        isLoading: isCategoryUpdating,
        error: categoryUpdateError
    } = useUpdateCategory(Number(selectedCategoryId));

  useEffect(() => {
    if (mode === 'edit' && detailCategoryData && isOpen) {
      console.log('detailCategoryData:', detailCategoryData);
      console.log('iconFile URL:', detailCategoryData?.iconFile?.url);
      setName(detailCategoryData.name);
      setContextPath(detailCategoryData.contextPath);
    }
  }, [mode, detailCategoryData, isOpen]);

    const handleIconFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.includes('image/')) {
            addToast({
                title: '파일 형식 오류',
                description: 'image 파일만 업로드 가능합니다.',
                variant: 'warning'
            });
            return;
        }

        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        const newPreviewUrl = URL.createObjectURL(file);

        setIconFile(file);
        setPreviewUrl(newPreviewUrl);
        setIsUploading(true);

        const formData = createFileFormData(file, file.type);
        uploadFile(formData)
            .then(response => {
                if (response && response.fileId) {
                    setUploadIconFileId(response.fileId);
                    addToast({
                        description: '파일이 성공적으로 업로드되었습니다.',
                        variant: 'normal'
                    });
                }
                if(fileError) {
                  addToast({
                    title: '파일 업로드 실패',
                    description: fileError.message,
                    variant: 'critical'
                  });
                }
            })
            .finally(() => {
                setIsUploading(false);
            });
    }, [uploadFile, addToast, previewUrl]);

    const handleFinish = useCallback(async (values: Record<string, string>) => {
        if (mode === 'edit' && detailCategoryData) {
            try {
                const category = await updateCategory({
                    name: values.name || detailCategoryData.name,
                    contextPath: values.contextPath || detailCategoryData.contextPath,
                    iconFileId: uploadIconFileId || undefined,
                });

                if (category) {
                    await mutate();
                    addToast({
                        title: '수정 완료',
                        description: '장비 분류가 성공적으로 수정되었습니다.',
                        variant: 'normal'
                    });
                    resetForm();
                    if (onSuccess) onSuccess();
                }
                if (categoryUpdateError) {
                  addToast({
                    title: '수정 실패',
                    description: categoryUpdateError.message,
                    variant: 'critical'
                  });
                }
            } finally {
              setIsUploading(false);
            }
        } else {
            if (!uploadIconFileId) {
                addToast({
                    description: '아이콘 파일을 업로드해주세요.',
                    variant: 'warning'
                });
                return;
            }
            try {
                const line = await createCategory({
                    name: values.name,
                    contextPath: values.contextPath,
                    iconFileId: uploadIconFileId,
                });

                if (line) {
                    addToast({
                        description: '장비 분류가 성공적으로 등록되었습니다.',
                        title: '등록 완료',
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
              setIsUploading(false);
            }
        }
    }, [createCategory, updateCategory, detailCategoryData, onSuccess, name, uploadIconFileId, mode, addToast]);

    const resetForm = () => {
        setName('');
        setContextPath('');
        setIconFile(null);
        setUploadIconFileId(null);
        setPreviewUrl(null);
        
        if (selectedCategoryId) {
            mutate();
        }
        onClose();
    };

    const isProcessing = isCreating || isFileUploading || isCategoryUpdating;

    const openFilePicker = () => {
        const fileInput = document.getElementById('icon-file');
        if (fileInput) {
            fileInput.click();
        }
    };

    return (
        <Modal
            title={mode === 'create' ? '장비 분류 등록' : '장비 분류 수정'}
            isOpen={isOpen}
            onClose={isProcessing ? undefined : resetForm}
            overlayClassName="bg-black/50"
        >
            <Form
                key={mode + (detailCategoryData?.id ?? '')}
                initialValues={
                    mode === 'edit' && detailCategoryData
                        ? {
                            name: detailCategoryData?.name,
                            contextPath: detailCategoryData?.contextPath,
                            iconFile: String(detailCategoryData?.iconFile.id)
                        }
                        : {
                            name: '',
                            contextPath: '',
                            iconFile: ''
                        }
                }
                onSubmit={handleFinish}
            >
                <FormItem name="name" label="분류명" required>
                    <Input.Text
                        placeholder="분류 이름을 입력하세요"
                        value={name}
                        onChange={value => setName(value)}
                    />
                </FormItem>
                <FormItem name="contextPath" label="컨텍스트 패스" required>
                    <Input.Text
                        placeholder="컨텍스트 패스를 입력하세요"
                        value={contextPath}
                        onChange={value => setContextPath(value)}
                    />
                </FormItem>

                <FormItem name="iconFile" label="분류 아이콘 파일" required>
                    <div className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-md p-4">
                        <div className="w-15 h-15 rounded-sm overflow-hidden border border-gray-200 shrink-0">
                            {previewUrl ? (
                                <img 
                                    src={previewUrl} 
                                    alt="선택된 파일" 
                                    className="w-full h-full"
                                />
                            ) : (detailCategoryData?.iconFile?.url && mode === 'edit') ? (
                                <img 
                                    src={detailCategoryData.iconFile.url} 
                                    alt="썸네일 파일" 
                                    className="w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 text-center">No Image</div>
                            )}
                        </div>
                        <input
                            type="file"
                            id="icon-file"
                            className="hidden"
                            onChange={handleIconFileChange}
                            accept="image/*"
                        />

                        {!iconFile ? (
                            <div className="flex items-center flex-1">
                                {mode === 'edit' && detailCategoryData
                                    ? <p className="flex-1 text-sm">{detailCategoryData.iconFile?.originalFileName}</p>
                                    : <p className="flex-1 text-sm text-gray-500">IMAGE 파일 업로드</p>
                                }
                                <Button
                                    type="button"
                                    color="secondary"
                                    className="w-30"
                                    onClick={() => openFilePicker()}
                                >
                                    {mode === 'edit' ? '변경' : '파일 선택'}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                                <span className="text-sm truncate max-w-xs">
                                {iconFile.name} ({Math.round(iconFile.size / 1024)} KB)
                                </span>

                                {isUploading ? (
                                    <div
                                        className="h-4 w-4 border-2 border-t-primary-500 rounded-full animate-spin"></div>
                                ) : uploadIconFileId ? (
                                    <div className="text-green-500 text-xs">업로드 완료</div>
                                ) : (
                                    <Button
                                        type="button"
                                        color="secondary"
                                        className="w-30"
                                        onClick={() => openFilePicker()}
                                    >
                                        변경
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </FormItem>

                <div className="mt-6 flex justify-center gap-2">
                    <Button type="button" onClick={resetForm} disabled={isProcessing}>
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
    );
};