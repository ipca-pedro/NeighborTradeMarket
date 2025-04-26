import api from './api';

export const criarAvaliacao = async (dados) => {
    try {
        console.log('Enviando avaliação:', dados);
        const response = await api.post('/avaliacoes/compra', dados);
        return response.data;
    } catch (error) {
        console.error('Erro detalhado ao criar avaliação:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        
        // Se for erro de validação
        if (error.response?.status === 422) {
            const mensagem = error.response.data?.message || 
                           Object.values(error.response.data?.errors || {}).flat().join(', ');
            throw new Error(mensagem || 'Dados inválidos para avaliação');
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