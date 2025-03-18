import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { CreateRequestDto } from './dto/create-request.dto';
import { CustomersService } from '../customers/customers.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestsRepository: Repository<Request>,
    private customersService: CustomersService,
    private usersService: UsersService,
  ) {}

  async create(createRequestDto: CreateRequestDto): Promise<Request> {
    const customer = await this.customersService.findOne(
      createRequestDto.customerId,
    );

    const request = this.requestsRepository.create({
      title: createRequestDto.title,
      content: createRequestDto.content,
      status: createRequestDto.status || 'open',
      priority: createRequestDto.priority || 'medium',
      customer,
    });

    if (createRequestDto.assignedToId) {
      const user = await this.usersService.findOne(
        createRequestDto.assignedToId,
      );
      request.assignedTo = user;
    }

    return this.requestsRepository.save(request);
  }

  async findAll(
    status?: string,
    priority?: string,
    customerId?: number,
    assignedToId?: number,
  ): Promise<Request[]> {
    let query = this.requestsRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.customer', 'customer')
      .leftJoinAndSelect('request.assignedTo', 'assignedTo');

    if (status && status !== 'all') {
      query = query.andWhere('request.status = :status', { status });
    }

    if (priority && priority !== 'all') {
      query = query.andWhere('request.priority = :priority', { priority });
    }

    if (customerId) {
      query = query.andWhere('request.customer_id = :customerId', {
        customerId,
      });
    }

    if (assignedToId) {
      query = query.andWhere('request.assigned_to = :assignedToId', {
        assignedToId,
      });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Request> {
    const request = await this.requestsRepository.findOne({
      where: { id },
      relations: ['customer', 'assignedTo'],
    });

    if (!request) {
      throw new NotFoundException('요청을 찾을 수 없습니다.');
    }

    return request;
  }

  async update(id: number, updateData: Partial<Request>): Promise<Request> {
    const request = await this.findOne(id);
    Object.assign(request, updateData);
    return this.requestsRepository.save(request);
  }

  async remove(id: number): Promise<void> {
    const result = await this.requestsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('요청을 찾을 수 없습니다.');
    }
  }

  async assignUser(requestId: number, userId: number): Promise<Request> {
    const request = await this.findOne(requestId);
    const user = await this.usersService.findOne(userId);

    request.assignedTo = user;
    return this.requestsRepository.save(request);
  }

  async updateStatus(requestId: number, status: string): Promise<Request> {
    const request = await this.findOne(requestId);
    request.status = status;
    return this.requestsRepository.save(request);
  }
}
