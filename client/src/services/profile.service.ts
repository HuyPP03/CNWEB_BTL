import apiClient from './api.client';
import { UserProfile } from '../types/user';

/**
 * Interface cho tham số cập nhật hồ sơ người dùng
 */
export interface UpdateUserProfileParams {
    fullName?: string;
    phone?: string;
    address?: string;
}

const profileService = {
    /**
     * Lấy thông tin hồ sơ của người dùng đang đăng nhập
     * @returns Thông tin hồ sơ người dùng
     */
    async getUserProfile(): Promise<UserProfile> {
        const response = await apiClient.get<{ data: UserProfile }>('/customer/me');
        return response.data;
    },

    /**
     * Cập nhật thông tin hồ sơ người dùng
     * @param data Dữ liệu cập nhật
     * @returns Thông tin hồ sơ đã được cập nhật
     */
    async updateUserProfile(data: UpdateUserProfileParams): Promise<UserProfile> {
        const response = await apiClient.put<{ data: UserProfile }>('/customer/me', data);
        return response.data;
    },
};

export default profileService;