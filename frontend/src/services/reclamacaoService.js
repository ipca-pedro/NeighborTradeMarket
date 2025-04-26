import api from './api';

export const buscarMinhasReclamacoes = async () => {
    try {
        const response = await api.get('/reclamacoes');
        return Array.isArray(response.data) ? response.data : [response.data];
    } catch (error) {
        throw new Error('Erro ao buscar reclamações: ' + error.message);
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
            mensagem: mensagem
        });
        return response.data;
    } catch (error) {
        throw new Error('Erro ao enviar mensagem: ' + error.message);
    }
};

export const criarReclamacao = async (data) => {
    try {
        const response = await api.post('/reclamacoes', {
            compraId: data.compraId,
            descricao: data.descricao
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

export const atualizarStatus = async (id, status_id) => {
    try {
        const response = await api.patch(`/reclamacoes/${id}/status`, { status_id });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const buscarReclamacaoPorId = async (id) => {
    try {
        const response = await api.get(`/reclamacoes/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar reclamação: ' + error.message);
    }
};

export const buscarParticipantes = async (reclamacaoId) => {
    try {
        const response = await api.get(`/reclamacoes/${reclamacaoId}/participantes`);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar participantes: ' + error.message);
    }
}; 