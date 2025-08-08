export interface Label3DResponse{
    id: number,
    displayText: string,
    floorId: string,
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
}

export interface Label3DCreateRequest{
    id: string,
    displayText: string,
    facilityId: number,
    floorId: string,
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

}

export interface Label3DUpdateRequest{
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
}