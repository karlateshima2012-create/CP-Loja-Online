import apiClient from '../../../services/apiClient';

export interface AdminStats {
    total_tenants: number;
    total_users: number;
    total_pages: number;
    published_pages: number;
}

export interface TenantListItem {
    id: string;
    name: string;
    slug: string;
    status: string;
    created_at: string;
    plan?: {
        name: string;
    };
}

export const adminService = {
    getStats: async () => {
        const response = await apiClient.get<AdminStats>('/admin/dashboard/stats');
        return response.data;
    },

    getTenants: async (page = 1) => {
        const response = await apiClient.get<{ data: TenantListItem[], last_page: number }>(`/admin/dashboard/tenants?page=${page}`);
        return response.data;
    }
};
