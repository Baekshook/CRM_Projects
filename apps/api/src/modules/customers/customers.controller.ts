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
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { FilesService } from "../files/files.service";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs";
import { v4 as uuidv4 } from "uuid";

@Controller("customers")
export class CustomersController {
  constructor(
    private readonly customersService: CustomersService,
    private readonly filesService: FilesService
  ) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.customersService.remove(id);
  }

  @Post(":id/upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const customerId = req.params.id;
          const uploadPath = path.join(
            process.cwd(),
            "uploads",
            "customers",
            customerId
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
    // 고객이 존재하는지 확인
    await this.customersService.findOne(id);

    const { category } = body;

    // 파일 정보 DB에 저장
    const fileEntity = await this.filesService.create({
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: file.path,
      entityType: "customer",
      entityId: id,
      category,
    });

    // 프로필 이미지인 경우 고객 정보 업데이트
    if (category === "profileImage") {
      await this.customersService.update(id, {
        profileImage: `/uploads/customers/${id}/${file.filename}`,
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
          const customerId = req.params.id;
          const uploadPath = path.join(
            process.cwd(),
            "uploads",
            "customers",
            customerId
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
    // 고객이 존재하는지 확인
    await this.customersService.findOne(id);

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
        entityType: "customer",
        entityId: id,
        category,
      });

      // 프로필 이미지인 경우 고객 정보 업데이트
      if (category === "profileImage") {
        await this.customersService.update(id, {
          profileImage: `/uploads/customers/${id}/${file.filename}`,
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
  async getCustomerFiles(@Param("id") id: string) {
    // 고객이 존재하는지 확인
    await this.customersService.findOne(id);

    // 고객 관련 파일 조회
    const files = await this.filesService.findByEntityId("customer", id);

    return {
      success: true,
      count: files.length,
      files,
    };
  }
}
