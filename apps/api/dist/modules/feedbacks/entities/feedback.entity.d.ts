import { Customer } from "../../customers/entities/customer.entity";
import { Singer } from "../../singers/entities/singer.entity";
export declare class Feedback {
    id: string;
    customerId: string;
    customerName: string;
    singerId: string;
    singerName: string;
    rating: number;
    content: string;
    category: "quality" | "service" | "communication" | "price" | "other";
    status: "new" | "inProgress" | "resolved" | "closed";
    response: string;
    responseAt: Date;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    singer: Singer;
}
