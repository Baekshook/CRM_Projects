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
var ResourcesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resource_entity_1 = require("./entities/resource.entity");
let ResourcesService = ResourcesService_1 = class ResourcesService {
    constructor(resourceRepository) {
        this.resourceRepository = resourceRepository;
        this.logger = new common_1.Logger(ResourcesService_1.name);
    }
    async create(createResourceDto) {
        this.logger.log(`Creating resource: ${JSON.stringify({
            ...createResourceDto,
            data: createResourceDto.data ? "Binary data" : undefined,
        })}`);
        const newResource = this.resourceRepository.create({
            name: createResourceDto.name,
            description: createResourceDto.description,
            entityId: createResourceDto.entityId,
            entityType: createResourceDto.entityType,
            fileUrl: createResourceDto.fileUrl,
            fileSize: createResourceDto.fileSize,
            mimeType: createResourceDto.mimeType,
            type: createResourceDto.type || "other",
            category: createResourceDto.category,
            tags: createResourceDto.tags || [],
            isPublic: createResourceDto.isPublic || false,
            isStoredInDb: createResourceDto.isStoredInDb || false,
            data: createResourceDto.data,
            uploadedAt: new Date(),
            updatedAt: new Date(),
        });
        return this.resourceRepository.save(newResource);
    }
    async findAll(query) {
        this.logger.log(`Finding resources with query: ${JSON.stringify(query)}`);
        const whereClause = {};
        if (query?.entityId) {
            whereClause.entityId = query.entityId;
        }
        if (query?.entityType) {
            whereClause.entityType = query.entityType;
        }
        if (query?.type) {
            whereClause.type = query.type;
        }
        if (query?.category) {
            whereClause.category = query.category;
        }
        return this.resourceRepository.find({
            where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
            order: { uploadedAt: "DESC" },
        });
    }
    async findOne(id) {
        this.logger.log(`Finding resource with id: ${id}`);
        const resource = await this.resourceRepository.findOne({ where: { id } });
        if (!resource) {
            throw new common_1.NotFoundException(`Resource with ID ${id} not found`);
        }
        return resource;
    }
    async update(id, updateResourceDto) {
        this.logger.log(`Updating resource ${id}: ${JSON.stringify({
            ...updateResourceDto,
            data: updateResourceDto.data ? "Binary data" : undefined,
        })}`);
        await this.findOne(id);
        await this.resourceRepository.update(id, updateResourceDto);
        return this.findOne(id);
    }
    async remove(id) {
        this.logger.log(`Removing resource with id: ${id}`);
        const resource = await this.findOne(id);
        await this.resourceRepository.remove(resource);
    }
    async findByEntityId(entityId, entityType) {
        this.logger.log(`Finding resources for entity: ${entityId}, type: ${entityType || "any"}`);
        const whereClause = { entityId };
        if (entityType) {
            whereClause.entityType = entityType;
        }
        return this.resourceRepository.find({
            where: whereClause,
            order: { uploadedAt: "DESC" },
        });
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = ResourcesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resource_entity_1.Resource)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map