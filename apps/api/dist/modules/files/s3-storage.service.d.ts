import { ConfigService } from "@nestjs/config";
export declare class S3StorageService {
    private configService;
    private s3Client;
    private bucket;
    constructor(configService: ConfigService);
    uploadFile(fileKey: string, fileBuffer: Buffer, mimetype: string): Promise<string>;
    getFileBuffer(fileKey: string): Promise<Buffer>;
    getPresignedUrl(fileKey: string, expiresIn?: number): Promise<string>;
    deleteFile(fileKey: string): Promise<void>;
}
