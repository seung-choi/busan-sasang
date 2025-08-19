export interface LineResponse{
    id: number,
    color: string,
    name: string,
    stationIds: number[];
    createdAt: string,
    createdBy: string,
    updatedAt: string,
    updatedBy: string
}

export interface LineCreateRequest{
    name: string,
    color: string
}

export interface LineUpdateResquest{
    name: string,
    color: string
}