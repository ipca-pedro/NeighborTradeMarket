import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true, // Importante para autenticação
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    console.log('Token encontrado:', token); // Debug

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Cabeçalhos do pedido:', config.headers); // Debug
    } else {
        console.log('Nenhum token encontrado no localStorage'); // Debug
    }
    return config;
}, error => {
    console.error('Erro no interceptor:', error); // Debug
    return Promise.reject(error);
});

// Interceptor para tratar respostas
api.interceptors.response.use(
    response => response,
    error => {
        console.error('Erro na resposta:', {
            status: error.response?.status,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                headers: error.config?.headers
            }
        });

        // Se for erro 500, vamos logar mais detalhes
        if (error.response?.status === 500) {
            console.error('Detalhes do erro 500:', {
                url: error.config?.url,
                method: error.config?.method,
                requestData: error.config?.data,
                responseData: error.response?.data
            });
        }

        // Se for erro 403, verificamos a autenticação
        if (error.response?.status === 403) {
            console.log('Erro 403 detectado - Verificando autenticação...');
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            console.log('Estado da autenticação:', {
                hasToken: !!token,
                hasUser: !!user,
                userData: user ? JSON.parse(user) : null
            });
        }

        return Promise.reject(error);
    }
);

/**
 * Função utilitária para obter URLs de imagens
 * @param {Object} item - Item contendo uma referência à imagem
 * @returns {string} URL da imagem ou URL de fallback
 */
export const getImageUrl = (item) => {
    // Fallback image
    const fallbackImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN88R8AAtUB6S/lhm4AAAAASUVORK5CYII=';
    
    // Se não tiver imagem, retorna fallback
    if (!item?.imagem?.Caminho) return fallbackImage;
    
    // Primeiro tentar usar a API de arquivos por ID se disponível
    if (item.imagem.ID_Imagem) {
        return `${api.defaults.baseURL}/files/id/${item.imagem.ID_Imagem}`;
    }
    
    // Standardize path handling by always removing 'public/' prefix if it exists
    let caminho = item.imagem.Caminho;
    if (caminho.startsWith('public/')) {
        caminho = caminho.substring(7); // Remove 'public/' prefix
    }
    
    // Return the complete storage URL
    return `${api.defaults.baseURL.replace('/api', '')}/storage/${caminho}`;
};

/**
 * Função utilitária para obter URLs de documentos PDF (comprovativos)
 * @param {string} userId - ID do usuário (opcional)
 * @param {string} pdfName - Nome do arquivo PDF (opcional)
 * @returns {string} URL do documento PDF
 */
export const getPdfUrl = (userId = null, pdfName = null) => {
    // Base URL para comprovativos
    const baseUrl = `${api.defaults.baseURL.replace('/api', '')}/storage/comprovativos/pdfs`;
    
    // Se não tiver nenhum parâmetro, retorna a URL base para a pasta de comprovativos
    if (!userId && !pdfName) {
        return baseUrl; 
    }
    
    // Se tiver apenas userId, retorna todos os documentos daquele usuário
    if (userId && !pdfName) {
        return `${baseUrl}/user_${userId}_`;
    }
    
    // Se tiver caminho completo, usa-o diretamente
    if (userId && pdfName) {
        // Verifica se o nome do PDF já inclui o prefixo do usuário
        if (pdfName.startsWith(`user_${userId}_`)) {
            return `${baseUrl}/${pdfName}`;
        } else {
            return `${baseUrl}/user_${userId}_${pdfName}`;
        }
    }
    
    // Se tiver apenas o nome do arquivo
    if (!userId && pdfName) {
        return `${baseUrl}/${pdfName}`;
    }
    
    return baseUrl;
};

/**
 * Função utilitária para obter URL de PDF a partir do caminho completo
 * @param {string} fullPath - Caminho completo do PDF
 * @returns {string} URL do documento PDF
 */
