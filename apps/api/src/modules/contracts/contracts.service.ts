import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Contract } from "./entities/contract.entity";

// dummy placeholder for DTO to avoid type errors
class CreateContractDto {
  customerId?: string;
  customerName?: string;
  singerId?: string;
  singerName?: string;
  eventTitle?: string;
}

@Injectable()
export class ContractsService {
  private readonly logger = new Logger(ContractsService.name);

  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>
  ) {}

  async findAll(): Promise<Contract[]> {
    this.logger.log("Finding all contracts");
    return this.contractRepository.find();
  }

  async findOne(id: string): Promise<Contract> {
    this.logger.log(`Finding contract with id: ${id}`);
    const contract = await this.contractRepository.findOne({ where: { id } });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    this.logger.log(`Creating contract: ${JSON.stringify(createContractDto)}`);

    // 데모 용도로 더미 데이터를 반환합니다.
    // 실제 구현에서는 데이터베이스에 저장해야 합니다.
    return {
      id: "1",
      customerId: createContractDto.customerId || "1",
      customerName: createContractDto.customerName || "고객명",
      singerId: createContractDto.singerId || "1",
      singerName: createContractDto.singerName || "가수명",
      eventTitle: createContractDto.eventTitle || "이벤트 제목",
      eventDate: new Date().toISOString(),
      contractAmount: "1000000",
      paymentStatus: "unpaid",
      contractStatus: "draft",
      matchId: "1",
      scheduleId: "1",
      requestId: "1",
      singerAgency: "소속사",
      venue: "장소",
      createdAt: new Date(),
      signedAt: null,
    } as Contract;
  }

  async update(id: string, updateContractDto: any): Promise<Contract> {
    this.logger.log(
      `Updating contract ${id}: ${JSON.stringify(updateContractDto)}`
    );
    await this.findOne(id); // 존재 여부 확인
    await this.contractRepository.update(id, updateContractDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing contract with id: ${id}`);
    const contract = await this.findOne(id);
    await this.contractRepository.remove(contract);
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
