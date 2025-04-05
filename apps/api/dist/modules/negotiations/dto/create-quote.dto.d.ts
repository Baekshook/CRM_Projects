import { QuoteItem } from "../entities/quote.entity";
export declare class CreateQuoteDto {
    negotiationId: string;
    amount: number;
    status?: "draft" | "sent" | "accepted" | "rejected" | "revised" | "final";
    description?: string;
    validUntil?: string;
    items?: QuoteItem[];
    tax?: number;
    discount?: number;
    discountReason?: string;
    terms?: string;
    notes?: string;
    createdBy?: string;
    isFinal?: boolean;
}
