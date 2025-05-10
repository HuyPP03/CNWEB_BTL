import apiClient from './api.client';

interface RegisterData {
    fullName: string;
    phone: string;
    email?: string;
    password: string;
    isStudent?: boolean;
    birthDate?: string;
}

const authService = {
    register: async (userData: RegisterData): Promise<void> => {
        try {
            console.log('Calling register API with:', userData);
            const response = await apiClient.post('/auth/register', {
                fullName: userData.fullName,
                email: userData.email,
                password: userData.password,
                phone: userData.phone
            });
            console.log('Registration successful:', response);
        } catch (error) {
            console.error('Registration API error:', error);
            throw error;
        }
    },

    login: async (email: string, password: string): Promise<{ accessToken: string }> => {
        try {
            console.log('Calling login API with:', { email, password });
            const response = await apiClient.post<{ accessToken: string }>('/auth/customers/login', {
                email,
                password
            });
            console.log('Login API response token:', response.accessToken);

            return response;
        } catch (error: any) {
            console.error('Login API error: ', error);
            if (error.response) {
                console.log('Error response status:', error.response.status);
                console.log('Error response data:', error.response.data);
            }

            throw error;
        }
    },

    verifyToken: async (token: string, email: string): Promise<void> => {
        await apiClient.post<null>('/auth/verify', {
            token,
            email
        });
    },

    refreshToken: async (): Promise<{ accessToken: string }> => {
        const response = await apiClient.post<{ accessToken: string }>('/auth/customers/refresh-token', {});
        return response;
    },

}

export default authService;