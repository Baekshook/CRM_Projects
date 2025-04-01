import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { File } from "./entities/file.entity";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import * as fs from "fs-extra";
import * as path from "path";

// 파일 시스템 기반 함수들
const ensureDirExists = async (dirPath: string): Promise<void> => {
  await fs.ensureDir(dirPath);
};

@Injectable()
export class FilesService {
  private readonly uploadDir = path.join(process.cwd(), "uploads");

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>
  ) {
    // 업로드 디렉토리 생성
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists(): Promise<void> {
    try {
      await ensureDirExists(this.uploadDir);
      console.log(`업로드 디렉토리 생성/확인됨: ${this.uploadDir}`);
    } catch (error) {
      console.error(`업로드 디렉토리 생성 중 오류: ${error.message}`);
      throw error;
    }
  }

  async create(createFileDto: CreateFileDto): Promise<File> {
    const file = this.filesRepository.create(createFileDto);

    try {
      // 데이터베이스에 파일 정보 저장
      const savedFile = await this.filesRepository.save(file);
      console.log(
        `파일 생성됨 - ID: ${savedFile.id}, 이름: ${savedFile.filename}`
      );

      // 데이터가 있고 파일 시스템에 저장해야 하는 경우
      if (savedFile.data && !savedFile.isStoredInDb) {
        const filePath = path.join(this.uploadDir, savedFile.id);
        await fs.writeFile(filePath, savedFile.data);

        // 파일 경로 업데이트
        savedFile.path = filePath;
        await this.filesRepository.save(savedFile);
        console.log(`파일 내용이 파일 시스템에도 저장됨: ${filePath}`);
      }

      return savedFile;
    } catch (error) {
      console.error(`파일 생성 중 오류: ${error.message}`);
      throw error;
    }
  }

  async createFromBuffer(
    buffer: Buffer,
    fileInfo: Partial<CreateFileDto>
  ): Promise<File> {
    // buffer가 undefined인 경우 방어 코드 추가
    if (!buffer) {
      console.error("파일 버퍼가 undefined입니다.");
      buffer = Buffer.from([]); // 빈 버퍼 생성
    }

    // 디버깅을 위한 로깅 추가
    console.log("파일 정보:", {
      fileName: fileInfo.filename,
      originalName: fileInfo.originalName,
      mimeType: fileInfo.mimeType,
      entityType: fileInfo.entityType,
      entityId: fileInfo.entityId,
      bufferSize: buffer ? buffer.length : 0,
    });

    // DB에 저장할 파일 정보 생성
    const createFileDto: CreateFileDto = {
      filename: fileInfo.filename || `unknown-${Date.now()}.bin`,
      originalName: fileInfo.originalName || "unknown",
      mimeType: fileInfo.mimeType || "application/octet-stream",
      size: buffer.length,
      path: fileInfo.path || "",
      entityType: fileInfo.entityType || "default",
      entityId: fileInfo.entityId || "default",
      category: fileInfo.category || "default",
      data: buffer,
    };

    return this.create(createFileDto);
  }

  async findAll(): Promise<File[]> {
    return this.filesRepository.find({
      select: [
        "id",
        "filename",
        "originalName",
        "mimeType",
        "size",
        "path",
        "entityType",
        "entityId",
        "category",
        "uploadedAt",
        "isStoredInDb",
      ],
    });
  }

  async findOne(id: string): Promise<File> {
    const file = await this.filesRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException(`File with ID ${id} not found`);
    }
    return file;
  }

  async getFileData(id: string): Promise<Buffer> {
    const file = await this.findOne(id);

    try {
      // DB에 저장된 파일인 경우
      if (file.isStoredInDb && file.data) {
        console.log(
          `파일 ID ${id}: DB에서 데이터 반환 중, 크기 ${file.data.length} 바이트`
        );
        return file.data;
      }

      // 파일 시스템에 저장된 파일인 경우
      if (file.path) {
        try {
          console.log(
            `파일 ID ${id}: 파일 시스템에서 데이터 반환 중, 경로 ${file.path}`
          );
          const data = await fs.readFile(file.path);

          // 파일 시스템에서 읽은 데이터를 DB에도 저장 (추후 빠른 접근을 위해)
          if (!file.isStoredInDb) {
            file.data = data;
            file.isStoredInDb = true;
            await this.filesRepository.save(file);
            console.log(`파일 ID ${id}: 데이터를 DB에도 저장함`);
          }

          return data;
        } catch (err) {
          console.error(
            `파일 ID ${id}: 파일 시스템에서 읽기 실패: ${err.message}`
          );
          throw new NotFoundException(`파일을 찾을 수 없습니다: ${file.path}`);
        }
      }

      // 데이터가 없는 경우
      console.error(`파일 ID ${id}: 데이터나 경로가 없음`);
      throw new NotFoundException(`파일 데이터를 찾을 수 없습니다`);
    } catch (error) {
      console.error(`파일 ID ${id} 데이터 가져오기 중 오류: ${error.message}`);
      throw error;
    }
  }

  async findByEntityId(entityType: string, entityId: string): Promise<File[]> {
    return this.filesRepository.find({
      where: { entityType, entityId },
      select: [
        "id",
        "filename",
        "originalName",
        "mimeType",
        "size",
        "path",
        "entityType",
        "entityId",
        "category",
        "uploadedAt",
        "isStoredInDb",
      ],
    });
  }

  async update(id: string, updateFileDto: UpdateFileDto): Promise<File> {
    const file = await this.findOne(id);

    // 파일 데이터가 있으면 업데이트
    if (updateFileDto.data) {
      // DB에 저장
      file.data = updateFileDto.data;
      file.isStoredInDb = true;

      // 파일 시스템에도 저장
      if (file.path && fs.existsSync(path.dirname(file.path))) {
        try {
          await fs.writeFile(file.path, updateFileDto.data);
        } catch (error) {
          console.error("파일 업데이트 오류:", error);
        }
      }
    }

    const updatedFile = this.filesRepository.merge(file, updateFileDto);
    return this.filesRepository.save(updatedFile);
  }

  async remove(id: string): Promise<void> {
    const file = await this.findOne(id);

    // 파일 시스템에서 파일 삭제
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await this.filesRepository.remove(file);
  }
}
