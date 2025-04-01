import { SingersService } from "./singers.service";
import { CreateSingerDto } from "./dto/create-singer.dto";
import { UpdateSingerDto } from "./dto/update-singer.dto";
import { FilesService } from "../files/files.service";
export declare class SingersController {
    private readonly singersService;
    private readonly filesService;
    constructor(singersService: SingersService, filesService: FilesService);
    create(createSingerDto: CreateSingerDto): Promise<import("./entities/singer.entity").Singer>;
    findAll(): Promise<import("./entities/singer.entity").Singer[]>;
    findOne(id: string): Promise<import("./entities/singer.entity").Singer>;
    update(id: string, updateSingerDto: UpdateSingerDto): Promise<import("./entities/singer.entity").Singer>;
    remove(id: string): Promise<void>;
    uploadFile(id: string, file: Express.Multer.File, body: any): Promise<{
        success: boolean;
        file: import("../files/entities/file.entity").File;
    }>;
    uploadMultipleFiles(id: string, files: Express.Multer.File[], body: any): Promise<{
        success: boolean;
        count: number;
        files: any[];
    }>;
    getSingerFiles(id: string): Promise<{
        success: boolean;
        count: number;
        files: import("../files/entities/file.entity").File[];
    }>;
}
