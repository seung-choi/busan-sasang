export interface FileState {
    file: File | null;
    fileId: number | null;
}

export type FileType = 'model' | 'thumbnail';