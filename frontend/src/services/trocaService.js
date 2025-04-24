import api from './api';

const trocaService = {
    // Propor uma troca entre dois anúncios
    proporTroca: async (anuncioDesejadoId, meuAnuncioId) => {
        return await api.post('/trocas/propor', {
            anuncio_desejado_id: anuncioDesejadoId,
            anuncio_proposto_id: meuAnuncioId
        });
    },

    // Obter propostas recebidas
    getPropostasRecebidas: async () => {
        return await api.get('/trocas/recebidas');
    },

    // Obter propostas enviadas
    getPropostasEnviadas: async () => {
        return await api.get('/trocas/enviadas');
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