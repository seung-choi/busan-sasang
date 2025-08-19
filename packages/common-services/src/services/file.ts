import { api, useFileApi } from "@plug/api-hooks";
import type { RequestOptions } from '@plug/api-hooks';
import type { FileUploadResponse } from '@plug/common-services/types';
import { FileResponse } from "../types";

const FILE_API = `files`;

/**
 * 파일 업로드 전용 API 훅
 * Location 헤더에서 fileId를 추출하는 로직을 포함함
 * @template T - 업로드 응답 데이터 타입 (기본값: FileUploadResponse)
 * @param options - 요청 옵션
 * @returns 파일 업로드 API 훅 객체
 */
export const useFileUpload = <T = FileUploadResponse>(options?: RequestOptions) => {
  return useFileApi<T>(`${FILE_API}/upload`, {
    requireAuth: true,
    ...options
  });
};

// FormData를 이용한 파일 업로드 헬퍼 함수 (MIME 타입 지정 기능 추가)
export const createFileFormData = (file: File, mimeTypeOverride?: string): FormData => {
  const formData = new FormData();
  
  // 파일의 MIME 타입을 재정의해야 하는 경우
  if (mimeTypeOverride) {
    // 파일 이름과 MIME 타입을 명시적으로 설정한 새 File 객체 생성
    const fileWithCorrectType = new File([file], file.name, { 
      type: mimeTypeOverride 
    });
    formData.append('file', fileWithCorrectType);
  } else {
    formData.append('file', file);
  }
  
  return formData;
};

export const getFileInfo = async (locationHeader: FileUploadResponse | null): Promise<FileResponse> => {
  if (!locationHeader) {
    throw new Error('업로드 응답에 Location이 없습니다.');
  }

  const response = await api.get<FileResponse>(locationHeader.location?.replace(/^\//, '') ?? '');
  return response.data;
};

// 다중 파일 업로드를 위한 헬퍼 함수(나중이 필요할 수도?)
export const createMultipleFileFormData = (files: File[], fieldName: string = 'files'): FormData => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append(fieldName, file);
  });

  return formData;
};
