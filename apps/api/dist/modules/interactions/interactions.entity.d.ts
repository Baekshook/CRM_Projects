import { Customer } from "../customers/entities/customer.entity";
export declare class Interaction {
    id: string;
    title: string;
    content: string;
    type: string;
    customerId: string;
    customer: Customer;
    userId: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    interactionDate: Date;
    status: string;
    metadata: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
