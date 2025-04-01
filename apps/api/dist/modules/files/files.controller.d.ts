import { StreamableFile } from "@nestjs/common";
import { FilesService } from "./files.service";
import { CreateFileDto } from "./dto/create-file.dto";
import { UpdateFileDto } from "./dto/update-file.dto";
import { Response } from "express";
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    create(createFileDto: CreateFileDto, file: Express.Multer.File): Promise<import("./entities/file.entity").File>;
    upload(file: Express.Multer.File, body: any): Promise<import("./entities/file.entity").File>;
    uploadToDb(file: Express.Multer.File, createFileDto: CreateFileDto): Promise<{
        id: string;
        filename: string;
        originalName: string;
        mimeType: string;
        size: number;
        entityType: string;
        entityId: string;
        category: string;
        uploadedAt: Date;
        fileUrl: string;
    }>;
    uploadMultiple(files: Express.Multer.File[], body: any): Promise<{
        success: boolean;
        count: number;
        files: any[];
    }>;
    findAll(): Promise<import("./entities/file.entity").File[]>;
    findOne(id: string): Promise<import("./entities/file.entity").File>;
    getFileData(id: string, res: Response): Promise<StreamableFile>;
    findByEntityId(entityType: string, entityId: string): Promise<import("./entities/file.entity").File[]>;
    update(id: string, updateFileDto: UpdateFileDto): Promise<import("./entities/file.entity").File>;
    remove(id: string): Promise<void>;
}
