export declare class CreateCustomerDto {
    type: "customer" | "singer";
    name: string;
    company: string;
    email: string;
    phone: string;
    profileImage?: string;
    profileImageId?: string;
    statusMessage?: string;
    address: string;
    department?: string;
    grade: number;
    memo?: string;
    assignedTo?: string;
    status: "active" | "inactive";
    registrationDate: string;
    role?: string;
}
