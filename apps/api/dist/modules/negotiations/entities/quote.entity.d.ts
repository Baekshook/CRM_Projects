import { Negotiation } from "./negotiation.entity";
export declare class Quote {
    id: string;
    negotiationId: string;
    amount: number;
    status: "draft" | "sent" | "accepted" | "rejected" | "revised" | "final";
    description: string;
    validUntil: Date;
    items: QuoteItem[];
    tax: number;
    discount: number;
    discountReason: string;
    terms: string;
    notes: string;
    createdBy: string;
    updatedBy: string;
    isFinal: boolean;
    createdAt: Date;
    updatedAt: Date;
    negotiation: Negotiation;
}
export interface QuoteItem {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    total: number;
}
