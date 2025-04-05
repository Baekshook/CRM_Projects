import { ResourcesService } from "./resources.service";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
export declare class ResourcesController {
    private readonly resourcesService;
    private readonly logger;
    constructor(resourcesService: ResourcesService);
    create(createResourceDto: CreateResourceDto): Promise<import("./entities/resource.entity").Resource>;
    uploadFile(file: Express.Multer.File, body: any): Promise<import("./entities/resource.entity").Resource>;
    findAll(entityId?: string, entityType?: string, type?: string, category?: string): Promise<import("./entities/resource.entity").Resource[]>;
    findOne(id: string): Promise<import("./entities/resource.entity").Resource>;
    update(id: string, updateResourceDto: UpdateResourceDto): Promise<import("./entities/resource.entity").Resource>;
    remove(id: string): Promise<void>;
    private determineFileType;
}
