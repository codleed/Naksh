import axios, { type AxiosResponse } from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Token will be added dynamically when making requests
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data; // Return only the data part
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - let Clerk handle auth redirects
      console.error('Unauthorized request');
    }
    
    // Extract error message
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'An unexpected error occurred';
    
    return Promise.reject(new Error(errorMessage));
  }
);

// Helper function to create authenticated request
const createAuthenticatedRequest = (token?: string) => {
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  };
};

export const userAPI = {
  getCurrentUser: (token?: string): Promise<User> => 
    apiClient.get('/auth/me', createAuthenticatedRequest(token)),
  updateProfile: (userData: Partial<User>, token?: string): Promise<User> => 
    apiClient.put('/auth/profile', userData, createAuthenticatedRequest(token)),
  completeProfile: (userData: { username: string; bio?: string }, token?: string): Promise<User> => 
    apiClient.post('/auth/complete-profile', userData, createAuthenticatedRequest(token)),
  checkUsername: (username: string): Promise<{ available: boolean; username: string }> => 
    apiClient.get(`/auth/check-username?username=${username}`),
  deleteAccount: (token?: string): Promise<void> => 
    apiClient.delete('/auth/account', createAuthenticatedRequest(token)),
  getSession: (token?: string): Promise<{ authenticated: boolean; user?: User; suspended?: boolean }> => 
    apiClient.get('/auth/session', createAuthenticatedRequest(token)),
};

// Generic API methods for other resources
interface ResourceMethods<T> {
  getAll: (params?: Record<string, any>) => Promise<T[]>;
  getById: (id: string | number) => Promise<T>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: string | number, data: Partial<T>) => Promise<T>;
  delete: (id: string | number) => Promise<void>;
}

export const createResource = <T = any>(endpoint: string): ResourceMethods<T> => ({
  getAll: (params = {}) => apiClient.get(endpoint, { params }),
  getById: (id) => apiClient.get(`${endpoint}/${id}`),
  create: (data) => apiClient.post(endpoint, data),
  update: (id, data) => apiClient.put(`${endpoint}/${id}`, data),
  delete: (id) => apiClient.delete(`${endpoint}/${id}`),
});

export default apiClient;