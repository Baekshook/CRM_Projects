import { Repository } from "typeorm";
import { Contract } from "./entities/contract.entity";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { SignContractDto } from "./dto/sign-contract.dto";
export declare class ContractsService {
    private readonly contractsRepository;
    private readonly logger;
    constructor(contractsRepository: Repository<Contract>);
    create(createContractDto: CreateContractDto): Promise<Contract>;
    findAll(query?: any): Promise<Contract[]>;
    findOne(id: string): Promise<Contract>;
    update(id: string, updateContractDto: UpdateContractDto): Promise<Contract>;
    remove(id: string): Promise<void>;
    sign(id: string, signContractDto: SignContractDto): Promise<Contract>;
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
