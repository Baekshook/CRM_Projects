"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let S3StorageService = class S3StorageService {
    constructor(configService) {
        this.configService = configService;
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get("AWS_REGION"),
            credentials: {
                accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
                secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
            },
        });
        this.bucket = this.configService.get("AWS_S3_BUCKET");
    }
    async uploadFile(fileKey, fileBuffer, mimetype) {
        try {
            const uploadParams = {
                Bucket: this.bucket,
                Key: fileKey,
                Body: fileBuffer,
                ContentType: mimetype,
            };
            await this.s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
            const fileUrl = `${this.configService.get("AWS_S3_URL")}/${fileKey}`;
            console.log(`파일이 S3에 업로드되었습니다: ${fileUrl}`);
            return fileUrl;
        }
        catch (error) {
            console.error("S3 파일 업로드 오류:", error);
            throw error;
        }
    }
    async getFileBuffer(fileKey) {
        try {
            const getParams = {
                Bucket: this.bucket,
                Key: fileKey,
            };
            const response = await this.s3Client.send(new client_s3_1.GetObjectCommand(getParams));
            if (!response.Body) {
                throw new Error("파일 본문이 없습니다");
            }
            const chunks = [];
            for await (const chunk of response.Body) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        }
        catch (error) {
            console.error("S3 파일 다운로드 오류:", error);
            throw error;
        }
    }
    async getPresignedUrl(fileKey, expiresIn = 3600) {
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucket,
                Key: fileKey,
            });
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn });
        }
        catch (error) {
            console.error("S3 Presigned URL 생성 오류:", error);
            throw error;
        }
    }
    async deleteFile(fileKey) {
        try {
            const deleteParams = {
                Bucket: this.bucket,
                Key: fileKey,
            };
            await this.s3Client.send(new client_s3_1.DeleteObjectCommand(deleteParams));
            console.log(`파일이 S3에서 삭제되었습니다: ${fileKey}`);
        }
        catch (error) {
            console.error("S3 파일 삭제 오류:", error);
            throw error;
        }
    }
};
exports.S3StorageService = S3StorageService;
exports.S3StorageService = S3StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3StorageService);
//# sourceMappingURL=s3-storage.service.js.map