import { SegmentsService } from "./segments.service";
import { CreateSegmentDto } from "./dto/create-segment.dto";
import { UpdateSegmentDto } from "./dto/update-segment.dto";
export declare class SegmentsController {
    private readonly segmentsService;
    private readonly logger;
    constructor(segmentsService: SegmentsService);
    create(createSegmentDto: CreateSegmentDto): Promise<import("./segments.entity").Segment>;
    findAll(): Promise<import("./segments.entity").Segment[]>;
    findOne(id: string): Promise<import("./segments.entity").Segment>;
    update(id: string, updateSegmentDto: UpdateSegmentDto): Promise<import("./segments.entity").Segment>;
    remove(id: string): Promise<void>;
}
