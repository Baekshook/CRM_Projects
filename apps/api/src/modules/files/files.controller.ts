import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  Query,
  Res,
  StreamableFile,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage, memoryStorage } from "multer";
import * as path from "path";
import * as fs from "fs";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { randomUUID } from "crypto";

@Controller("files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @Body() createFileDto: CreateFileDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    // 파일 정보와 함께 DTO 업데이트
    const dto: CreateFileDto = {
      ...createFileDto,
      filename:
        file.filename || `${uuidv4()}${path.extname(file.originalname)}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      data: file.buffer,
    };

    return this.filesService.create(dto);
  }

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const entityType = req.body.entityType || "default";
          const entityId = req.body.entityId || "default";
          const uploadPath = path.join(
            process.cwd(),
            "uploads",
            entityType,
            entityId
          );

          // 디렉토리가 없으면 생성
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    })
  )
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 })], // 10MB
      })
    )
    file: Express.Multer.File,
    @Body() body: any
  ) {
    const { entityType, entityId, category } = body;
    const storeInDb = body.storeInDb === "true" || body.storeInDb === true;

    let fileData: Buffer = null;

    // 파일을 데이터베이스에 직접 저장할지 결정
    if (storeInDb) {
      // 파일 내용 읽기
      fileData = fs.readFileSync(file.path);
    }

    const createFileDto: CreateFileDto = {
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

  @Post("upload-to-db")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB 제한
      },
      fileFilter: (req, file, callback) => {
        console.log("파일 업로드 요청 수신:", {
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          fieldname: file.fieldname,
        });
        // 파일 유형 검증
        if (
          file.mimetype.startsWith("image/") ||
          file.mimetype === "application/pdf" ||
          file.mimetype === "application/msword" ||
          file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
          file.mimetype === "application/vnd.ms-excel" ||
          file.mimetype ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              `지원하지 않는 파일 형식입니다: ${file.mimetype}`
            ),
            false
          );
        }
      },
    })
  )
  async uploadToDb(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFileDto: CreateFileDto
  ) {
    try {
      console.log("uploadToDb 호출됨 - 요청 데이터:", createFileDto);

      if (!file) {
        console.error("파일이 업로드되지 않았습니다.");
        throw new BadRequestException("파일이 업로드되지 않았습니다.");
      }

      console.log("업로드된 파일 정보:", {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        buffer: file.buffer ? `${file.buffer.length} 바이트` : "없음",
      });

      // 기본값 설정
      const entityType = createFileDto.entityType || "customer";
      const entityId = createFileDto.entityId || randomUUID();
      const category = createFileDto.category || "profile";

      // 버퍼가 비어있는 경우 오류 표시만 하고 계속 진행
      if (!file.buffer || file.buffer.length === 0) {
        console.warn("파일 버퍼가 비어 있습니다. 빈 파일로 처리합니다.");
        file.buffer = Buffer.from([]);
      }

      // 트랜잭션을 사용하여 파일 저장
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

        // 파일 URL 생성
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
      } catch (dbError) {
        console.error("파일 DB 저장 중 오류 발생:", dbError);
        throw new InternalServerErrorException(
          `파일 저장 중 오류 발생: ${dbError.message}`
        );
      }
    } catch (error) {
      console.error("파일 업로드 중 오류 발생:", error);
      throw new InternalServerErrorException(
        `파일 업로드 중 오류 발생: ${error.message}`
      );
    }
  }

  @Post("multi-upload")
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const entityType = req.body.entityType || "default";
          const entityId = req.body.entityId || "default";
          const uploadPath = path.join(
            process.cwd(),
            "uploads",
            entityType,
            entityId
          );

          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }

          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    })
  )
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any
  ) {
    const { entityType, entityId, category } = body;
    const storeInDb = body.storeInDb === "true" || body.storeInDb === true;

    const results = [];

    for (const file of files) {
      let fileData: Buffer = null;

      // 파일을 데이터베이스에 직접 저장할지 결정
      if (storeInDb) {
        // 파일 내용 읽기
        fileData = fs.readFileSync(file.path);
      }

      const createFileDto: CreateFileDto = {
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

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.filesService.findOne(id);
  }

  @Get(":id/data")
  async getFileData(
    @Param("id") id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const file = await this.filesService.findOne(id);
      const fileData = await this.filesService.getFileData(id);

      console.log(
        `파일 ${id} 데이터 요청. 타입: ${file.mimeType}, 크기: ${fileData.length} 바이트`
      );

      // 이미지 타입인 경우 캐싱 헤더 추가
      if (file.mimeType.startsWith("image/")) {
        res.set({
          "Content-Type": file.mimeType,
          "Content-Disposition": `inline; filename="${file.originalName}"`,
          "Cache-Control": "public, max-age=31536000",
          ETag: `"${file.id}_${file.version}"`,
          "X-File-Id": file.id,
        });
      } else {
        res.set({
          "Content-Type": file.mimeType,
          "Content-Disposition": `attachment; filename="${file.originalName}"`,
          "Cache-Control": "no-cache",
          ETag: `"${file.id}_${file.version}"`,
          "X-File-Id": file.id,
        });
      }

      return new StreamableFile(fileData);
    } catch (error) {
      console.error(`파일 데이터 가져오기 실패: ${error.message}`);
      throw error;
    }
  }

  @Get("by-entity/:entityType/:entityId")
  findByEntityId(
    @Param("entityType") entityType: string,
    @Param("entityId") entityId: string
  ) {
    return this.filesService.findByEntityId(entityType, entityId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(id, updateFileDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.filesService.remove(id);
  }
}
