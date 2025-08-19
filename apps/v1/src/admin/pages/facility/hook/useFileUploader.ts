import { useState } from 'react';
import {createFileFormData, FileUploadResponse, useFileUpload} from '@plug/common-services';
import { FileState, FileType } from '../types/file';
import {ModelInfo} from "@plug/engine/src/interfaces";
import * as Px from "@plug/engine/src";
import { getFileInfo } from "@plug/common-services";
import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";

export const useFileUploader = (
    onNameSet?: (name: string) => void,
) => {
    const [files, setFiles] = useState<Record<FileType, FileState>>({
        model: { file: null, fileId: null },
        thumbnail: { file: null, fileId: null }
    });
    const [isUploading, setIsUploading] = useState(false);
    const { execute: uploadFile, error: fileError } = useFileUpload();
  const addToast = useToastStore((state) => state.addToast);

    const [modelData, setModelData] = useState<ModelInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getModelInfo = async (locationHeader: FileUploadResponse | null) => {
        if (!locationHeader) throw new Error('업로드 응답에 Location이 없습니다.');

        setIsLoading(true);
        try {
            const fileResponse = await getFileInfo(locationHeader);
            const fileUrl = fileResponse.url;

            Px.Model.GetModelHierarchyFromUrl(fileUrl, (data: ModelInfo[]) => {
                    setModelData(data);
            });

            if (fileError) {
              addToast({
                title: '업로드 실패',
                description: fileError.message || '모델 정보 로드 중 오류가 발생했습니다.',
                variant: 'critical',
              });
              throw fileError;
            }
        }  finally {
            setIsLoading(false);
        }
    };

    const resetModelData = () => {
        setModelData([]);
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        fileType: FileType
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (fileType === 'thumbnail' && !file.type.includes('image/')) {
            alert('이미지 파일만 업로드 가능합니다.');
            return;
        }

        if (fileType === 'model' && onNameSet) {
            onNameSet(file.name.replace(/\.[^/.]+$/, ""));
        }

        const mimeType = fileType === 'model'
            ? file.name.endsWith('.glb') ? 'model/gltf-binary' : 'model/gltf+json'
            : file.type;

        setIsUploading(true);
        try {
            const formData = createFileFormData(file, mimeType);
            const response = await uploadFile(formData);
            const fileId = Number(response?.location?.split('/').pop());

            setFiles(prev => ({
                ...prev,
                [fileType]: {
                    file,
                    fileId
                }
            }));
            if (fileType === 'model') {
                await getModelInfo(response);
            }

            return fileId;
        } finally {
            setIsUploading(false);
        }
    };

    return {
        files,
        isUploading,
        handleFileUpload,
        modelData,
        isLoading,
        getModelInfo,
        resetModelData,
        resetFiles: () => setFiles({ model: { file: null, fileId: null }, thumbnail: { file: null, fileId: null } }),
    };
};