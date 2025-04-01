import { Repository } from "typeorm";
import { Singer } from "./entities/singer.entity";
import { CreateSingerDto } from "./dto/create-singer.dto";
import { UpdateSingerDto } from "./dto/update-singer.dto";
export declare class SingersService {
    private singersRepository;
    constructor(singersRepository: Repository<Singer>);
    create(createSingerDto: CreateSingerDto): Promise<Singer>;
    findAll(): Promise<Singer[]>;
    findOne(id: string): Promise<Singer>;
    update(id: string, updateSingerDto: UpdateSingerDto): Promise<Singer>;
    remove(id: string): Promise<void>;
}
