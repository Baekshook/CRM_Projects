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
var ResourcesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const resources_service_1 = require("./resources.service");
const create_resource_dto_1 = require("./dto/create-resource.dto");
const update_resource_dto_1 = require("./dto/update-resource.dto");
let ResourcesController = ResourcesController_1 = class ResourcesController {
    constructor(resourcesService) {
        this.resourcesService = resourcesService;
        this.logger = new common_1.Logger(ResourcesController_1.name);
    }
    async create(createResourceDto) {
        this.logger.log(`Creating resource: ${JSON.stringify({
            ...createResourceDto,
            data: createResourceDto.data ? "Binary data" : undefined,
        })}`);
        return this.resourcesService.create(createResourceDto);
    }
    async uploadFile(file, body) {
        this.logger.log(`Uploading file: ${file.originalname}, size: ${file.size}, type: ${file.mimetype}`);
        this.logger.log(`Upload metadata: ${JSON.stringify(body)}`);
        const type = this.determineFileType(file.mimetype);
        const createResourceDto = {
            name: file.originalname,
            description: body.description,
            entityId: body.entityId,
            entityType: body.entityType || "singer",
            fileUrl: `/uploads/${file.filename}`,
            fileSize: file.size,
            mimeType: file.mimetype,
            type,
            category: body.category || "일반",
            tags: body.tags ? body.tags.split(",") : [],
            isPublic: body.isPublic === "true",
            isStoredInDb: true,
            data: file.buffer,
        };
        return this.resourcesService.create(createResourceDto);
    }
    async findAll(entityId, entityType, type, category) {
        this.logger.log(`Finding resources with query: ${JSON.stringify({
            entityId,
            entityType,
            type,
            category,
        })}`);
        if (entityId) {
            return this.resourcesService.findByEntityId(entityId, entityType);
        }
        return this.resourcesService.findAll({ entityType, type, category });
    }
    async findOne(id) {
        this.logger.log(`Finding resource with id: ${id}`);
        return this.resourcesService.findOne(id);
    }
    async update(id, updateResourceDto) {
        this.logger.log(`Updating resource ${id}: ${JSON.stringify({
            ...updateResourceDto,
            data: updateResourceDto.data ? "Binary data" : undefined,
        })}`);
        return this.resourcesService.update(id, updateResourceDto);
    }
    async remove(id) {
        this.logger.log(`Removing resource with id: ${id}`);
        return this.resourcesService.remove(id);
    }
    determineFileType(mimeType) {
        if (mimeType.startsWith("image/")) {
            return "image";
        }
        else if (mimeType.startsWith("audio/")) {
            return "audio";
        }
        else if (mimeType.startsWith("video/")) {
            return "video";
        }
        else if (mimeType === "application/pdf" ||
            mimeType === "application/msword" ||
            mimeType ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
            mimeType === "application/vnd.ms-excel" ||
            mimeType ===
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            mimeType === "application/vnd.ms-powerpoint" ||
            mimeType ===
                "application/vnd.openxmlformats-officedocument.presentationml.presentation") {
            return "document";
        }
        return "other";
    }
};
exports.ResourcesController = ResourcesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_resource_dto_1.CreateResourceDto]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("upload"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    __param(0, (0, common_1.UploadedFile)(new common_1.ParseFilePipe({
        validators: [new common_1.MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })],
    }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("entityId")),
    __param(1, (0, common_1.Query)("entityType")),
    __param(2, (0, common_1.Query)("type")),
    __param(3, (0, common_1.Query)("category")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_resource_dto_1.UpdateResourceDto]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResourcesController.prototype, "remove", null);
exports.ResourcesController = ResourcesController = ResourcesController_1 = __decorate([
    (0, common_1.Controller)("resources"),
    __metadata("design:paramtypes", [resources_service_1.ResourcesService])
], ResourcesController);
//# sourceMappingURL=resources.controller.js.map