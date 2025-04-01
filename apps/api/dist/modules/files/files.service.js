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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const file_entity_1 = require("./entities/file.entity");
const fs = require("fs-extra");
const path = require("path");
const ensureDirExists = async (dirPath) => {
    await fs.ensureDir(dirPath);
};
let FilesService = class FilesService {
    constructor(filesRepository) {
        this.filesRepository = filesRepository;
        this.uploadDir = path.join(process.cwd(), "uploads");
        this.ensureUploadDirExists();
    }
    async ensureUploadDirExists() {
        try {
            await ensureDirExists(this.uploadDir);
            console.log(`업로드 디렉토리 생성/확인됨: ${this.uploadDir}`);
        }
        catch (error) {
            console.error(`업로드 디렉토리 생성 중 오류: ${error.message}`);
            throw error;
        }
    }
    async create(createFileDto) {
        const file = this.filesRepository.create(createFileDto);
        try {
            const savedFile = await this.filesRepository.save(file);
            console.log(`파일 생성됨 - ID: ${savedFile.id}, 이름: ${savedFile.filename}`);
            if (savedFile.data && !savedFile.isStoredInDb) {
                const filePath = path.join(this.uploadDir, savedFile.id);
                await fs.writeFile(filePath, savedFile.data);
                savedFile.path = filePath;
                await this.filesRepository.save(savedFile);
                console.log(`파일 내용이 파일 시스템에도 저장됨: ${filePath}`);
            }
            return savedFile;
        }
        catch (error) {
            console.error(`파일 생성 중 오류: ${error.message}`);
            throw error;
        }
    }
    async createFromBuffer(buffer, fileInfo) {
        if (!buffer) {
            console.error("파일 버퍼가 undefined입니다.");
            buffer = Buffer.from([]);
        }
        console.log("파일 정보:", {
            fileName: fileInfo.filename,
            originalName: fileInfo.originalName,
            mimeType: fileInfo.mimeType,
            entityType: fileInfo.entityType,
            entityId: fileInfo.entityId,
            bufferSize: buffer ? buffer.length : 0,
        });
        const createFileDto = {
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
    async findAll() {
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
    async findOne(id) {
        const file = await this.filesRepository.findOne({ where: { id } });
        if (!file) {
            throw new common_1.NotFoundException(`File with ID ${id} not found`);
        }
        return file;
    }
    async getFileData(id) {
        const file = await this.findOne(id);
        try {
            if (file.isStoredInDb && file.data) {
                console.log(`파일 ID ${id}: DB에서 데이터 반환 중, 크기 ${file.data.length} 바이트`);
                return file.data;
            }
            if (file.path) {
                try {
                    console.log(`파일 ID ${id}: 파일 시스템에서 데이터 반환 중, 경로 ${file.path}`);
                    const data = await fs.readFile(file.path);
                    if (!file.isStoredInDb) {
                        file.data = data;
                        file.isStoredInDb = true;
                        await this.filesRepository.save(file);
                        console.log(`파일 ID ${id}: 데이터를 DB에도 저장함`);
                    }
                    return data;
                }
                catch (err) {
                    console.error(`파일 ID ${id}: 파일 시스템에서 읽기 실패: ${err.message}`);
                    throw new common_1.NotFoundException(`파일을 찾을 수 없습니다: ${file.path}`);
                }
            }
            console.error(`파일 ID ${id}: 데이터나 경로가 없음`);
            throw new common_1.NotFoundException(`파일 데이터를 찾을 수 없습니다`);
        }
        catch (error) {
            console.error(`파일 ID ${id} 데이터 가져오기 중 오류: ${error.message}`);
            throw error;
        }
    }
    async findByEntityId(entityType, entityId) {
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
    async update(id, updateFileDto) {
        const file = await this.findOne(id);
        if (updateFileDto.data) {
            file.data = updateFileDto.data;
            file.isStoredInDb = true;
            if (file.path && fs.existsSync(path.dirname(file.path))) {
                try {
                    await fs.writeFile(file.path, updateFileDto.data);
                }
                catch (error) {
                    console.error("파일 업데이트 오류:", error);
                }
            }
        }
        const updatedFile = this.filesRepository.merge(file, updateFileDto);
        return this.filesRepository.save(updatedFile);
    }
    async remove(id) {
        const file = await this.findOne(id);
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        await this.filesRepository.remove(file);
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(file_entity_1.File)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FilesService);
//# sourceMappingURL=files.service.js.map