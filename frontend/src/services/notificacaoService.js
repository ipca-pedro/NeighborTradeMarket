import api from './api';

export const notificacaoService = {
    // Buscar todas as notificações do usuário
    buscarNotificacoes: async () => {
        try {
            const response = await api.get('/notificacoes');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
            throw error;
        }
    },

    // Marcar uma notificação como lida
    marcarComoLida: async (notificacaoId) => {
        try {
            const response = await api.post(`/notificacoes/${notificacaoId}/lida`);
            return response.data;
        } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error);
            throw error;
        }
    },

    // Marcar todas as notificações como lidas
    marcarTodasComoLidas: async () => {
        try {
            const response = await api.post('/notificacoes/marcar-todas-lidas');
            return response.data;
        } catch (error) {
            console.error('Erro ao marcar todas notificações como lidas:', error);
            throw error;
        }
    },

    buscarNaoLidas: async () => {
        try {
            const response = await api.get('/notificacoes/nao-lidas');
            return response.data;
        } catch (error) {
            console.error('Erro ao buscar notificações não lidas:', error);
            return [];
        }
    },

    contarNaoLidas: async () => {
        try {
            const response = await api.get('/notificacoes/nao-lidas/contar');
            return response.data.count;
        } catch (error) {
            console.error('Erro ao contar notificações não lidas:', error);
            return 0;
        }
    },

    excluirNotificacao: async (id) => {
        try {
            const response = await api.delete(`/notificacoes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir notificação:', error);
            throw new Error('Erro ao excluir notificação');
        }
    },

    excluirTodasLidas: async () => {
        try {
            const response = await api.delete('/notificacoes/lidas');
            return response.data;
        } catch (error) {
            console.error('Erro ao excluir notificações lidas:', error);
            throw new Error('Erro ao excluir notificações lidas');
        }
    }
}; 