export const getPdfUrlFromPath = (fullPath) => {
    if (!fullPath) return '';
    
    // Padroniza o caminho removendo 'public/' se existir
    let caminho = fullPath;
    if (caminho.startsWith('public/')) {
        caminho = caminho.substring(7); // Remove 'public/' prefix
    }
    
    // Retorna a URL completa para o PDF
    return `${api.defaults.baseURL.replace('/api', '')}/storage/${caminho}`;
};

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
                console.log('A tentar login com /auth/login');
                const response = await api.post('/auth/login', { Email: email, Password: password });
                console.log('Resposta de /auth/login:', response.data);
                if (response.data.token) {
                    // Debug: Verificar dados do utilizador antes de armazenar
                    console.log('Dados do utilizador antes de guardar:', response.data.user);
                    console.log('ID do utilizador:', response.data.user.ID_User);
                    
                    // Garantir que o ID do utilizador seja um número
                    const userData = {
                        ...response.data.user,
                        ID_User: parseInt(response.data.user.ID_User || response.data.user.id || 0)
                    };
                    
                    console.log('Dados do utilizador após conversão:', userData);
                    
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Utilizador guardado no localStorage:', userData);
                    console.log('TipoUserID_TipoUser:', userData.TipoUserID_TipoUser);
                }
                return response.data;
            } catch (authError) {
                console.log('Erro em /auth/login, a tentar /login', authError);
                // Se falhar, tenta com a rota /login (para compatibilidade)
                const response = await api.post('/login', { Email: email, Password: password });
                console.log('Resposta de /login:', response.data);
                if (response.data.token) {
                    // Também garantir consistência no formato dos dados aqui
                    const userData = {
                        ...response.data.user,
                        ID_User: parseInt(response.data.user.ID_User || response.data.user.id || 0)
                    };
                    
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(userData));
                    console.log('Utilizador guardado no localStorage:', userData);
                    console.log('TipoUserID_TipoUser:', userData.TipoUserID_TipoUser);
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
            // Não armazenar token ou dados do utilizador, pois o registro está pendente
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
    },

    // Métodos para gerenciar cartões
    getCartoes: async () => {
        try {
            const response = await api.get('/cartoes');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    adicionarCartao: async (cartaoData) => {
        try {
            const response = await api.post('/cartoes', cartaoData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    removerCartao: async (cartaoId) => {
        try {
            const response = await api.delete(`/cartoes/${cartaoId}`);
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
            console.log('A tentar aprovar anúncio:', anuncioId);
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
    rejeitarAnuncio: async (anuncioId, motivo) => {
        try {
            console.log('Tentando rejeitar anúncio:', { anuncioId, motivo });
            
            // Garantir que anuncioId seja um número
            const idAnuncio = parseInt(anuncioId);
            
            // Construir objeto de dados com ou sem motivo
            const dadosRejeicao = {};
            if (motivo !== null && motivo !== undefined) {
                dadosRejeicao.motivo = motivo;
            }
            
            console.log('Enviando dados para rejeição:', dadosRejeicao);
            
            // Incluir detalhes completos do request
            console.log('URL completa:', `${api.defaults.baseURL}/admin/anuncios/${idAnuncio}/rejeitar`);
            console.log('Headers:', api.defaults.headers);
            
            // Usar a rota alternativa para teste
            let response;
            try {
                // Tentar a rota normal primeiro
                response = await api.post(`/admin/anuncios/${idAnuncio}/rejeitar`, dadosRejeicao);
            } catch (initialError) {
                console.warn('Erro na rota normal, tentando rota de teste:', initialError);
                // Se falhar, tentar a rota de teste
                response = await api.post(`/test/rejeitar/${idAnuncio}`, dadosRejeicao);
            }
            
            console.log('Resposta da rejeição:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao rejeitar anúncio ${anuncioId}:`, error);
            console.error('Mensagem de erro:', error.message);
            if (error.response) {
                console.error('Status de erro:', error.response.status);
                console.error('Dados da resposta:', error.response.data);
            }
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
            console.log('Procurando anúncios com filtros:', filtros);
            // Este endpoint deve ser uma rota pública que não requer autenticação
            const response = await api.get('/anuncios', { params: filtros });
            console.log('Anúncios recebidos:', response.data?.length || 0);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter anúncios:', error);
            if (error.response?.status === 401) {
                console.log('Erro de autenticação, a tentar via endpoint público');
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
            const userStr = localStorage.getItem('user');
            let userId = null;
            
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    userId = user.ID_User;
                    console.log('ID do utilizador obtido do localStorage:', userId);
                } catch (e) {
                    console.error('Erro ao analisar dados do utilizador:', e);
                }
            }
            
            let response;
            
            // Se temos o ID do utilizador, usar a rota alternativa
            if (userId) {
                response = await api.get(`/user/${userId}/anuncios`);
                console.log('A usar rota alternativa para obter anúncios');
            } else {
                // Caso contrário, tentar a rota original
                response = await api.get('/meus-anuncios');
                console.log('A usar rota original para obter anúncios');
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
            // Diagnóstico completo do estado de autenticação
            console.log('==== DIAGNÓSTICO DE AUTENTICAÇÃO ====');
            console.log('localStorage.token:', localStorage.getItem('token'));
            console.log('localStorage.user (raw):', localStorage.getItem('user'));
            
            // Obter token e ID do usuário
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : {};
            
            // Verificar o ID correto do usuário
            console.log('Dados completos do usuário:', user);
            const userId = user.ID_User;
            
            console.log('ID do usuário extraído:', userId);
            console.log('Tipo do ID:', typeof userId);
            
            if (!token) {
                throw new Error('Usuário não autenticado');
            }
            
            console.log(`Atualizando anúncio ${id} para o usuário ${userId}`);
            
            // Criar uma cópia para debug
            const formEntries = {};
            for (let [key, value] of anuncioData.entries()) {
                if (key !== 'imagens') { // Não mostrar as imagens completas no log
                    formEntries[key] = value;
                }
            }
            console.log('Dados do formulário:', formEntries);
            
            // Adicionar o ID do usuário, se necessário
            if (!anuncioData.has('UtilizadorID_User')) {
                anuncioData.append('UtilizadorID_User', userId);
            }
            console.log('UtilizadorID_User definido para:', anuncioData.get('UtilizadorID_User'));
            
            // Usar axios diretamente para ter mais controle
            const response = await axios({
                method: 'post',
                url: `http://localhost:8000/api/anuncios/${id}?_method=PUT`,
                data: anuncioData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Resposta da atualização:', response.data);
            return response.data;
        } catch (error) {
            console.error(`Erro ao atualizar anúncio ${id}:`, error);
            console.error('Detalhes do erro:', error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    },
    
    // Excluir um anúncio
    excluirAnuncio: async (id) => {
        try {
            console.log(`Iniciando processo de exclusão do anúncio ${id}`);
            
            // Obter token para debug
            const token = localStorage.getItem('token');
            console.log('Token disponível:', !!token);
            
            // Verificar se o usuário está autenticado
            const userStr = localStorage.getItem('user');
            if (!userStr || !token) {
                console.error('Usuário não está autenticado');
                throw new Error('Você precisa estar autenticado para realizar esta ação');
            }
            
            const user = JSON.parse(userStr);
            console.log('ID do usuário:', user.ID_User);
            console.log('Tipo do usuário:', user.TipoUserID_TipoUser);
            
            // Configurar cabeçalhos manualmente para garantir que a autenticação funcione
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            
            console.log('Enviando requisição DELETE para:', `/anuncios/${id}`);
            const response = await api.delete(`/anuncios/${id}`, config);
            
            console.log('Anúncio excluído com sucesso:', response.data);
            return response.data;
        } catch (error) {
            // Extrair detalhes do erro para facilitar a depuração
            const statusCode = error.response?.status;
            const errorData = error.response?.data;
            
            console.error(`Erro ao excluir anúncio ${id}:`, error);
            console.error('Status:', statusCode);
            console.error('Detalhes do erro:', errorData);
            
            // Mensagens específicas baseadas no tipo de erro
            if (statusCode === 401) {
                throw new Error('Você precisa estar autenticado para remover este anúncio');
            } else if (statusCode === 403) {
                throw new Error('Você não tem permissão para remover este anúncio');
            } else if (statusCode === 404) {
                throw new Error('Anúncio não encontrado');
            } else {
                throw errorData || error.message;
            }
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
            console.log('Procurando anúncios da categoria:', categoriaId);
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

export const getUnreadMessagesCount = async () => {
  try {
    const response = await api.get('/mensagens/nao-lidas/contar');
    return response.data.unread_count || 0;
  } catch (error) {
    console.error('Erro ao buscar contagem de mensagens não lidas:', error);
    return 0;
  }
};

export default api;
