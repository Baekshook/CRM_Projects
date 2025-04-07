import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Contract } from "./entities/contract.entity";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { SignContractDto } from "./dto/sign-contract.dto";

@Injectable()
export class ContractsService {
  private readonly logger = new Logger(ContractsService.name);

  constructor(
    @InjectRepository(Contract)
    private readonly contractsRepository: Repository<Contract>
  ) {}

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    const contract = this.contractsRepository.create(createContractDto);
    return this.contractsRepository.save(contract);
  }

  async findAll(query?: any): Promise<Contract[]> {
    const options: any = {
      relations: ["schedule", "customer", "singer"],
    };

    // 상태 필터링
    if (query && query.status && query.status !== "all") {
      options.where = { ...options.where, contractStatus: query.status };
    }

    return this.contractsRepository.find(options);
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractsRepository.findOne({
      where: { id },
      relations: ["schedule", "customer", "singer"],
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID "${id}" not found`);
    }

    return contract;
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto
  ): Promise<Contract> {
    const contract = await this.findOne(id);
    Object.assign(contract, updateContractDto);
    return this.contractsRepository.save(contract);
  }

  async remove(id: string): Promise<void> {
    const result = await this.contractsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contract with ID "${id}" not found`);
    }
  }

  async sign(id: string, signContractDto: SignContractDto): Promise<Contract> {
    const contract = await this.findOne(id);

    // 계약서 상태 업데이트
    contract.contractStatus = "signed";
    contract.signedAt = new Date().toISOString();

    // 서명 정보가 있다면 저장
    if (signContractDto.signature) {
      // contract.signature 속성이 엔티티에 없으므로 임시 방편으로 metadata에 저장
      if (!contract.metadata) {
        contract.metadata = {};
      }
      contract.metadata.signature = signContractDto.signature;
      if (signContractDto.signerName) {
        contract.metadata.signerName = signContractDto.signerName;
      }
      if (signContractDto.signerRole) {
        contract.metadata.signerRole = signContractDto.signerRole;
      }
    }

    return this.contractsRepository.save(contract);
  }

  // 통계 관련 메서드
  async getMonthlyStats() {
    this.logger.log("Getting monthly contract stats");
    // 실제 구현에서는 월별 통계 데이터를 계산하여 반환
    return {
      labels: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
      ],
      datasets: [
        {
          label: "계약 수",
          data: [12, 19, 3, 5, 2, 3, 8, 9, 15, 12, 8, 10],
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "계약 금액 (백만원)",
          data: [120, 190, 30, 50, 20, 30, 80, 90, 150, 120, 80, 100],
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1,
        },
      ],
    };
  }

  async getCategoryStats() {
    this.logger.log("Getting category contract stats");
    // 실제 구현에서는 카테고리별 통계 데이터를 계산하여 반환
    return {
      labels: ["대형 공연", "소형 공연", "행사", "축제", "기타"],
      datasets: [
        {
          label: "카테고리별 계약 수",
          data: [12, 19, 3, 5, 2],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  async getTypeStats() {
    this.logger.log("Getting type contract stats");
    // 실제 구현에서는 유형별 통계 데이터를 계산하여 반환
    return {
      labels: ["공연", "행사", "축제", "프로모션", "기업행사"],
      datasets: [
        {
          label: "유형별 계약 수",
          data: [12, 19, 3, 5, 2],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  async getQuarterlyStats() {
    this.logger.log("Getting quarterly contract stats");
    // 실제 구현에서는 분기별 통계 데이터를 계산하여 반환
    return [
      {
        quarter: "2024 Q1",
        contractCount: 45,
        totalAmount: 450000000,
        averageAmount: 10000000,
      },
      {
        quarter: "2024 Q2",
        contractCount: 38,
        totalAmount: 380000000,
        averageAmount: 10000000,
      },
      {
        quarter: "2024 Q3",
        contractCount: 42,
        totalAmount: 420000000,
        averageAmount: 10000000,
      },
      {
        quarter: "2024 Q4",
        contractCount: 50,
        totalAmount: 500000000,
        averageAmount: 10000000,
      },
    ];
  }

  async getTopCustomers(limit: number = 5) {
    this.logger.log(`Getting top ${limit} customers by contract amount`);
    // 실제 구현에서는 최다 계약 고객 데이터를 계산하여 반환
    return [
      { name: "김민수", totalAmount: 50000000, contractCount: 5 },
      { name: "이지영", totalAmount: 45000000, contractCount: 4 },
      { name: "박준호", totalAmount: 40000000, contractCount: 4 },
      { name: "최서연", totalAmount: 35000000, contractCount: 3 },
      { name: "정민재", totalAmount: 30000000, contractCount: 3 },
    ].slice(0, limit);
  }

  async getTopSingers(limit: number = 5) {
    this.logger.log(`Getting top ${limit} singers by contract amount`);
    // 실제 구현에서는 최다 계약 가수 데이터를 계산하여 반환
    return [
      { name: "가수A", totalAmount: 60000000, contractCount: 6 },
      { name: "가수B", totalAmount: 55000000, contractCount: 5 },
      { name: "가수C", totalAmount: 50000000, contractCount: 5 },
      { name: "가수D", totalAmount: 45000000, contractCount: 4 },
      { name: "가수E", totalAmount: 40000000, contractCount: 4 },
    ].slice(0, limit);
  }
}
