import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { FilesService } from "../files/files.service";
export declare class CustomersController {
    private readonly customersService;
    private readonly filesService;
    constructor(customersService: CustomersService, filesService: FilesService);
    create(createCustomerDto: CreateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    findAll(): Promise<import("./entities/customer.entity").Customer[]>;
    findOne(id: string): Promise<import("./entities/customer.entity").Customer>;
    update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    remove(id: string): Promise<void>;
    uploadFile(id: string, file: Express.Multer.File, body: any): Promise<{
        success: boolean;
        file: import("../files/entities/file.entity").File;
    }>;
    uploadMultipleFiles(id: string, files: Express.Multer.File[], body: any): Promise<{
        success: boolean;
        count: number;
        files: any[];
    }>;
    getCustomerFiles(id: string): Promise<{
        success: boolean;
        count: number;
        files: import("../files/entities/file.entity").File[];
    }>;
}
