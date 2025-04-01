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
} from "@nestjs/common";
import { SingersService } from "./singers.service";
import { CreateSingerDto } from "./dto/create-singer.dto";
import { UpdateSingerDto } from "./dto/update-singer.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { FilesService } from "../files/files.service";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

@Controller("singers")
export class SingersController {
  constructor(
    private readonly singersService: SingersService,
    private readonly filesService: FilesService
  ) {}

  @Post()
  create(@Body() createSingerDto: CreateSingerDto) {
    return this.singersService.create(createSingerDto);
  }

  @Get()
  findAll() {
    return this.singersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.singersService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateSingerDto: UpdateSingerDto) {
    return this.singersService.update(id, updateSingerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.singersService.remove(id);
  }

  @Post(":id/upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const singerId = req.params.id;
          const uploadPath = path.join(
            process.cwd(),
            "uploads",
            "singers",
            singerId
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
  async uploadFile(
    @Param("id") id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    // 가수가 존재하는지 확인
    await this.singersService.findOne(id);

    const { category } = body;

    // 파일 정보 DB에 저장
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

    // 프로필 이미지인 경우 가수 정보 업데이트
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

  @Post(":id/attachments")
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const singerId = req.params.id;
          const uploadPath = path.join(
            process.cwd(),
            "uploads",
            "singers",
            singerId
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
  async uploadMultipleFiles(
    @Param("id") id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any
  ) {
    // 가수가 존재하는지 확인
    await this.singersService.findOne(id);

    const results = [];

    for (const file of files) {
      const category =
        body[`category_${file.originalname}`] || body.category || "other";

      // 파일 정보 DB에 저장
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

      // 프로필 이미지인 경우 가수 정보 업데이트
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

  @Get(":id/files")
  async getSingerFiles(@Param("id") id: string) {
    // 가수가 존재하는지 확인
    await this.singersService.findOne(id);

    // 가수 관련 파일 조회
    const files = await this.filesService.findByEntityId("singer", id);

    return {
      success: true,
      count: files.length,
      files,
    };
  }
}
