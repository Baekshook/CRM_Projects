import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Singer } from "./entities/singer.entity";
import { CreateSingerDto } from "./dto/create-singer.dto";
import { UpdateSingerDto } from "./dto/update-singer.dto";

@Injectable()
export class SingersService {
  constructor(
    @InjectRepository(Singer)
    private singersRepository: Repository<Singer>
  ) {}

  async create(createSingerDto: CreateSingerDto): Promise<Singer> {
    // 이메일 중복 검사
    const existingSinger = await this.singersRepository.findOne({
      where: { email: createSingerDto.email },
    });

    if (existingSinger) {
      throw new ConflictException(
        `이메일 ${createSingerDto.email}는 이미 등록되어 있습니다.`
      );
    }

    const singer = this.singersRepository.create(createSingerDto);
    return this.singersRepository.save(singer);
  }

  async findAll(): Promise<Singer[]> {
    return this.singersRepository.find();
  }

  async findOne(id: string): Promise<Singer> {
    const singer = await this.singersRepository.findOne({ where: { id } });
    if (!singer) {
      throw new NotFoundException(`Singer with ID "${id}" not found`);
    }
    return singer;
  }

  async update(id: string, updateSingerDto: UpdateSingerDto): Promise<Singer> {
    // 이메일이 변경되는 경우 중복 검사
    if (updateSingerDto.email) {
      const existingSinger = await this.singersRepository.findOne({
        where: { email: updateSingerDto.email },
      });

      if (existingSinger && existingSinger.id !== id) {
        throw new ConflictException(
          `이메일 ${updateSingerDto.email}는 이미 다른 가수가 사용 중입니다.`
        );
      }
    }

    const singer = await this.findOne(id);
    Object.assign(singer, updateSingerDto);
    return this.singersRepository.save(singer);
  }

  async remove(id: string): Promise<void> {
    const result = await this.singersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Singer with ID "${id}" not found`);
    }
  }
}
