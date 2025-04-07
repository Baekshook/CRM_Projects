import { ContractsService } from "./contracts.service";
import { CreateContractDto } from "./dto/create-contract.dto";
import { UpdateContractDto } from "./dto/update-contract.dto";
import { SignContractDto } from "./dto/sign-contract.dto";
export declare class ContractsController {
    private readonly contractsService;
    private readonly logger;
    constructor(contractsService: ContractsService);
    findAll(query: any): Promise<import("./entities/contract.entity").Contract[]>;
    findOne(id: string): Promise<import("./entities/contract.entity").Contract>;
    create(createContractDto: CreateContractDto): Promise<import("./entities/contract.entity").Contract>;
    update(id: string, updateContractDto: UpdateContractDto): Promise<import("./entities/contract.entity").Contract>;
    remove(id: string): Promise<void>;
    sign(id: string, signContractDto: SignContractDto): Promise<import("./entities/contract.entity").Contract>;
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
