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
        console.log('Iniciando criação de reclamação:', data); // Debug
        
        // Verificar token antes da requisição
        const token = localStorage.getItem('token');
        console.log('Token atual:', token ? 'Presente' : 'Ausente');
        
        const response = await api.post('/reclamacoes', {
            compraId: data.compraId,
            descricao: data.descricao
        });
        
        console.log('Resposta da criação:', response.data); // Debug
        return response.data;
    } catch (error) {
        console.error('Erro detalhado ao criar reclamação:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        
        // Se for erro de autenticação
        if (error.response?.status === 401) {
            throw new Error('Usuário não está autenticado. Por favor, faça login novamente.');
        }
        
        // Se for erro de permissão
        if (error.response?.status === 403) {
            throw new Error('Sem permissão para criar reclamação. Verifique se você é o comprador deste item.');
        }
        
        // Se for erro interno do servidor
        if (error.response?.status === 500) {
            throw new Error('Erro interno do servidor ao criar reclamação. Por favor, tente novamente.');
        }
        
        throw new Error(error.response?.data?.message || 'Erro ao criar reclamação: ' + error.message);
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
        console.log('Atualizando status da reclamação:', { id, status_id });
        const response = await api.patch(`/reclamacoes/${id}/status`, { 
            status_id: status_id 
        });
        console.log('Resposta da atualização:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar status:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw new Error(error.response?.data?.message || 'Erro ao atualizar status da reclamação');
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