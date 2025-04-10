import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost/NT/public/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const moradaService = {
    getMoradas: async () => {
        try {
            const response = await api.get('/moradas');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter moradas:', error);
            throw error.response?.data || error.message;
        }
    }
};

export const authService = {
    login: async (email, password) => {
        try {
            const response = await api.post('/auth/login', { Email: email, Password: password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    register: async (userData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const response = await api.post('/auth/register', userData, config);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: async () => {
        try {
            await api.post('/auth/logout');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    resetPassword: async (email) => {
        try {
            const response = await api.post('/password/email', { Email: email });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    verifyResetToken: async (token) => {
        try {
            const response = await api.get(`/password/reset/${token}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    resetPasswordWithToken: async (token, password, passwordConfirmation) => {
        try {
            const response = await api.post('/password/reset', { 
                token, 
                Password: password, 
                Password_confirmation: passwordConfirmation 
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    getUserProfile: async () => {
        try {
            const response = await api.get('/perfil');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    
    updateUserProfile: async (profileData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const response = await api.post('/perfil', profileData, config);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default api;
