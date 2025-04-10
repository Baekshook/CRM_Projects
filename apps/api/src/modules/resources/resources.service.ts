import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Resource } from "./entities/resource.entity";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";

@Injectable()
export class ResourcesService {
  private readonly logger = new Logger(ResourcesService.name);

  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>
  ) {}

  async create(createResourceDto: CreateResourceDto): Promise<Resource> {
    this.logger.log(
      `Creating resource: ${JSON.stringify({
        ...createResourceDto,
        data: createResourceDto.data ? "Binary data" : undefined,
      })}`
    );

    // 새 리소스 엔티티 생성 및 저장
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

  async findAll(query?: any): Promise<Resource[]> {
    this.logger.log(`Finding resources with query: ${JSON.stringify(query)}`);

    const whereClause: any = {};

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

  async findOne(id: string): Promise<Resource> {
    this.logger.log(`Finding resource with id: ${id}`);
    const resource = await this.resourceRepository.findOne({ where: { id } });
    if (!resource) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
    return resource;
  }

  async update(
    id: string,
    updateResourceDto: UpdateResourceDto
  ): Promise<Resource> {
    this.logger.log(
      `Updating resource ${id}: ${JSON.stringify({
        ...updateResourceDto,
        data: updateResourceDto.data ? "Binary data" : undefined,
      })}`
    );
    await this.findOne(id); // 존재 여부 확인
    await this.resourceRepository.update(id, updateResourceDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing resource with id: ${id}`);
    const resource = await this.findOne(id);
    await this.resourceRepository.remove(resource);
  }

  async findByEntityId(
    entityId: string,
    entityType?: string
  ): Promise<Resource[]> {
    this.logger.log(
      `Finding resources for entity: ${entityId}, type: ${entityType || "any"}`
    );
    const whereClause: any = { entityId };

    if (entityType) {
      whereClause.entityType = entityType;
    }

    return this.resourceRepository.find({
      where: whereClause,
      order: { uploadedAt: "DESC" },
    });
  }
}
