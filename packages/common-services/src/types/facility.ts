import {FileResponse} from "./file";

interface AuditEntity {
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
}

export interface Facility extends AuditEntity {
    id: number;
    code: string;
    name: string;
    description: string;
    drawing: FileResponse;
    thumbnail: FileResponse;
}

export interface Floor {
    name: string;
    floorId: string;
}