import { SchedulesService } from "./schedules.service";
import { CreateScheduleDto } from "./dto/create-schedule.dto";
import { UpdateScheduleDto } from "./dto/update-schedule.dto";
export declare class SchedulesController {
    private readonly schedulesService;
    private readonly logger;
    constructor(schedulesService: SchedulesService);
    create(createScheduleDto: CreateScheduleDto): Promise<import("./entities/schedule.entity").Schedule>;
    findAll(query: any): Promise<import("./entities/schedule.entity").Schedule[]>;
    findByDate(year: number, month: number, day?: number): Promise<import("./entities/schedule.entity").Schedule[]>;
    findOne(id: string): Promise<import("./entities/schedule.entity").Schedule>;
    update(id: string, updateScheduleDto: UpdateScheduleDto): Promise<import("./entities/schedule.entity").Schedule>;
    remove(id: string): Promise<void>;
}
