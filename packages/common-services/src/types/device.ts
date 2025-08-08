export interface DeviceResponse{
    id: string,
    feature: {
        id: string,
        position: {
            x: number,
            y: number,
            z: number
        },
        rotation: {
            x: number,
            y: number,
            z: number
        },
        scale: {
            x: number,
            y: number,
            z: number
        },
        assetId: number,
        floorId: number,
        deviceId: string
    },
    categoryId: number,
    categoryName: string,
    asset: number,
    assetName: string,
    name: string,
    code: string,
    description: string,
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string
}

export interface DeviceCreateRequest{
    deviceCategoryId?: number,
    id?: string,
    asset?: number,
    name?: string,
    description?: string
}

export interface DeviceUpdateRequest{
    deviceCategoryId?: number,
    id?: string,
    asset?: number,
    name?: string,
    description?: string
}