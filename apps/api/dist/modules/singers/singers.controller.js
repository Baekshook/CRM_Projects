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
exports.SingersController = void 0;
const common_1 = require("@nestjs/common");
const singers_service_1 = require("./singers.service");
const create_singer_dto_1 = require("./dto/create-singer.dto");
const update_singer_dto_1 = require("./dto/update-singer.dto");
const platform_express_1 = require("@nestjs/platform-express");
const files_service_1 = require("../files/files.service");
const multer_1 = require("multer");
const path = require("path");
const fs = require("fs");
const uuid_1 = require("uuid");
let SingersController = class SingersController {
    constructor(singersService, filesService) {
        this.singersService = singersService;
        this.filesService = filesService;
    }
    create(createSingerDto) {
        return this.singersService.create(createSingerDto);
    }
    findAll() {
        return this.singersService.findAll();
    }
    findOne(id) {
        return this.singersService.findOne(id);
    }
    update(id, updateSingerDto) {
        return this.singersService.update(id, updateSingerDto);
    }
    remove(id) {
        return this.singersService.remove(id);
    }
    async uploadFile(id, file, body) {
        await this.singersService.findOne(id);
        const { category } = body;
        const fileEntity = await this.filesService.create({
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            entityType: "singer",
            entityId: id,
            category,
        });
        if (category === "profileImage") {
            await this.singersService.update(id, {
                profileImage: `/uploads/singers/${id}/${file.filename}`,
            });
        }
        return {
            success: true,
            file: fileEntity,
        };
    }
    async uploadMultipleFiles(id, files, body) {
        await this.singersService.findOne(id);
        const results = [];
        for (const file of files) {
            const category = body[`category_${file.originalname}`] || body.category || "other";
            const fileEntity = await this.filesService.create({
                filename: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
                path: file.path,
                entityType: "singer",
                entityId: id,
                category,
            });
            if (category === "profileImage") {
                await this.singersService.update(id, {
                    profileImage: `/uploads/singers/${id}/${file.filename}`,
                });
            }
            results.push(fileEntity);
        }
        return {
            success: true,
            count: results.length,
            files: results,
        };
    }
    async getSingerFiles(id) {
        await this.singersService.findOne(id);
        const files = await this.filesService.findByEntityId("singer", id);
        return {
            success: true,
            count: files.length,
            files,
        };
    }
};
exports.SingersController = SingersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_singer_dto_1.CreateSingerDto]),
    __metadata("design:returntype", void 0)
], SingersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SingersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SingersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_singer_dto_1.UpdateSingerDto]),
    __metadata("design:returntype", void 0)
], SingersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SingersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(":id/upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file", {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const singerId = req.params.id;
                const uploadPath = path.join(process.cwd(), "uploads", "singers", singerId);
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
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SingersController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)(":id/attachments"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files", 10, {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const singerId = req.params.id;
                const uploadPath = path.join(process.cwd(), "uploads", "singers", singerId);
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
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Object]),
    __metadata("design:returntype", Promise)
], SingersController.prototype, "uploadMultipleFiles", null);
__decorate([
    (0, common_1.Get)(":id/files"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SingersController.prototype, "getSingerFiles", null);
exports.SingersController = SingersController = __decorate([
    (0, common_1.Controller)("singers"),
    __metadata("design:paramtypes", [singers_service_1.SingersService,
        files_service_1.FilesService])
], SingersController);
//# sourceMappingURL=singers.controller.js.map