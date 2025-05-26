import api from './api';

export const criarAvaliacao = async (data) => {
    try {
        const response = await api.post('/avaliacoes/compra', data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao criar avaliação');
    }
};

export const buscarAvaliacoesRecebidas = async (vendedorId) => {
    try {
        const response = await api.get(`/avaliacoes/recebidas/${vendedorId}`);
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

export const buscarAvaliacoesVendedor = async (vendedorId) => {
    try {
        const response = await api.get(`/avaliacoes/vendedor/${vendedorId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao buscar avaliações do vendedor');
    }
};

export const buscarAvaliacaoPorCompra = async (compraId) => {
    try {
        const response = await api.get(`/avaliacoes/compra/${compraId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erro ao buscar avaliação');
    }
};