import { Repository } from "typeorm";
import { Segment } from "./segments.entity";
import { CreateSegmentDto } from "./dto/create-segment.dto";
import { UpdateSegmentDto } from "./dto/update-segment.dto";
export declare class SegmentsService {
    private segmentRepository;
    constructor(segmentRepository: Repository<Segment>);
    create(createSegmentDto: CreateSegmentDto): Promise<Segment>;
    findAll(): Promise<Segment[]>;
    findOne(id: string): Promise<Segment>;
    update(id: string, updateSegmentDto: UpdateSegmentDto): Promise<Segment>;
    remove(id: string): Promise<void>;
}
