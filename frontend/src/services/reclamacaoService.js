import api from './api';

export const buscarMinhasReclamacoes = async () => {
    try {
        const response = await api.get('/reclamacoes');
        return response.data;
    } catch (error) {
        throw new Error('Erro ao carregar reclamações: ' + error.message);
    }
};

export const buscarMensagens = async (reclamacaoId) => {
    try {
        const response = await api.get(`/reclamacoes/${reclamacaoId}/mensagens`);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao carregar mensagens: ' + error.message);
    }
};

export const enviarMensagem = async (reclamacaoId, mensagem) => {
    try {
        const response = await api.post(`/reclamacoes/${reclamacaoId}/mensagens`, {
            mensagem
        });
        return response.data;
    } catch (error) {
        throw new Error('Erro ao enviar mensagem: ' + error.message);
    }
};

export const criarReclamacao = async (data) => {
    try {
        const response = await api.post('/reclamacoes', {
            Descricao: data.descricao,
            DataReclamacao: new Date().toISOString(),
            CompraID_Compra: data.compraId,
            Status_ReclamacaoID_Status_Reclamacao: 1 // Status inicial (pendente)
        });
        return response.data;
    } catch (error) {
        throw new Error('Erro ao criar reclamação: ' + error.message);
    }
};

export const atualizarStatusReclamacao = async (reclamacaoId, status) => {
    try {
        const response = await api.put(`/reclamacoes/${reclamacaoId}/status`, {
            status
        });
        return response.data;
    } catch (error) {
        throw new Error('Erro ao atualizar status da reclamação: ' + error.message);
    }
};

export const buscarTodasReclamacoes = async () => {
    try {
        const response = await api.get('/reclamacoes/todas');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const atualizarStatus = async (id, status) => {
    try {
        const response = await api.put(`/reclamacoes/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
}; 