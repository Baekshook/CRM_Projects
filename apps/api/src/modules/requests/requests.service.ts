import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Request } from "./entities/request.entity";
import { CreateRequestDto } from "./dto/create-request.dto";
import { UpdateRequestDto } from "./dto/update-request.dto";

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>
  ) {}

  async create(createRequestDto: CreateRequestDto): Promise<Request> {
    const request = this.requestsRepository.create(createRequestDto);
    return this.requestsRepository.save(request);
  }

  async findAll(): Promise<Request[]> {
    return this.requestsRepository.find({
      relations: ["customer", "singer"],
    });
  }

  async findOne(id: string): Promise<Request> {
    const request = await this.requestsRepository.findOne({
      where: { id },
      relations: ["customer", "singer"],
    });
    if (!request) {
      throw new NotFoundException(`Request with ID "${id}" not found`);
    }
    return request;
  }

  async update(
    id: string,
    updateRequestDto: UpdateRequestDto
  ): Promise<Request> {
    const request = await this.findOne(id);
    Object.assign(request, updateRequestDto);
    return this.requestsRepository.save(request);
  }

  async remove(id: string): Promise<void> {
    const result = await this.requestsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Request with ID "${id}" not found`);
    }
  }
}
