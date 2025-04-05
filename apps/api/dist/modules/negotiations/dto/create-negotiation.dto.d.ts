export declare class CreateNegotiationDto {
    customerId: string;
    singerId: string;
    status?: "pending" | "in-progress" | "final-quote" | "cancelled" | "completed";
    title?: string;
    description?: string;
    initialAmount?: number;
    finalAmount?: number;
    eventDate?: string;
    eventLocation?: string;
    eventType?: string;
    eventDuration?: number;
    isUrgent?: boolean;
    deadline?: string;
    notes?: string;
    requirements?: string;
    assignedTo?: string;
    updatedBy?: string;
}
