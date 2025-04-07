export declare class CreateScheduleDto {
    scheduledDate: string;
    location: string;
    description?: string;
    matchId?: string;
    requestId?: string;
    customerId: string;
    customerName: string;
    customerCompany?: string;
    singerId: string;
    singerName: string;
    singerAgency?: string;
    eventTitle: string;
    eventDate: string;
    startTime?: string;
    endTime?: string;
    venue: string;
    status?: "scheduled" | "in_progress" | "completed" | "cancelled" | "changed";
    details: string;
}
