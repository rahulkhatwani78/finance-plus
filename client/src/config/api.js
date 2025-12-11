// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
    // Auth
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    CHANGE_PASSWORD: `${API_BASE_URL}/api/auth/change-password`,

    // Transactions
    TRANSACTIONS: `${API_BASE_URL}/api/transactions`,

    // Health
    HEALTH: `${API_BASE_URL}/health`,
};

export default API_BASE_URL;
