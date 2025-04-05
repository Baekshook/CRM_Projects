import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Segment } from "./segments.entity";
import { CreateSegmentDto } from "./dto/create-segment.dto";
import { UpdateSegmentDto } from "./dto/update-segment.dto";

@Injectable()
export class SegmentsService {
  constructor(
    @InjectRepository(Segment)
    private segmentRepository: Repository<Segment>
  ) {}

  async create(createSegmentDto: CreateSegmentDto): Promise<Segment> {
    const segment = this.segmentRepository.create(createSegmentDto);
    return this.segmentRepository.save(segment);
  }

  async findAll(): Promise<Segment[]> {
    return this.segmentRepository.find();
  }

  async findOne(id: string): Promise<Segment> {
    const segment = await this.segmentRepository.findOne({ where: { id } });
    if (!segment) {
      throw new NotFoundException(`Segment with ID "${id}" not found`);
    }
    return segment;
  }

  async update(
    id: string,
    updateSegmentDto: UpdateSegmentDto
  ): Promise<Segment> {
    const segment = await this.findOne(id);
    Object.assign(segment, updateSegmentDto);
    return this.segmentRepository.save(segment);
  }

  async remove(id: string): Promise<void> {
    const result = await this.segmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Segment with ID "${id}" not found`);
    }
  }
}
