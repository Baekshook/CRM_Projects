import { Contract } from "../../contracts/entities/contract.entity";
import { Customer } from "../../customers/entities/customer.entity";
import { Singer } from "../../singers/entities/singer.entity";
export declare class Review {
    id: string;
    contractId: string;
    customerId: string;
    customerName: string;
    singerId: string;
    singerName: string;
    rating: number;
    content: string;
    createdAt: Date;
    status: "published" | "hidden";
    contract: Contract;
    customer: Customer;
    singer: Singer;
}
