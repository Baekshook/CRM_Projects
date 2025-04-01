export declare class CreateRequestDto {
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
    singerId?: string;
    singerName?: string;
}
