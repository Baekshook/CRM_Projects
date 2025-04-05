import { StatsService } from "./stats.service";
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getMonthlyStats(year: number): Promise<{
        month: number;
        count: number;
        amount: number;
    }[]>;
    getQuarterlyStats(year: number): Promise<{
        quarter: number;
        count: number;
        amount: number;
    }[]>;
    getCategoryStats(year: number): Promise<{
        category: any;
        count: number;
        amount: number;
    }[]>;
    getTypeStats(year: number): Promise<{
        type: any;
        count: number;
        amount: number;
    }[]>;
    getTopCustomers(limit?: number): Promise<{
        customerId: any;
        customerName: any;
        customerCompany: any;
        contractCount: number;
        totalAmount: number;
    }[]>;
    getTopSingers(limit?: number): Promise<{
        singerId: any;
        singerName: any;
        singerAgency: any;
        contractCount: number;
        totalAmount: number;
    }[]>;
}
