import { Repository } from "typeorm";
import { Contract } from "./entities/contract.entity";
declare class CreateContractDto {
    customerId?: string;
    customerName?: string;
    singerId?: string;
    singerName?: string;
    eventTitle?: string;
}
export declare class ContractsService {
    private readonly contractRepository;
    private readonly logger;
    constructor(contractRepository: Repository<Contract>);
    findAll(): Promise<Contract[]>;
    findOne(id: string): Promise<Contract>;
    create(createContractDto: CreateContractDto): Promise<Contract>;
    update(id: string, updateContractDto: any): Promise<Contract>;
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
export {};
