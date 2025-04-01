export declare class CreateFileDto {
    filename?: string;
    originalName?: string;
    mimeType?: string;
    size?: number;
    path?: string;
    entityType?: string;
    entityId?: string;
    category?: string;
    data?: Buffer;
    isStoredInDb?: boolean;
}
