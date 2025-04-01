import { Repository } from "typeorm";
import { Request } from "./entities/request.entity";
import { CreateRequestDto } from "./dto/create-request.dto";
import { UpdateRequestDto } from "./dto/update-request.dto";
export declare class RequestsService {
    private requestsRepository;
    constructor(requestsRepository: Repository<Request>);
    create(createRequestDto: CreateRequestDto): Promise<Request>;
    findAll(): Promise<Request[]>;
    findOne(id: string): Promise<Request>;
    update(id: string, updateRequestDto: UpdateRequestDto): Promise<Request>;
    remove(id: string): Promise<void>;
}
