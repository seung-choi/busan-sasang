export interface AssetResponse {
    id: number,
    name: string;
    code: string;
    categoryId: number | null;
    categoryName: string | null;
    categoryCode: string | null;
    file: {
      id: number,
      url: string,
      originalFileName: string,
      contentType: string,
      fileStatus: string,
      createdAt: string,
      updatedAt: string,
    },
    thumbnailFile: {
        id: number,
        url: string,
        originalFileName: string,
        contentType: string,
        fileStatus: string,
        createdAt: string,
        updatedAt: string,
    },
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string
}

export interface AssetCreateRequest {
    name: string,
    code: string,
    fileId: number,
    thumbnailFileId: number,
}
export interface AssetUpdateRequest {
    name: string,
    code: string,
    fileId?: number,
    thumbnailFileId?: number
}


