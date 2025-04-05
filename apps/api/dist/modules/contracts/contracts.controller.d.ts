import { ContractsService } from "./contracts.service";
export declare class ContractsController {
    private readonly contractsService;
    private readonly logger;
    constructor(contractsService: ContractsService);
    findAll(): Promise<import("./entities/contract.entity").Contract[]>;
    findOne(id: string): Promise<import("./entities/contract.entity").Contract>;
    create(createContractDto: any): Promise<import("./entities/contract.entity").Contract>;
    update(id: string, updateContractDto: any): Promise<import("./entities/contract.entity").Contract>;
    remove(id: string): Promise<void>;
    getMonthlyStats(): Promise<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string;
            borderColor: string;
            borderWidth: number;
        }[];
    }>;
    getCategoryStats(): Promise<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number;
        }[];
    }>;
    getTypeStats(): Promise<{
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor: string[];
            borderColor: string[];
            borderWidth: number;
        }[];
    }>;
    getQuarterlyStats(): Promise<{
        quarter: string;
        contractCount: number;
        totalAmount: number;
        averageAmount: number;
    }[]>;
    getTopCustomers(limit?: number): Promise<{
        name: string;
        totalAmount: number;
        contractCount: number;
    }[]>;
    getTopSingers(limit?: number): Promise<{
        name: string;
        totalAmount: number;
        contractCount: number;
    }[]>;
}
