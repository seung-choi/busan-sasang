export interface FileRequest {
    file: File;
}
export interface FileResponse {
    id: number;
    url: string;
    originalFileName: string;
    fileType?: string;
    contentType: string;
    fileStatus: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface FileUploadResponse {
    fileId: number;
    location: string;
}

export interface FileState {
    fileId: number | null;
    file: File | null;
    originalFileName: string;
}