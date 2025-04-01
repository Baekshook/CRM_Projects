import { Contract } from "../../contracts/entities/contract.entity";
import { Customer } from "../../customers/entities/customer.entity";
export declare class Payment {
    id: string;
    contractId: string;
    customerId: string;
    customerName: string;
    amount: string;
    paymentMethod: string;
    paymentDate: string;
    status: "pending" | "completed" | "failed" | "refunded";
    contract: Contract;
    customer: Customer;
}
