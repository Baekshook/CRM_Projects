export declare class CreateFeedbackDto {
    customerId: string;
    customerName?: string;
    singerId?: string;
    singerName?: string;
    rating: number;
    content: string;
    category: "quality" | "service" | "communication" | "price" | "other";
    status?: "new" | "inProgress" | "resolved" | "closed";
    response?: string;
    responseAt?: Date;
}
