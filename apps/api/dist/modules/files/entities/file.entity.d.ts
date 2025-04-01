export declare class File {
    id: string;
    filename: string;
    originalName: string;
    mimeType: string;
    size: number;
    path: string;
    entityType: string;
    entityId: string;
    category: string;
    data: Buffer;
    isStoredInDb: boolean;
    uploadedAt: Date;
    version: number;
    getFileUrl(baseUrl?: string): string;
}
