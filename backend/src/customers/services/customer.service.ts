import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { CustomerGradeService } from './customer-grade.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
    private customerGradeService: CustomerGradeService,
  ) {}

  async findAll(query: any): Promise<{
    items: Customer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const take = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * take;

    let queryBuilder = this.customersRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.requests', 'requests')
      .leftJoinAndSelect('customer.notes', 'notes');

    // 검색 조건 적용
    if (query.search) {
      queryBuilder = queryBuilder.where(
        'customer.name LIKE :search OR customer.email LIKE :search OR customer.company LIKE :search',
        { search: `%${query.search}%` },
      );
    }

    // 필터 적용
    if (query.status) {
      queryBuilder = queryBuilder.andWhere('customer.status = :status', {
        status: query.status,
      });
    }

    if (query.grade) {
      queryBuilder = queryBuilder.andWhere('customer.grade = :grade', {
        grade: query.grade,
      });
    }

    const [items, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    // 고객 데이터에 활동 정보 추가
    const enrichedItems = items.map((customer) => {
      // 요청 수만 계산
      const requestCount = customer.requests ? customer.requests.length : 0;

      // 등급이 있는지 확인하고, 없으면 자동 계산
      if (!customer.grade) {
        customer = this.customerGradeService.updateCustomerGrade(customer, {
          requestCount,
        });
      }

      return {
        ...customer,
        requestCount,
      };
    });

    return {
      items: enrichedItems,
      total,
      page: +page,
      limit: +take,
      totalPages: Math.ceil(total / take),
    };
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['requests', 'notes'],
    });

    if (!customer) {
      throw new NotFoundException(`고객 ID ${id}를 찾을 수 없습니다.`);
    }

    // 요청 수만 계산
    const requestCount = customer.requests ? customer.requests.length : 0;

    // 등급 자동 업데이트
    const updatedCustomer = this.customerGradeService.updateCustomerGrade(
      customer,
      {
        requestCount,
      },
    );

    // 등급이 업데이트되었으면 저장
    if (updatedCustomer.grade !== customer.grade) {
      await this.customersRepository.save(updatedCustomer);
    }

    return {
      ...updatedCustomer,
      requestCount,
    };
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const newCustomer = this.customersRepository.create(createCustomerDto);
    // 새 고객은 기본적으로 '신규고객' 등급
    newCustomer.grade = '신규고객';
    return this.customersRepository.save(newCustomer);
  }

  async update(
    id: number,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    // DTO의 필드들로 고객 정보 업데이트
    Object.assign(customer, updateCustomerDto);

    // 활동 정보에 따라 등급 자동 계산 (단, DTO에 등급이 명시되어 있지 않은 경우)
    if (!updateCustomerDto.grade) {
      const requestCount = customer.requests ? customer.requests.length : 0;

      const updatedCustomer = this.customerGradeService.updateCustomerGrade(
        customer,
        {
          requestCount,
        },
      );

      return this.customersRepository.save(updatedCustomer);
    }

    return this.customersRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customersRepository.remove(customer);
  }

  async bulkDelete(ids: number[]): Promise<void> {
    await this.customersRepository.delete(ids);
  }

  async bulkUpdateStatus(ids: number[], status: string): Promise<void> {
    await this.customersRepository.update(ids, { status });
  }
}
