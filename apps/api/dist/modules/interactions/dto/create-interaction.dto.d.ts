export declare class CreateInteractionDto {
    title: string;
    content?: string;
    type: string;
    customerId?: string;
    userId?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    interactionDate?: Date;
    status?: string;
    metadata?: Record<string, any>;
}
