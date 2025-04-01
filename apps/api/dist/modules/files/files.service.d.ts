import { Repository } from "typeorm";
import { File } from "./entities/file.entity";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
export declare class FilesService {
    private filesRepository;
    private readonly uploadDir;
    constructor(filesRepository: Repository<File>);
    private ensureUploadDirExists;
    create(createFileDto: CreateFileDto): Promise<File>;
    createFromBuffer(buffer: Buffer, fileInfo: Partial<CreateFileDto>): Promise<File>;
    findAll(): Promise<File[]>;
    findOne(id: string): Promise<File>;
    getFileData(id: string): Promise<Buffer>;
    findByEntityId(entityType: string, entityId: string): Promise<File[]>;
    update(id: string, updateFileDto: UpdateFileDto): Promise<File>;
    remove(id: string): Promise<void>;
}
