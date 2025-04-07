import { Repository } from "typeorm";
import { Schedule } from "./entities/schedule.entity";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";
export declare class SchedulesService {
    private schedulesRepository;
    private readonly logger;
    constructor(schedulesRepository: Repository<Schedule>);
    create(createScheduleDto: CreateScheduleDto): Promise<Schedule>;
    findAll(query?: any): Promise<Schedule[]>;
    findOne(id: string): Promise<Schedule>;
    update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<Schedule>;
    remove(id: string): Promise<void>;
    findByDate(year: number, month: number, day?: number): Promise<Schedule[]>;
}
