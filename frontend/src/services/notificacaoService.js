import api from './api';

export const buscarMinhasNotificacoes = async () => {
    try {
        const response = await api.get('/notificacoes');
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar notificações: ' + error.message);
    }
};

export const marcarComoLida = async (id) => {
    try {
        const response = await api.post(`/notificacoes/${id}/lida`);
        return response.data;
    } catch (error) {
        throw new Error('Erro ao marcar notificação como lida: ' + error.message);
    }
};

export const marcarTodasComoLidas = async () => {
    try {
        const response = await api.post('/notificacoes/todas-lidas');
        return response.data;
    } catch (error) {
        throw new Error('Erro ao marcar todas as notificações como lidas: ' + error.message);
    }
};

export const contarNaoLidas = async () => {
    try {
        const response = await api.get('/notificacoes/nao-lidas/contar');
        return response.data.count;
    } catch (error) {
        throw new Error('Erro ao contar notificações não lidas: ' + error.message);
    }
};

export const buscarNaoLidas = async () => {
    try {
        const response = await api.get('/notificacoes/nao-lidas');
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar notificações não lidas: ' + error.message);
    }
}; 