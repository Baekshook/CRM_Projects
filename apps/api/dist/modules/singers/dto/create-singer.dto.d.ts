export declare class CreateSingerDto {
    name: string;
    agency: string;
    genre: string;
    email: string;
    phone: string;
    profileImage?: string;
    profileImageId?: string;
    statusMessage?: string;
    address: string;
    grade: number;
    rating?: number;
    status: "active" | "inactive";
    registrationDate: string;
    role?: string;
    genres: string[];
    experience?: number;
    price?: number;
}
