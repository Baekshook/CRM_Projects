import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Feedback } from "./entities/feedback.entity";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";

@Injectable()
export class FeedbacksService {
  private readonly logger = new Logger(FeedbacksService.name);

  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    this.logger.log(`Creating feedback: ${JSON.stringify(createFeedbackDto)}`);

    // 데모 용도로 더미 데이터를 반환합니다.
    return {
      id: `feedback-${Date.now()}`,
      customerId: createFeedbackDto.customerId,
      customerName: createFeedbackDto.customerName || "고객명",
      singerId: createFeedbackDto.singerId,
      singerName: createFeedbackDto.singerName,
      rating: createFeedbackDto.rating,
      content: createFeedbackDto.content,
      category: createFeedbackDto.category,
      status: createFeedbackDto.status || "new",
      response: createFeedbackDto.response,
      responseAt: createFeedbackDto.responseAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Feedback;
  }

  async findAll(): Promise<Feedback[]> {
    this.logger.log("Finding all feedbacks");
    return this.feedbackRepository.find();
  }

  async findByCustomerId(customerId: string): Promise<Feedback[]> {
    this.logger.log(`Finding feedbacks for customer: ${customerId}`);
    return this.feedbackRepository.find({ where: { customerId } });
  }

  async findBySingerId(singerId: string): Promise<Feedback[]> {
    this.logger.log(`Finding feedbacks for singer: ${singerId}`);
    return this.feedbackRepository.find({ where: { singerId } });
  }

  async findOne(id: string): Promise<Feedback> {
    this.logger.log(`Finding feedback with id: ${id}`);
    const feedback = await this.feedbackRepository.findOne({ where: { id } });
    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }
    return feedback;
  }

  async update(
    id: string,
    updateFeedbackDto: UpdateFeedbackDto
  ): Promise<Feedback> {
    this.logger.log(
      `Updating feedback ${id}: ${JSON.stringify(updateFeedbackDto)}`
    );
    await this.findOne(id); // 존재 여부 확인
    await this.feedbackRepository.update(id, updateFeedbackDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing feedback with id: ${id}`);
    const feedback = await this.findOne(id);
    await this.feedbackRepository.remove(feedback);
  }

  async respond(id: string, response: string): Promise<Feedback> {
    this.logger.log(`Adding response to feedback ${id}: ${response}`);
    const updateData: UpdateFeedbackDto = {
      response,
      responseAt: new Date(),
      status: "resolved",
    };
    return this.update(id, updateData);
  }
}
