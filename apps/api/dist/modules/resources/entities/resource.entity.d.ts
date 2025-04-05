import { Customer } from "../../customers/entities/customer.entity";
import { Singer } from "../../singers/entities/singer.entity";
export declare class Resource {
    id: string;
    name: string;
    description: string;
    entityId: string;
    entityType: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    type: "image" | "audio" | "video" | "document" | "other";
    category: string;
    tags: string[];
    uploadedAt: Date;
    updatedAt: Date;
    isPublic: boolean;
    isStoredInDb: boolean;
    data: Buffer;
    customer: Customer;
    singer: Singer;
}
