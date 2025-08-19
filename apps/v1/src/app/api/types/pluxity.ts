export interface ApiResponse<T> {
    status: string;
    message?: string;
    data?: T; 
}

export interface FileResponse {
    id: number;
    url: string;
    originalFileName: string;
    fileType: string;
    contentType: string;
    fileStatus: string;
    createdAt: string;
    updatedAt: string;
}

export interface DeviceCategory {
    id: string;
    name: string;
    description?: string;
}

export interface Device {
    id: string;
    name: string;
    category: DeviceCategory;
    status: string;
    location?: {
        latitude: number;
        longitude: number;
    };
    createdAt: string;
    updatedAt: string;
}
