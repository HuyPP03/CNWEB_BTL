import apiClient from './api.client';

interface RegisterData {
    fullName: string;
    phone: string;
    email?: string;
    password: string;
    isStudent?: boolean;
    birthDate?: string;
}

// Base URL for API calls
const API_URL = 'https://cnweb-btl.onrender.com';

const authService = {
    // Initiate Google OAuth flow
    loginWithGoogle: (): void => {
        // Redirect to the Google OAuth endpoint
        window.location.href = `${API_URL}/api/auth/google`;
    },

    // Handle the OAuth callback and token
    handleGoogleCallback: (accessToken: string): { accessToken: string } => {
        if (!accessToken) {
            throw new Error('Access token not provided');
        }

        // Log details about the token for debugging
        try {
            // Ensure token is saved to localStorage
            localStorage.setItem('accessToken', accessToken);
            console.log('Token saved to localStorage in auth service');

            // Check that token was actually saved
            const storedToken = localStorage.getItem('accessToken');
            if (!storedToken) {
                console.warn('Token not found in localStorage after saving, trying again');
                localStorage.setItem('accessToken', accessToken);
            }
        } catch (e) {
            console.error('Error handling token in auth service:', e);
            // Still save the token even if there's an error parsing it
            localStorage.setItem('accessToken', accessToken);
        }

        return { accessToken };
    },

    register: async (userData: RegisterData): Promise<void> => {
        try {
            console.log('Calling register API with:', userData);
            const response = await apiClient.post<{ statusCode: number, message: string, data: null }>('/auth/register', {
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
            const response = await apiClient.post<{ statusCode: number, message: string, data: any }>('/auth/customers/login', {
                email,
                password
            });
            console.log('Login API response:', response);

            // Trả về access token từ trường data của response
            return { accessToken: response.data.accessToken };
        } catch (error: any) {
            console.error('Login API error: ', error);
            if (error.response) {
                console.log('Error response status:', error.response.status);
                console.log('Error response data:', error.response.data);
            }

            throw error;
        }
    },    verifyToken: async (token: string, email: string): Promise<void> => {
        await apiClient.post<{ statusCode: number, message: string, data: null }>('/auth/verify', {
            token,
            email
        });
    },

    refreshToken: async (): Promise<{ accessToken: string }> => {
        const response = await apiClient.post<{ statusCode: number, message: string, data: string }>('/auth/customers/refresh-token', {});
        return { accessToken: response.data };
    },
    
    // Forgot password - request password reset
    forgotPassword: async (email: string): Promise<void> => {
        try {
            console.log('Calling forgot password API with:', { email });
            const response = await apiClient.post<{ statusCode: number, message: string, data: null }>('/auth/customers/forgot-password', {
                email
            });
            console.log('Forgot password request successful:', response);
        } catch (error) {
            console.error('Forgot password API error:', error);
            throw error;
        }
    },

    // Reset password with token
    resetPassword: async (email: string, token: string, newPassword: string): Promise<void> => {
        try {
            console.log('Calling reset password API with:', { email, token: token.substring(0, 15) + '...' });
            const response = await apiClient.post<{ statusCode: number, message: string, data: null }>('/auth/customers/reset-password', {
                email,
                token,
                newPassword
            });
            console.log('Reset password successful:', response);
        } catch (error) {
            console.error('Reset password API error:', error);
            throw error;
        }
    },

}

export default authService;