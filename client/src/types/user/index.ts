export interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    address: string | null;
    isActive: boolean;
    googleId: string | null;
    createdAt: string;
    updatedAt: string;
}