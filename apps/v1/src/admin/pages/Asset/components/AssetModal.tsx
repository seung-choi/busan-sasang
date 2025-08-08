import React, {useState, useCallback, useEffect} from 'react';
import {Modal, Form, FormItem, Button, Input} from '@plug/ui';
import {
    useFileUpload,
    createFileFormData,
    useAssetCreate,
    useAssetsDetailSWR,
    useAssetUpdate
} from '@plug/common-services';
import {useToastStore} from '@plug/v1/admin/components/hook/useToastStore';

export interface AssetRegistProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mode: 'create' | 'edit';
    selectedAssetId?: number;
}

export const AssetRegistModal = ({isOpen, onClose, onSuccess, mode, selectedAssetId}: AssetRegistProps) => {
    const {addToast} = useToastStore();
    const [name, setName] = useState('');

    // 3d 모델 파일 상태 관리
    const [modelFile, setModelFile] = useState<File | null>(null);
    const [uploadedModelId, setUploadedModelId] = useState<number | null>(null);

    // thumbnail파일 상태 관리
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [uploadThumbnailId, setUploadThumbnailId] = useState<number | null>(null);

    // 파일 공통 로딩 상태 관리
    const [isUploading, setIsUploading] = useState(false);

    // 파일 업로드 훅
    const {execute: uploadFile, isLoading: isFileUploading, error: fileError} = useFileUpload();

    // 에셋 생성 훅
    const {execute: createAsset, isLoading: isAssetCreating, error: assetError} = useAssetCreate();

    // 에셋 상세 조회 훅
    const {mutate, data: detailAssetData} = useAssetsDetailSWR(mode === 'edit' && selectedAssetId ? Number(selectedAssetId) : 0);

    // 에셋 수정 훅
    const { execute: updateAsset, isLoading: isAssetUpdating, error: assetUpdateError} = useAssetUpdate(Number(selectedAssetId));

    // 3D 모델 파일 선택 핸들러
    const handleModelChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setModelFile(file);

        // 파일명을 기본 이름 값으로 설정
        if (!name) {
            setName(file.name.replace(/\.[^/.]+$/, "")); // 확장자 제거
        }

        // GLB 파일인지 확인하고 적절한 MIME 타입 설정
        const mimeType = file.name.endsWith('.glb') ? 'model/gltf-binary' :
            file.name.endsWith('.gltf') ? 'model/gltf+json' :
                undefined;

        // 파일이 선택되면 자동으로 업로드 시작
        setIsUploading(true);
        // 올바른 MIME 타입으로 FormData 생성
        const formData = createFileFormData(file, mimeType);
        uploadFile(formData)
            .then(response => {
                if (response && response.fileId) {
                    setUploadedModelId(response.fileId);
                    addToast({
                        title: '파일 업로드',
                        description: '3D 모델 파일이 성공적으로 업로드되었습니다.',
                        variant: 'normal'
                    });
                }
                if(fileError){
                  addToast({
                    title: '업로드 실패',
                    description: fileError.message,
                    variant: 'critical'
                  })
                }
            })
            .finally(() => {
                setIsUploading(false);
            });
    }, [uploadFile, name, addToast]);    // Thumbnail 파일 선택 핸들러
    const handleThumbnailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 이미지 파일 체크 (JPEG, JPG, PNG, WebP, GIF 등)
        if (!file.type.startsWith('image/')) {
            addToast({
                title: '파일 형식 오류',
                description: '이미지 파일만 업로드 가능합니다. (JPEG, JPG, PNG, WebP, GIF 등)',
                variant: 'warning'
            });
            return;
        }

        setThumbnailFile(file);

        // 파일이 선택되면 자동으로 업로드 시작
        setIsUploading(true);        // 올바른 MIME 타입으로 FormData 생성
        const formData = createFileFormData(file, file.type);
        uploadFile(formData)
            .then(response => {
                if (response && response.fileId) {
                    setUploadThumbnailId(response.fileId);
                    addToast({
                        title: '파일 업로드',
                        description: '썸네일이 성공적으로 업로드되었습니다.',
                        variant: 'normal'
                    });
                }
                if(fileError){
                  addToast({
                    title: '업로드 실패',
                    description: fileError.message,
                    variant: 'critical'
                  })
                }
            })
            .finally(() => {
                setIsUploading(false);
            });
    }, [uploadFile, addToast]);


    useEffect(() => {
        if (mode === 'edit' && detailAssetData && isOpen) {
            setName(detailAssetData.name);
        }
    }, [mode, detailAssetData, isOpen]);


    // 폼 초기화
    const resetForm = useCallback(() => {
        setName('');
        setModelFile(null);
        setThumbnailFile(null);
        setUploadedModelId(null);
        setUploadThumbnailId(null);
        onClose();
    }, [onClose]);

    // 제출 핸들러
    const handleFinish = useCallback(async (values: Record<string, string>) => {
        // 수정 모달 제출
        if (mode === 'edit' && detailAssetData) {
            try {
                const asset = await updateAsset({
                    name: values.assetRegistName || name,
                    code: values.assetCode || detailAssetData.code,
                    fileId: uploadedModelId || undefined,
                    thumbnailFileId: uploadThumbnailId || undefined
                });

                // 성공 처리
                if (asset) {
                    await mutate();
                    addToast({
                        title: '수정 완료',
                        description: '에셋이 성공적으로 수정되었습니다.',
                        variant: 'normal'
                    });
                    resetForm();
                    if (onSuccess) onSuccess();
                }

                if(assetUpdateError){
                  addToast({
                    title: '수정 실패',
                    description: assetUpdateError.message,
                    variant: 'critical'
                  })
                }
            }  finally {
               setIsUploading(false);
            }
            // 등록 모달 제출
        } else {
            if (!uploadedModelId || !uploadThumbnailId) {
                addToast({
                    title: '파일 누락',
                    description: '파일을 먼저 업로드해주세요.',
                    variant: 'warning'
                });
                return;
            }

            try {
                // 에셋 생성 API 호출
                const asset = await createAsset({
                    name: values.assetRegistName || name,
                    code: values.assetCode || '',
                    fileId: uploadedModelId,
                    thumbnailFileId: uploadThumbnailId,
                });

                // 성공 처리
                if (asset) {
                    addToast({
                        title: '등록 완료',
                        description: '에셋이 성공적으로 등록되었습니다.',
                        variant: 'normal'
                    });
                    if (onSuccess) onSuccess();
                    resetForm();
                }
                if(assetError){
                  addToast({
                    title: '등록 실패',
                    description: assetError.message,
                    variant: 'critical'
                  })
                }
            } finally {
              setIsUploading(false);
            }
        }
    }, [createAsset, uploadedModelId, name, mode, onSuccess, detailAssetData, updateAsset, uploadThumbnailId, resetForm, addToast]);


    // 에러 메시지 표시
    const isProcessing = isFileUploading || isAssetCreating || isAssetUpdating;

    // 파일 선택기 열기
    const openFilePicker = (type: 'model' | 'thumbnail') => {
        const fileInput = document.getElementById(type === 'model' ? 'icon-file' : 'thumbnail-file');
        if (fileInput) {
            fileInput.click();
        }
    };

    return (
        <Modal
            title={mode === 'create' ? '에셋 등록' : '에셋 수정'}
            isOpen={isOpen}
            onClose={isProcessing ? undefined : resetForm}
            closeOnOverlayClick={false}
            overlayClassName="bg-black/50"
        >
            <Form
                key={mode + (detailAssetData?.id ?? '')}
                initialValues={
                    mode === 'edit' && detailAssetData
                        ? {
                            assetRegistName: detailAssetData?.name,
                            assetCode: detailAssetData?.code,
                            assetFileId: String(detailAssetData?.file?.id),
                        }
                        : {
                            assetRegistName: '',
                            assetCode: '',
                            assetFileId: '',
                        }
                }
                onSubmit={handleFinish}
            >
                <FormItem name="assetRegistName" label='이름' required>
                    <Input.Text
                        placeholder="에셋 이름을 입력하세요"
                        value={name}
                        onChange={value => setName(value)}
                    />
                </FormItem>
                <FormItem name="assetCode" label='코드' required>
                    <Input.Text
                        placeholder="에셋 코드를 입력하세요"
                        value={name}
                        onChange={value => setName(value)}
                    />
                </FormItem>

                <FormItem name="assetRegistThumbnail" label='Thumbnail 파일' required>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4">                        <input
                            type="file"
                            id="thumbnail-file"
                            className="hidden"
                            onChange={handleThumbnailChange}
                            accept="image/*"
                        />

                        {!thumbnailFile ? (                            <div className="flex items-center">
                                {mode === 'edit' && detailAssetData
                                    ? <p className="flex-1 text-sm">{detailAssetData.thumbnailFile.originalFileName}</p>
                                    : <p className="flex-1 text-sm text-gray-500">이미지 파일만 가능합니다. (JPEG, JPG, PNG, WebP, GIF 등)</p>
                                }
                                <Button
                                    type="button"
                                    color="secondary"
                                    className="w-30"
                                    onClick={() => openFilePicker('thumbnail')}
                                >
                                    {mode === 'edit' ? '변경' : '파일 선택'}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                <span className="text-sm truncate max-w-xs">
                  {thumbnailFile.name} ({Math.round(thumbnailFile.size / 1024)} KB)
                </span>

                                {isUploading ? (
                                    <div
                                        className="h-4 w-4 border-2 border-t-primary-500 rounded-full animate-spin"></div>
                                ) : uploadThumbnailId ? (
                                    <div className="text-green-500 text-xs">업로드 완료</div>
                                ) : (
                                    <Button
                                        type="button"
                                        color="secondary"
                                        className="w-30"
                                        onClick={() => openFilePicker('thumbnail')}
                                    >
                                        변경
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </FormItem>

                <FormItem name="assetRegistFile" label='3D 모델 파일' required>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                        <input
                            type="file"
                            id="icon-file"
                            className="hidden"
                            onChange={handleModelChange}
                            accept=".glb,.gltf"
                        />

                        {!modelFile ? (
                            <div className="flex items-center">
                                {mode === 'edit' && detailAssetData
                                    ? <p className="flex-1 text-sm">{detailAssetData.file.originalFileName}</p>
                                    : <p className="flex-1 text-sm text-gray-500">GLB, GLTF 파일만 가능합니다.</p>
                                }
                                <Button
                                    type="button"
                                    color="secondary"
                                    className="w-30"
                                    onClick={() => openFilePicker('model')}
                                >
                                    {mode === 'edit' ? '변경' : '파일 선택'}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between w-full">
                <span className="text-sm truncate max-w-xs">
                  {modelFile.name} ({Math.round(modelFile.size / 1024)} KB)
                </span>

                                {isUploading ? (
                                    <div
                                        className="h-4 w-4 border-2 border-t-primary-500 rounded-full animate-spin"></div>
                                ) : uploadedModelId ? (
                                    <div className="text-green-500 text-xs">업로드 완료</div>
                                ) : (
                                    <Button
                                        type="button"
                                        color="secondary"
                                        className="w-30"
                                        onClick={() => openFilePicker('model')}
                                    >
                                        변경
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </FormItem>

                <div className="mt-6 flex justify-center gap-2">
                    <Button type="button" onClick={resetForm} disabled={isProcessing}>취소</Button>
                    <Button
                        type="submit"
                        color="primary"
                        disabled={
                            isProcessing || !name ||
                            (mode === 'create' && (!uploadedModelId || !uploadThumbnailId)) ||
                            (mode === 'edit' && !name)
                        }
                        isLoading={isAssetCreating || isAssetUpdating}
                    >
                        {mode === 'create' ? '등록' : '수정'}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
} 