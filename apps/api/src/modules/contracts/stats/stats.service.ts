import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Contract } from "../entities/contract.entity";

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepo: Repository<Contract>
  ) {}

  async getMonthlyStats(year: number) {
    const currentYear = year || new Date().getFullYear();

    // 월별 계약 통계 데이터 쿼리
    const result = await this.contractRepo
      .createQueryBuilder("contract")
      .select("EXTRACT(MONTH FROM contract.signedAt)", "month")
      .addSelect("COUNT(contract.id)", "count")
      .addSelect("SUM(contract.amount)", "amount")
      .where("EXTRACT(YEAR FROM contract.signedAt) = :year", {
        year: currentYear,
      })
      .groupBy("month")
      .orderBy("month", "ASC")
      .getRawMany();

    // 월별 데이터 형식 지정 (1월부터 12월까지)
    const monthlyStats = Array(12)
      .fill(0)
      .map((_, index) => ({
        month: index + 1,
        count: 0,
        amount: 0,
      }));

    // 쿼리 결과를 월별 데이터에 매핑
    result.forEach((item) => {
      const monthIndex = parseInt(item.month) - 1;
      monthlyStats[monthIndex] = {
        month: parseInt(item.month),
        count: parseInt(item.count),
        amount: parseFloat(item.amount) || 0,
      };
    });

    return monthlyStats;
  }

  async getQuarterlyStats(year: number) {
    const currentYear = year || new Date().getFullYear();

    // 분기별 계약 통계 데이터 계산
    const monthlyStats = await this.getMonthlyStats(currentYear);

    const quarterlyStats = [
      { quarter: 1, count: 0, amount: 0 },
      { quarter: 2, count: 0, amount: 0 },
      { quarter: 3, count: 0, amount: 0 },
      { quarter: 4, count: 0, amount: 0 },
    ];

    monthlyStats.forEach((monthStat) => {
      const quarterIndex = Math.floor((monthStat.month - 1) / 3);
      quarterlyStats[quarterIndex].count += monthStat.count;
      quarterlyStats[quarterIndex].amount += monthStat.amount;
    });

    return quarterlyStats;
  }

  async getCategoryStats(year: number) {
    const currentYear = year || new Date().getFullYear();

    // 계약 카테고리별 통계
    const result = await this.contractRepo
      .createQueryBuilder("contract")
      .select("contract.category", "category")
      .addSelect("COUNT(contract.id)", "count")
      .addSelect("SUM(contract.amount)", "amount")
      .where("EXTRACT(YEAR FROM contract.signedAt) = :year", {
        year: currentYear,
      })
      .groupBy("contract.category")
      .orderBy("count", "DESC")
      .getRawMany();

    return result.map((item) => ({
      category: item.category,
      count: parseInt(item.count),
      amount: parseFloat(item.amount) || 0,
    }));
  }

  async getTypeStats(year: number) {
    const currentYear = year || new Date().getFullYear();

    // 계약 유형별 통계
    const result = await this.contractRepo
      .createQueryBuilder("contract")
      .select("contract.type", "type")
      .addSelect("COUNT(contract.id)", "count")
      .addSelect("SUM(contract.amount)", "amount")
      .where("EXTRACT(YEAR FROM contract.signedAt) = :year", {
        year: currentYear,
      })
      .groupBy("contract.type")
      .orderBy("count", "DESC")
      .getRawMany();

    return result.map((item) => ({
      type: item.type,
      count: parseInt(item.count),
      amount: parseFloat(item.amount) || 0,
    }));
  }

  async getTopCustomers(limit: number = 5) {
    // 계약 금액 기준 상위 고객
    const result = await this.contractRepo
      .createQueryBuilder("contract")
      .leftJoin("contract.customer", "customer")
      .select("customer.id", "customerId")
      .addSelect("customer.name", "customerName")
      .addSelect("customer.company", "customerCompany")
      .addSelect("COUNT(contract.id)", "contractCount")
      .addSelect("SUM(contract.amount)", "totalAmount")
      .groupBy("customer.id")
      .addGroupBy("customer.name")
      .addGroupBy("customer.company")
      .orderBy("totalAmount", "DESC")
      .limit(limit)
      .getRawMany();

    return result.map((item) => ({
      customerId: item.customerId,
      customerName: item.customerName,
      customerCompany: item.customerCompany,
      contractCount: parseInt(item.contractCount),
      totalAmount: parseFloat(item.totalAmount) || 0,
    }));
  }

  async getTopSingers(limit: number = 5) {
    // 계약 금액 기준 상위 가수
    const result = await this.contractRepo
      .createQueryBuilder("contract")
      .leftJoin("contract.singer", "singer")
      .select("singer.id", "singerId")
      .addSelect("singer.name", "singerName")
      .addSelect("singer.agency", "singerAgency")
      .addSelect("COUNT(contract.id)", "contractCount")
      .addSelect("SUM(contract.amount)", "totalAmount")
      .groupBy("singer.id")
      .addGroupBy("singer.name")
      .addGroupBy("singer.agency")
      .orderBy("totalAmount", "DESC")
      .limit(limit)
      .getRawMany();

    return result.map((item) => ({
      singerId: item.singerId,
      singerName: item.singerName,
      singerAgency: item.singerAgency,
      contractCount: parseInt(item.contractCount),
      totalAmount: parseFloat(item.totalAmount) || 0,
    }));
  }
}
