import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { ResourcesService } from "./resources.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";

@Controller("resources")
export class ResourcesController {
  private readonly logger = new Logger(ResourcesController.name);

  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  async create(@Body() createResourceDto: CreateResourceDto) {
    this.logger.log(
      `Creating resource: ${JSON.stringify({
        ...createResourceDto,
        data: createResourceDto.data ? "Binary data" : undefined,
      })}`
    );
    return this.resourcesService.create(createResourceDto);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })], // 10MB 제한
      })
    )
    file: Express.Multer.File,
    @Body() body: any
  ) {
    this.logger.log(
      `Uploading file: ${file.originalname}, size: ${file.size}, type: ${file.mimetype}`
    );
    this.logger.log(`Upload metadata: ${JSON.stringify(body)}`);

    // 파일 타입 결정
    const type = this.determineFileType(file.mimetype);

    // 리소스 생성 DTO 구성
    const createResourceDto: CreateResourceDto = {
      name: file.originalname,
      description: body.description,
      entityId: body.entityId,
      entityType: body.entityType || "singer", // 기본값은 'singer'
      fileUrl: `/uploads/${file.filename}`, // 실제 파일 시스템 경로
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

  @Get()
  async findAll(
    @Query("entityId") entityId?: string,
    @Query("entityType") entityType?: string,
    @Query("type") type?: string,
    @Query("category") category?: string
  ) {
    this.logger.log(
      `Finding resources with query: ${JSON.stringify({
        entityId,
        entityType,
        type,
        category,
      })}`
    );

    if (entityId) {
      return this.resourcesService.findByEntityId(entityId, entityType);
    }

    return this.resourcesService.findAll({ entityType, type, category });
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    this.logger.log(`Finding resource with id: ${id}`);
    return this.resourcesService.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() updateResourceDto: UpdateResourceDto
  ) {
    this.logger.log(
      `Updating resource ${id}: ${JSON.stringify({
        ...updateResourceDto,
        data: updateResourceDto.data ? "Binary data" : undefined,
      })}`
    );
    return this.resourcesService.update(id, updateResourceDto);
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    this.logger.log(`Removing resource with id: ${id}`);
    return this.resourcesService.remove(id);
  }

  // 파일 타입 결정 헬퍼 메서드
  private determineFileType(
    mimeType: string
  ): "image" | "audio" | "video" | "document" | "other" {
    if (mimeType.startsWith("image/")) {
      return "image";
    } else if (mimeType.startsWith("audio/")) {
      return "audio";
    } else if (mimeType.startsWith("video/")) {
      return "video";
    } else if (
      mimeType === "application/pdf" ||
      mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimeType === "application/vnd.ms-excel" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      mimeType === "application/vnd.ms-powerpoint" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return "document";
    }
    return "other";
  }
}
