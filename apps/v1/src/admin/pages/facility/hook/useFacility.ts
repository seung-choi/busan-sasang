import {useState, useCallback} from 'react';
import {useFileUploader} from "@plug/v1/admin/pages/facility/hook/useFileUploader";
import {FileType} from "@plug/v1/admin/pages/facility/types/file";
import {useToastStore} from "@plug/v1/admin/components/hook/useToastStore";
import {useCreateStation} from "@plug/common-services";

interface FacilityProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export const useFacility = ({onClose, onSuccess}: FacilityProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [facilityName, setFacilityName] = useState('');

    const {execute, error: createError} = useCreateStation();
    const addToast = useToastStore((state) => state.addToast);

    const {
        files,
        modelData,
        resetModelData,
        isUploading,
        handleFileUpload: originalHandleFileUpload,
        resetFiles
    } = useFileUploader(setFacilityName);

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        fileType: FileType
    ) => {
        const result = await originalHandleFileUpload(event, fileType);
        return result;
    };

    const resetForm = useCallback(() => {
        setFacilityName('');
        resetFiles();
        resetModelData();
        onClose();
    }, [onClose, resetFiles, resetModelData]);


    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFinish = useCallback(async (values: Record<string, any>) => {

        setIsLoading(true);
        try {

            const lineIds = Array.isArray(values.linesId)
                ? values.linesId.map(Number)
                : [Number(values.linesId)];



            const result = await execute({
                externalCode: values.externalCode,
                facility: {
                    code: values.code,
                    description: values.description,
                    drawingFileId: files.model.fileId,
                    name: values.name,
                    thumbnailFileId: files.thumbnail.fileId
                },
                floors: modelData.map(item => ({
                    floorId: String(item.floorId),
                    name: item.displayName
                })),
                lineIds
            });

          if (createError) {
            addToast({
              title: '등록 실패',
              description: createError.message || '역사 정보 등록 중 오류가 발생했습니다.',
              variant: 'critical',
            });
          }

          if (result) {
                addToast({
                    title: '등록 완료',
                    description: '역사 정보가 등록되었습니다.',
                    variant: 'normal',
                });
                onSuccess?.();
                resetForm();
            }

        } finally {
            setIsLoading(false);
        }
    }, [files.model.fileId, files.thumbnail.fileId, onClose, onSuccess, resetForm, addToast]);

    return {
        isLoading,
        facilityName,
        files,
        isUploading,
        handleFileUpload,
        handleFinish,
        resetForm,
        modelData
    };
};