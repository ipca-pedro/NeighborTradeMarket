import api from './api';

const trocaService = {
    // Propor uma troca entre dois anúncios
    proporTroca: async (anuncioDesejadoId, meuAnuncioId) => {
        try {
            console.log(`Propondo troca: Anúncio desejado ID ${anuncioDesejadoId}, Meu anúncio ID ${meuAnuncioId}`);
            const response = await api.post('/trocas', {
                item_oferecido_id: meuAnuncioId,
                item_solicitado_id: anuncioDesejadoId
            });
            console.log('Resposta da API de troca:', response.data);
            return response;
        } catch (error) {
            console.error('Erro na API de troca:', error);
            if (error.response) {
                console.error('Erro detalhado:', error.response.data);
            }
            throw error;
        }
    },

    // Obter propostas recebidas
    getPropostasRecebidas: async () => {
        return await api.get('/trocas/recebidas/pendentes');
    },

    // Obter propostas enviadas
    getPropostasEnviadas: async () => {
        return await api.get('/trocas/enviadas/pendentes');
    },

    // Aceitar uma proposta
    aceitarProposta: async (propostaId) => {
        return await api.post(`/trocas/${propostaId}/aceitar`);
    },

    // Rejeitar uma proposta
    rejeitarProposta: async (propostaId, motivo) => {
        return await api.post(`/trocas/${propostaId}/rejeitar`, { motivo });
    },

    // Cancelar uma proposta
    cancelarProposta: async (propostaId) => {
        return await api.post(`/trocas/${propostaId}/cancelar`);
    },

    // Obter detalhes de uma proposta específica
    getProposta: async (propostaId) => {
        return await api.get(`/trocas/${propostaId}`);
    }
};

export default trocaService; 