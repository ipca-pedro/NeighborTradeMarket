import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
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
            // Tentativa com a rota /auth/login
            try {
                console.log('Tentando login com /auth/login');
                const response = await api.post('/auth/login', { Email: email, Password: password });
                console.log('Resposta de /auth/login:', response.data);
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    console.log('Utilizador armazenado no localStorage:', response.data.user);
                    console.log('TipoUserID_TipoUser:', response.data.user.TipoUserID_TipoUser);
                }
                return response.data;
            } catch (authError) {
                console.log('Erro em /auth/login, tentando /login', authError);
                // Se falhar, tenta com a rota /login (para compatibilidade)
                const response = await api.post('/login', { Email: email, Password: password });
                console.log('Resposta de /login:', response.data);
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    console.log('Usuário armazenado no localStorage:', response.data.user);
                    console.log('TipoUserID_TipoUser:', response.data.user.TipoUserID_TipoUser);
                }
                return response.data;
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
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

export const adminService = {
    // Obter usuários pendentes
    getPendingUsers: async () => {
        try {
            const response = await api.get('/admin/users/pending');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter usuários pendentes:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Obter todos os usuários
    getAllUsers: async () => {
        try {
            const response = await api.get('/admin/users');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter todos os usuários:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Atualizar status de um usuário
    updateUserStatus: async (userId, statusId) => {
        try {
            const response = await api.put(`/admin/users/${userId}/status`, { status: statusId });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar status do usuário:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Aprovar um usuário
    approveUser: async (userId) => {
        try {
            const response = await api.post(`/admin/users/${userId}/approve`);
            return response.data;
        } catch (error) {
            console.error('Erro ao aprovar usuário:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Rejeitar um usuário
    rejectUser: async (userId, reason) => {
        try {
            const response = await api.post(`/admin/users/${userId}/reject`, { motivo: reason });
            return response.data;
        } catch (error) {
            console.error('Erro ao rejeitar usuário:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Obter anúncios pendentes
    getAnunciosPendentes: async () => {
        try {
            const response = await api.get('/admin/anuncios/pendentes');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter anúncios pendentes:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Aprovar um anúncio
    aprovarAnuncio: async (anuncioId) => {
        try {
            const response = await api.post(`/admin/anuncios/${anuncioId}/aprovar`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao aprovar anúncio ${anuncioId}:`, error);
            throw error.response?.data || error.message;
        }
    },
    
    // Rejeitar um anúncio
    rejeitarAnuncio: async (anuncioId, comentario) => {
        try {
            const response = await api.post(`/admin/anuncios/${anuncioId}/rejeitar`, { comentario });
            return response.data;
        } catch (error) {
            console.error(`Erro ao rejeitar anúncio ${anuncioId}:`, error);
            throw error.response?.data || error.message;
        }
    }
};

export const anuncioService = {
    // Obter todos os anúncios
    getAnuncios: async (filtros = {}) => {
        try {
            const response = await api.get('/anuncios', { params: filtros });
            return response.data;
        } catch (error) {
            console.error('Erro ao obter anúncios:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Obter um anúncio específico
    getAnuncio: async (id) => {
        try {
            const response = await api.get(`/anuncios/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao obter anúncio ${id}:`, error);
            throw error.response?.data || error.message;
        }
    },
    
    // Obter anúncios do usuário atual
    getMeusAnuncios: async () => {
        try {
            // Tentar obter o ID do usuário do localStorage
            const userData = localStorage.getItem('user');
            let userId = null;
            
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    userId = user.id || user.ID_Utilizador;
                    console.log('ID do usuário obtido do localStorage:', userId);
                } catch (e) {
                    console.error('Erro ao analisar dados do usuário:', e);
                }
            }
            
            let response;
            
            // Se temos o ID do usuário, usar a rota alternativa
            if (userId) {
                response = await api.get(`/user/${userId}/anuncios`);
                console.log('Usando rota alternativa para obter anúncios');
            } else {
                // Caso contrário, tentar a rota original
                response = await api.get('/meus-anuncios');
                console.log('Usando rota original para obter anúncios');
            }
            
            return response.data;
        } catch (error) {
            console.error('Erro ao obter meus anúncios:', error);
            // Se for erro de autenticação, retornar array vazio em vez de lançar erro
            if (error.response && (error.response.status === 401 || error.response.status === 500)) {
                console.warn('Erro de autenticação ou servidor, retornando array vazio');
                return [];
            }
            throw error.response?.data || error.message;
        }
    },
    
    // Criar um novo anúncio
    criarAnuncio: async (anuncioData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const response = await api.post('/anuncios', anuncioData, config);
            return response.data;
        } catch (error) {
            console.error('Erro ao criar anúncio:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Atualizar um anúncio existente
    atualizarAnuncio: async (id, anuncioData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            const response = await api.put(`/anuncios/${id}`, anuncioData, config);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar anúncio ${id}:`, error);
            throw error.response?.data || error.message;
        }
    },
    
    // Excluir um anúncio
    excluirAnuncio: async (id) => {
        try {
            const response = await api.delete(`/anuncios/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao excluir anúncio ${id}:`, error);
            throw error.response?.data || error.message;
        }
    },
    
    // Obter anúncios do usuário logado
    getMeusAnuncios: async () => {
        try {
            const response = await api.get('/meus-anuncios');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter meus anúncios:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Marcar anúncio como vendido
    marcarComoVendido: async (id) => {
        try {
            const response = await api.post(`/anuncios/${id}/sold`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao marcar anúncio ${id} como vendido:`, error);
            throw error.response?.data || error.message;
        }
    },
    
    // Obter categorias disponíveis
    getCategorias: async () => {
        try {
            const response = await api.get('/categorias');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter categorias:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Alias para compatibilidade com o backend
    getCategories: async () => {
        return anuncioService.getCategorias();
    },
    
    // Obter tipos de item disponíveis
    getTiposItem: async () => {
        try {
            const response = await api.get('/tipos-item');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter tipos de item:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Alias para compatibilidade com o backend
    getItemTypes: async () => {
        return anuncioService.getTiposItem();
    }
};

export default api;
