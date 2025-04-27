import api from './api';

export const criarAvaliacao = async (dados) => {
    try {
        // Log dos dados enviados
        console.log('Dados da avaliação sendo enviados:', dados);
        
        // Verificar token e usuário
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        console.log('Debug avaliação:', {
            token: !!token,
            userId: user.ID_User,
            compraId: dados.compra_id
        });

        // Verificar se temos o ID do usuário
        if (!user.ID_User) {
            throw new Error('ID do usuário não encontrado. Por favor, faça login novamente.');
        }

        // Log do estado da requisição
        console.log('Iniciando requisição POST para /avaliacoes/compra');
        
        const response = await api.post('/avaliacoes/compra', dados);
        console.log('Resposta da API:', response);
        
        return response.data;
    } catch (error) {
        console.error('Erro detalhado ao criar avaliação:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
            config: error.config
        });
        
        // Se for erro de validação
        if (error.response?.status === 422) {
            const mensagem = error.response.data?.message || 
                           Object.values(error.response.data?.errors || {}).flat().join(', ');
            throw new Error(mensagem || 'Dados inválidos para avaliação');
        }
        
        // Se for erro de autorização
        if (error.response?.status === 403) {
            throw new Error('Você não tem permissão para avaliar esta compra. Verifique se você é o comprador.');
        }
        
        throw new Error(error.response?.data?.message || 'Erro ao criar avaliação');
    }
};

export const buscarAvaliacoesRecebidas = async () => {
    try {
        const response = await api.get('/avaliacoes/recebidas');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar avaliações recebidas:', error);
        throw error.response?.data?.message || 'Erro ao buscar avaliações recebidas';
    }
};

export const buscarAvaliacoesEnviadas = async () => {
    try {
        const response = await api.get('/avaliacoes/enviadas');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar avaliações enviadas:', error);
        throw error.response?.data?.message || 'Erro ao buscar avaliações enviadas';
    }
};

export const buscarNotas = async () => {
    try {
        const response = await api.get('/avaliacoes/notas');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar notas disponíveis:', error);
        throw error.response?.data?.message || 'Erro ao buscar notas disponíveis';
    }
};

export const responderAvaliacao = async (avaliacaoId, resposta) => {
    try {
        const response = await api.post(`/avaliacoes/${avaliacaoId}/responder`, { resposta });
        return response.data;
    } catch (error) {
        console.error('Erro ao responder avaliação:', error);
        throw error.response?.data?.message || 'Erro ao responder avaliação';
    }
};

export const buscarEstatisticasUsuario = async (userId) => {
    try {
        const response = await api.get(`/avaliacoes/estatisticas/${userId || ''}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar estatísticas do usuário:', error);
        throw error.response?.data?.message || 'Erro ao buscar estatísticas do usuário';
    }
};

export const buscarAvaliacoesPendentes = async () => {
    try {
        const response = await api.get('/avaliacoes/pendentes');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar avaliações pendentes:', error);
        throw error.response?.data?.message || 'Erro ao buscar avaliações pendentes';
    }
};