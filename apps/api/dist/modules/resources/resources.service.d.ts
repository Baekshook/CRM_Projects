import { Repository } from "typeorm";
import { Resource } from "./entities/resource.entity";
import { CreateResourceDto } from "./dto/create-resource.dto";
import { UpdateResourceDto } from "./dto/update-resource.dto";
export declare class ResourcesService {
    private readonly resourceRepository;
    private readonly logger;
    constructor(resourceRepository: Repository<Resource>);
    create(createResourceDto: CreateResourceDto): Promise<Resource>;
    findAll(query?: any): Promise<Resource[]>;
    findOne(id: string): Promise<Resource>;
    update(id: string, updateResourceDto: UpdateResourceDto): Promise<Resource>;
    remove(id: string): Promise<void>;
    findByEntityId(entityId: string, entityType?: string): Promise<Resource[]>;
}
