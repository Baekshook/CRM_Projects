export declare class CreateContractDto {
    matchId: string;
    scheduleId: string;
    requestId: string;
    customerId: string;
    customerName: string;
    customerCompany: string;
    singerId: string;
    singerName: string;
    singerAgency: string;
    eventTitle: string;
    eventDate: string;
    venue: string;
    contractAmount: string;
    paymentStatus?: "unpaid" | "partial" | "paid";
    contractStatus?: "draft" | "sent" | "signed" | "completed" | "cancelled";
}
