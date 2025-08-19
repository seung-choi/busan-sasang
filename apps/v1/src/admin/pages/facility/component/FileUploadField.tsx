import React from 'react';
import { Button, FormItem } from '@plug/ui';
import { FileType } from '../types/file';

interface FileUploadFieldProps {
    type: FileType;
    label: string;
    fileState: {
        file: File | null;
        fileId: number | null;
        originalFileName?: string;
    };
    isUploading: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenPicker: (type: FileType) => void;
    className?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
    type,
    label,
    fileState,
    isUploading,
    onChange,
    onOpenPicker,
}) => (
    <FormItem name={`${type}Field`} label={label} required>
        <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
            <input
                type="file"
                id={`${type}-file`}
                className="hidden"
                onChange={onChange}
                accept={type === 'model' ? '.glb,.gltf' : '.png,.jpeg,.jpg'}
            />
            
            {!fileState.file ? (
                <div className="flex items-center">
                    <p className="flex-1 text-sm">
                        {fileState.originalFileName ? (
                            fileState.originalFileName
                        ) : (
                            <span className="text-gray-500">
                                {type === 'model' ? 'GLB, GLTF 파일만 가능합니다.' : 'PNG, JPEG, JPG 파일만 가능합니다.'}
                            </span>
                        )}
                    </p>
                    <Button
                        type="button"
                        color="secondary"
                        className="w-30"
                        onClick={() => onOpenPicker(type)}
                    >
                        {fileState.originalFileName ? '변경' : '파일 선택'}
                    </Button>
                </div>
            ) : (
                <div className="flex items-center justify-between w-full">
                    <span className="text-sm truncate max-w-xs">
                        {fileState.originalFileName? fileState.originalFileName : fileState.file.name}
                    </span>
                    
                    {isUploading ? (
                        <div className="h-4 w-4 border-2 border-t-primary-500 rounded-full animate-spin" />
                    ) : fileState.fileId ? (
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                color="secondary"
                                className="w-30"
                                onClick={() => onOpenPicker(type)}
                            >
                                변경
                            </Button>
                        </div>
                    ) : (
                        <Button
                            type="button"
                            color="secondary"
                            className="w-30"
                            onClick={() => onOpenPicker(type)}
                        >
                            변경
                        </Button>
                    )}
                </div>
            )}
        </div>
    </FormItem>
);