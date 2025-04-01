import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Customer } from "./entities/customer.entity";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // 이메일 중복 검사
    const existingCustomer = await this.customersRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new ConflictException(
        `이메일 ${createCustomerDto.email}는 이미 등록되어 있습니다.`
      );
    }

    const customer = this.customersRepository.create(createCustomerDto);
    return this.customersRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return this.customersRepository.find();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }
    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto
  ): Promise<Customer> {
    // 이메일이 변경되는 경우 중복 검사
    if (updateCustomerDto.email) {
      const existingCustomer = await this.customersRepository.findOne({
        where: { email: updateCustomerDto.email },
      });

      if (existingCustomer && existingCustomer.id !== id) {
        throw new ConflictException(
          `이메일 ${updateCustomerDto.email}는 이미 다른 고객이 사용 중입니다.`
        );
      }
    }

    const customer = await this.findOne(id);
    Object.assign(customer, updateCustomerDto);
    return this.customersRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const result = await this.customersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }
  }
}
