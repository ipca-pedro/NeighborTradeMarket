import api from './api';

export const ReclamacaoService = {
    // Buscar todas as reclamações do usuário
    buscarMinhasReclamacoes: async () => {
        try {
            const response = await api.get('/reclamacoes/minhas');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Buscar todas as reclamações (admin)
    buscarTodasReclamacoes: async () => {
        try {
            const response = await api.get('/reclamacoes/todas');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Criar uma nova reclamação
    criarReclamacao: async (dados) => {
        try {
            const response = await api.post('/reclamacoes', dados);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Atualizar status da reclamação (admin)
    atualizarStatus: async (id, status) => {
        try {
            const response = await api.put(`/reclamacoes/${id}/status`, { status });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Enviar mensagem em uma reclamação
    enviarMensagem: async (reclamacaoId, mensagem) => {
        try {
            const response = await api.post(`/reclamacoes/${reclamacaoId}/mensagens`, { mensagem });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Buscar mensagens de uma reclamação
    buscarMensagens: async (reclamacaoId) => {
        try {
            const response = await api.get(`/reclamacoes/${reclamacaoId}/mensagens`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}; 