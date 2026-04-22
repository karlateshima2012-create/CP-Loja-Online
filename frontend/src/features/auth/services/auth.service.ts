import apiClient from '../../../services/apiClient';
import { User, LoginCredentials, RegisterData } from '../types/index';

/**
 * Auth Service for Laravel Backend Integration
 */
export const authService = {
    /**
     * Authenticates a user and returns the token and user data
     */
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient.post<{ access_token: string; user: User; tenant: any }>('/login', credentials);
        return {
            token: response.data.access_token,
            user: response.data.user,
            tenant: response.data.tenant
        };
    },

    /**
     * Registers a new user/client
     */
    register: async (data: RegisterData) => {
        const response = await apiClient.post<{ access_token: string; user: User; tenant: any }>('/register', data);
        return {
            token: response.data.access_token,
            user: response.data.user,
            tenant: response.data.tenant
        };
    },

    /**
     * Fetches the current user profile
     */
    getProfile: async () => {
        const response = await apiClient.get<{ user: User; tenant: any }>('/me');
        return response.data;
    },

    /**
     * Logs out the user
     */
    logout: async () => {
        await apiClient.post('/logout');
    }
};
