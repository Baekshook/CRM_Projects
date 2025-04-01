import { Customer } from "../../customers/entities/customer.entity";
import { Singer } from "../../singers/entities/singer.entity";
import { Match } from "../../matches/entities/match.entity";
import { Schedule } from "../../schedules/entities/schedule.entity";
import { Contract } from "../../contracts/entities/contract.entity";
export declare class Request {
    id: string;
    customerId: string;
    customerName: string;
    customerCompany: string;
    eventType: string;
    eventDate: string;
    venue: string;
    budget: string;
    requirements: string;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    title: string;
    description: string;
    eventTime: string;
    singerId: string;
    singerName: string;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    singer: Singer;
    matches: Match[];
    schedules: Schedule[];
    contracts: Contract[];
}
