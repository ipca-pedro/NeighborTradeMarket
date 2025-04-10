import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAnunciosDestaque = async () => {
    try {
        const response = await axios.get(`${API_URL}/anuncios`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar anúncios em destaque:', error);
        return [];
    }
};

const getAnunciosPorTipo = async (tipoItemId) => {
    try {
        const response = await axios.get(`${API_URL}/anuncios/tipo/${tipoItemId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao buscar anúncios do tipo ${tipoItemId}:`, error);
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

export { getAnunciosDestaque, getAnunciosPorTipo, procurarAnuncios };
