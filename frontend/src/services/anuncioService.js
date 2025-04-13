import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAnunciosDestaque = async () => {
    try {
        const response = await axios.get(`${API_URL}/anuncios`);
        return response.data;
    } catch (error) {
        console.error('Erro ao procurar anúncios em destaque:', error);
        return [];
    }
};

const getAnunciosPorTipo = async (tipoItemId) => {
    try {
        const response = await axios.get(`${API_URL}/anuncios/tipo/${tipoItemId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao procurar anúncios do tipo ${tipoItemId}:`, error);
        return [];
    }
};

const procurarAnuncios = async (termo) => {
    try {
        const response = await axios.get(`${API_URL}/anuncios/procurar`, {
            params: { q: termo }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao procurar anúncios:', error);
        return { resultados: [], total: 0 };
    }
};

const getAnunciosAleatorios = async (quantidade = 10, tipoItem = null) => {
    try {
        const params = { quantidade };
        if (tipoItem) params.tipo = tipoItem;
        
        const response = await axios.get(`${API_URL}/anuncios/aleatorios`, { params });
        return response.data;
    } catch (error) {
        console.error('Erro ao procurar anúncios aleatórios:', error);
        return [];
    }
};

export { getAnunciosDestaque, getAnunciosPorTipo, procurarAnuncios, getAnunciosAleatorios };
