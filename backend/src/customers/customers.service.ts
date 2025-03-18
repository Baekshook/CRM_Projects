import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerNote } from './entities/customer-note.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CreateCustomerNoteDto } from './dto/create-customer-note.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,

    @InjectRepository(CustomerNote)
    private customerNotesRepository: Repository<CustomerNote>,

    private usersService: UsersService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const existingCustomer = await this.customersRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingCustomer) {
      throw new ConflictException('이미 존재하는 이메일입니다.');
    }

    const customer = this.customersRepository.create(createCustomerDto);
    return this.customersRepository.save(customer);
  }

  async findAll(
    status?: string,
    grade?: string,
    search?: string,
  ): Promise<Customer[]> {
    let query = this.customersRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.requests', 'requests');

    if (status && status !== 'all') {
      query = query.andWhere('customer.status = :status', { status });
    }

    if (grade && grade !== 'all') {
      query = query.andWhere('customer.grade = :grade', { grade });
    }

    if (search) {
      query = query.andWhere(
        '(customer.name LIKE :search OR customer.email LIKE :search OR customer.company LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: ['requests', 'notes', 'notes.createdBy'],
    });

    if (!customer) {
      throw new NotFoundException('고객을 찾을 수 없습니다.');
    }

    return customer;
  }

  async update(id: number, updateData: Partial<Customer>): Promise<Customer> {
    const customer = await this.findOne(id);
    Object.assign(customer, updateData);
    return this.customersRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    const result = await this.customersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('고객을 찾을 수 없습니다.');
    }
  }

  async updateStatus(
    ids: number[],
    status: 'active' | 'inactive',
  ): Promise<void> {
    await this.customersRepository.update({ id: In(ids) }, { status });
  }

  async addNote(
    customerId: number,
    createNoteDto: CreateCustomerNoteDto,
  ): Promise<CustomerNote> {
    const customer = await this.findOne(customerId);

    const note = this.customerNotesRepository.create({
      content: createNoteDto.content,
      customer,
    });

    if (createNoteDto.createdById) {
      const user = await this.usersService.findOne(createNoteDto.createdById);
      note.createdBy = user;
    }

    return this.customerNotesRepository.save(note);
  }

  async removeNote(noteId: number): Promise<void> {
    const result = await this.customerNotesRepository.delete(noteId);
    if (result.affected === 0) {
      throw new NotFoundException('노트를 찾을 수 없습니다.');
    }
  }
}
