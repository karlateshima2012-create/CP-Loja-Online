import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://cp-loja-online.creativeprintjp.com/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor for Auth token and Tenant ID (Multi-tenancy)
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    const tenantId = localStorage.getItem('tenant_id');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    if (tenantId) {
        config.headers['X-Tenant-ID'] = tenantId;

        // If it's a GET request, we might want to ensure tenant_id is in params as a fallback
        if (config.method === 'get') {
            config.params = {
                ...config.params,
                tenant_id: tenantId,
            };
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

// Global Error Handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Ocorreu um erro inesperado. Tente novamente.';

        // Here you could trigger a toast or global error state
        console.error('[API Error]', message);

        if (error.response?.status === 401) {
            // Handle Unauthorized (e.g., redirect to login)
            // localStorage.removeItem('token');
            // window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
