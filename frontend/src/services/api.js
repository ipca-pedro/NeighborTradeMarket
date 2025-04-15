import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: true // ESSENCIAL para sessões Laravel
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
                    // Debug: Verificar dados do usuário antes de armazenar
                    console.log('Dados do usuário antes de armazenar:', response.data.user);
                    console.log('ID do usuário:', response.data.user.ID_User);
                    
                    // Garantir que o ID do usuário seja um número
                    const userData = {
                        ...response.data.user,
                        ID_User: parseInt(response.data.user.ID_User)
                    };
                    
                    console.log('Dados do usuário após conversão:', userData);
                    
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Utilizador armazenado no localStorage:', userData);
                    console.log('TipoUserID_TipoUser:', userData.TipoUserID_TipoUser);
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
                    console.log('Utilizador armazenado no localStorage:', response.data.user);
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
            // Não armazenar token ou dados do usuário, pois o registro está pendente
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
    // Obter utilizadores pendentes
    getPendingUsers: async () => {
        try {
            const response = await api.get('/admin/users/pending');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter utilizadores pendentes:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Obter todos os utilizadores
    getAllUsers: async () => {
        try {
            const response = await api.get('/admin/users');
            return response.data;
        } catch (error) {
            console.error('Erro ao obter todos os utilizadores:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Atualizar status de um utilizador
    updateUserStatus: async (userId, statusId) => {
        try {
            const response = await api.put(`/admin/users/${userId}/status`, { status: statusId });
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar status do utilizador:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Aprovar um utilizador
    approveUser: async (userId) => {
        try {
            const response = await api.post(`/admin/users/${userId}/approve`);
            return response.data;
        } catch (error) {
            console.error('Erro ao aprovar utilizador:', error);
            throw error.response?.data || error.message;
        }
    },
    
    // Rejeitar um utilizador
    rejectUser: async (userId, reason) => {
        try {
            const response = await api.post(`/admin/users/${userId}/reject`, { motivo: reason });
            return response.data;
        } catch (error) {
            console.error('Erro ao rejeitar utilizador:', error);
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
            console.log('Tentando aprovar anúncio:', anuncioId);
            const response = await api.post(`/admin/anuncios/${anuncioId}/aprovar`);
            console.log('Resposta da aprovação:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro detalhado ao aprovar anúncio ${anuncioId}:`, {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
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
    },

    // --- Anuncio Admin --- 
    getAllAnunciosAdmin: async (filters = {}) => {
        try {
            // Pass filters as URL parameters
            const response = await api.get('/admin/anuncios', { params: filters });
            return response.data;
        } catch (error) {
            console.error('Erro ao obter todos os anúncios para admin:', error);
            throw error.response?.data || error.message;
        }
    },

    updateAnuncioStatusAdmin: async (anuncioId, statusId) => {
        try {
            const response = await api.put(`/admin/anuncios/${anuncioId}/status`, { status: statusId });
            return response.data; // Contains message and updated anuncio
        } catch (error) {
             console.error(`Erro ao atualizar estado do anúncio ${anuncioId}:`, error);
             throw error.response?.data || error.message;
        }
    }
};

export const anuncioService = {
    // Obter todos os anúncios
    getAnuncios: async (filtros = {}) => {
        try {
            console.log('Buscando anúncios com filtros:', filtros);
            // Este endpoint deve ser uma rota pública que não requer autenticação
            const response = await api.get('/anuncios', { params: filtros });
            console.log('Anúncios recebidos:', response.data?.length || 0);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter anúncios:', error);
            if (error.response?.status === 401) {
                console.log('Erro de autenticação, tentando via endpoint público');
                // Tentar buscar via endpoint público alternativo
                try {
                    const publicResponse = await api.get('/anuncios/publicos', { params: filtros });
                    return publicResponse.data;
                } catch (fallbackError) {
                    console.error('Erro no fallback público:', fallbackError);
                    return []; // Retornar array vazio em vez de lançar erro
                }
            }
            return []; // Retornar array vazio para não quebrar a UI
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
    
    // Obter anúncios do utilizador atual
    getMeusAnuncios: async () => {
        try {
            // Tentar obter o ID do utilizador do localStorage
            const userData = localStorage.getItem('user');
            let userId = null;
            
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    userId = user.id || user.ID_Utilizador;
                    console.log('ID do utilizador obtido do localStorage:', userId);
                } catch (e) {
                    console.error('Erro ao analisar dados do utilizador:', e);
                }
            }
            
            let response;
            
            // Se temos o ID do utilizador, usar a rota alternativa
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
    
    // Obter anúncios do utilizador logado
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
    
    // Obter anúncios por categoria
    getAnunciosPorCategoria: async (categoriaId) => {
        try {
            console.log('Buscando anúncios da categoria:', categoriaId);
            const response = await api.get(`/anuncios/categoria/${categoriaId}`);
            return response.data;
        } catch (error) {
            console.error(`Erro ao buscar anúncios da categoria ${categoriaId}:`, error);
            return []; // Retornar array vazio para não quebrar a UI
        }
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
