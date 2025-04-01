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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesController = void 0;
const common_1 = require("@nestjs/common");
const files_service_1 = require("./files.service");
const create_file_dto_1 = require("./dto/create-file.dto");
const update_file_dto_1 = require("./dto/update-file.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path = require("path");
const fs = require("fs");
const uuid_1 = require("uuid");
const crypto_1 = require("crypto");
let FilesController = class FilesController {
    constructor(filesService) {
        this.filesService = filesService;
    }
    async create(createFileDto, file) {
        const dto = {
            ...createFileDto,
            filename: file.filename || `${(0, uuid_1.v4)()}${path.extname(file.originalname)}`,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            data: file.buffer,
        };
        return this.filesService.create(dto);
    }
    async upload(file, body) {
        const { entityType, entityId, category } = body;
        const storeInDb = body.storeInDb === "true" || body.storeInDb === true;
        let fileData = null;
        if (storeInDb) {
            fileData = fs.readFileSync(file.path);
        }
        const createFileDto = {
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            entityType,
            entityId,
            category,
            data: storeInDb ? fileData : null,
        };
        return this.filesService.create(createFileDto);
    }
    async uploadToDb(file, createFileDto) {
        try {
            console.log("uploadToDb 호출됨 - 요청 데이터:", createFileDto);
            if (!file) {
                console.error("파일이 업로드되지 않았습니다.");
                throw new common_1.BadRequestException("파일이 업로드되지 않았습니다.");
            }
            console.log("업로드된 파일 정보:", {
                filename: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                buffer: file.buffer ? `${file.buffer.length} 바이트` : "없음",
            });
            const entityType = createFileDto.entityType || "customer";
            const entityId = createFileDto.entityId || (0, crypto_1.randomUUID)();
            const category = createFileDto.category || "profile";
            if (!file.buffer || file.buffer.length === 0) {
                console.warn("파일 버퍼가 비어 있습니다. 빈 파일로 처리합니다.");
                file.buffer = Buffer.from([]);
            }
            try {
                const savedFile = await this.filesService.create({
                    filename: file.originalname,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    data: file.buffer,
                    entityType,
                    entityId,
                    category,
                    isStoredInDb: true,
                });
                console.log("파일이 DB에 성공적으로 저장됨:", savedFile.id);
                const fileUrl = savedFile.getFileUrl();
                return {
                    id: savedFile.id,
                    filename: savedFile.filename,
                    originalName: savedFile.originalName,
                    mimeType: savedFile.mimeType,
                    size: savedFile.size,
                    entityType: savedFile.entityType,
                    entityId: savedFile.entityId,
                    category: savedFile.category,
                    uploadedAt: savedFile.uploadedAt,
                    fileUrl: fileUrl,
                };
            }
            catch (dbError) {
                console.error("파일 DB 저장 중 오류 발생:", dbError);
                throw new common_1.InternalServerErrorException(`파일 저장 중 오류 발생: ${dbError.message}`);
            }
        }
        catch (error) {
            console.error("파일 업로드 중 오류 발생:", error);
            throw new common_1.InternalServerErrorException(`파일 업로드 중 오류 발생: ${error.message}`);
        }
    }
    async uploadMultiple(files, body) {
        const { entityType, entityId, category } = body;
        const storeInDb = body.storeInDb === "true" || body.storeInDb === true;
        const results = [];
        for (const file of files) {
            let fileData = null;
            if (storeInDb) {
                fileData = fs.readFileSync(file.path);
            }
            const createFileDto = {
                filename: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                path: file.path,
                entityType,
                entityId,
                category,
                data: storeInDb ? fileData : null,
            };
            const result = await this.filesService.create(createFileDto);
            results.push(result);
        }
        return {
            success: true,
            count: results.length,
            files: results,
        };
    }
    findAll() {
        return this.filesService.findAll();
    }
    findOne(id) {
        return this.filesService.findOne(id);
    }
    async getFileData(id, res) {
        try {
            const file = await this.filesService.findOne(id);
            const fileData = await this.filesService.getFileData(id);
            console.log(`파일 ${id} 데이터 요청. 타입: ${file.mimeType}, 크기: ${fileData.length} 바이트`);
            if (file.mimeType.startsWith("image/")) {
                res.set({
                    "Content-Type": file.mimeType,
                    "Content-Disposition": `inline; filename="${file.originalName}"`,
                    "Cache-Control": "public, max-age=31536000",
                    ETag: `"${file.id}_${file.version}"`,
                    "X-File-Id": file.id,
                });
            }
            else {
                res.set({
                    "Content-Type": file.mimeType,
                    "Content-Disposition": `attachment; filename="${file.originalName}"`,
                    "Cache-Control": "no-cache",
                    ETag: `"${file.id}_${file.version}"`,
                    "X-File-Id": file.id,
                });
            }
            return new common_1.StreamableFile(fileData);
        }
        catch (error) {
            console.error(`파일 데이터 가져오기 실패: ${error.message}`);
            throw error;
        }
    }
    findByEntityId(entityType, entityId) {
        return this.filesService.findByEntityId(entityType, entityId);
    }
    update(id, updateFileDto) {
        return this.filesService.update(id, updateFileDto);
    }
    remove(id) {
        return this.filesService.remove(id);
    }
};
exports.FilesController = FilesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_file_dto_1.CreateFileDto, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const entityType = req.body.entityType || "default";
                const entityId = req.body.entityId || "default";
                const uploadPath = path.join(process.cwd(), "uploads", entityType, entityId);
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueName = `${(0, uuid_1.v4)()}${path.extname(file.originalname)}`;
                cb(null, uniqueName);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [new common_1.MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })],
    }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "upload", null);
__decorate([
    (0, common_1.Post)("upload-to-db"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.memoryStorage)(),
        limits: {
            fileSize: 10 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            console.log("파일 업로드 요청 수신:", {
                filename: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                fieldname: file.fieldname,
            });
            if (file.mimetype.startsWith("image/") ||
                file.mimetype === "application/pdf" ||
                file.mimetype === "application/msword" ||
                file.mimetype ===
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                file.mimetype === "application/vnd.ms-excel" ||
                file.mimetype ===
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                callback(null, true);
            }
            else {
                callback(new common_1.BadRequestException(`지원하지 않는 파일 형식입니다: ${file.mimetype}`), false);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_file_dto_1.CreateFileDto]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadToDb", null);
__decorate([
    (0, common_1.Post)("multi-upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files", 10, {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const entityType = req.body.entityType || "default";
                const entityId = req.body.entityId || "default";
                const uploadPath = path.join(process.cwd(), "uploads", entityType, entityId);
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueName = `${(0, uuid_1.v4)()}${path.extname(file.originalname)}`;
                cb(null, uniqueName);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "uploadMultiple", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(":id/data"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FilesController.prototype, "getFileData", null);
__decorate([
    (0, common_1.Get)("by-entity/:entityType/:entityId"),
    __param(0, (0, common_1.Param)("entityType")),
    __param(1, (0, common_1.Param)("entityId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "findByEntityId", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_file_dto_1.UpdateFileDto]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FilesController.prototype, "remove", null);
exports.FilesController = FilesController = __decorate([
    (0, common_1.Controller)("files"),
    __metadata("design:paramtypes", [files_service_1.FilesService])
], FilesController);
//# sourceMappingURL=files.controller.js.map