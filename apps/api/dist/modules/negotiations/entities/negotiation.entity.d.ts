import { Customer } from "../../customers/entities/customer.entity";
import { Singer } from "../../singers/entities/singer.entity";
import { NegotiationLog } from "./negotiation-log.entity";
import { Quote } from "./quote.entity";
export declare class Negotiation {
    id: string;
    customerId: string;
    singerId: string;
    status: "pending" | "in-progress" | "final-quote" | "cancelled" | "completed";
    title: string;
    description: string;
    initialAmount: number;
    finalAmount: number;
    eventDate: Date;
    eventLocation: string;
    eventType: string;
    eventDuration: number;
    isUrgent: boolean;
    deadline: Date;
    notes: string;
    requirements: string;
    assignedTo: string;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    singer: Singer;
    logs: NegotiationLog[];
    quotes: Quote[];
}
