
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

const api = typeof axios.create === 'function' 
  ? axios.create({
      baseURL: API_URL,
      withCredentials: true,
    })
  : axios;
// Request interceptor: attach token if present
if (api?.interceptors) {
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                const errorMessage = error.response?.data?.message || '';
                console.log('401 Error from API:', errorMessage, error.config?.url);
                
                // Check if it's a token-related error
                if (
                    errorMessage.toLowerCase().includes('token') ||
                    errorMessage.toLowerCase().includes('expired') ||
                    errorMessage.toLowerCase().includes('invalid') ||
                    errorMessage.toLowerCase().includes('authentication')
                ) {
                    // Show toast notification
                    toast.error('Session expired. Please login again.');
                    
                    // Clear local auth data
                    localStorage.removeItem('token');
                    localStorage.removeItem('userId');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('role');
                    
                    // Redirect to login after a short delay to allow toast to show
                    setTimeout(() => {
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                    }, 1000);
                }
            }
            return Promise.reject(error);
        }
    )
};

// User API
export const userAPI = {
    signup: (userData) => api.post('/user/signup', userData),
    login: async (credentials) => {
        const response = await api.post('/user/login', credentials);
        return response;
    },
    logout: async () => {
        try {
            // optional server-side logout endpoint 
            await api.post('/user/logout').catch(() => { });
        } catch (e) { }
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('role');
        return Promise.resolve();
    },
    getAllEmployees: async (searchTerm = '', page = 1, limit = 10) => {
        const params = {};
        if (searchTerm && searchTerm.trim() !== '') {
            params.search = searchTerm;
        }
        params.page = page;
        params.limit = limit;
        console.log('API Config: params:', params);
        const response = await api.get('/user/getAllEmployees', { params });
        console.log('API Config: Response:', response.data);
        return response.data;
    }
};

// Leave API 
export const leaveAPI = {
    addLeaveRequest: (data) => api.post('/leave/addLeaveRequest', data),
    getAllLeaveRequests: (params) => api.get('/leave/getAllLeaveRequests', { params }),
    getLeaveRequestById: (id) => api.get(`/leave/getLeaveRequestById/${id}`),
    updateLeaveRequest: (id, data) => api.put(`/leave/updateLeaveRequest/${id}`, data),
    getLeaveRequestsByUser: (userId, queryParams = {}) => api.get(`/leave/getLeaveRequestByUserId/${userId}`, { params: queryParams }),
    deleteLeaveRequest: (id) => api.delete(`/leave/deleteLeaveRequest/${id}`),
};

// WFH API 
export const wfhAPI = {
    addWfhRequest: (data) => api.post('/wfh-requests/addWfhRequest', data),
    getAllWfhRequests: (params) => api.get('/wfh-requests/getAllWfhRequests', { params }),
    getWfhRequestById: (id) => api.get(`/wfh-requests/getWfhRequestById/${id}`),
    updateWfhRequest: (id, data) => api.put(`/wfh-requests/updateWfhRequest/${id}`, data),
    // Accepts optional query params (page, limit, search, status). Call with just userId when you want defaults.
    getWfhRequestsByUser: (userId, params = {}) => api.get(`/wfh-requests/user/${userId}`, { params }),
    deleteWfhRequest: (id) => api.delete(`/wfh-requests/deleteWfhRequest/${id}`),
};

export default api;