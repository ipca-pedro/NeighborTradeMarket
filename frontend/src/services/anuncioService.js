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

    const getAnuncios = async (params = {}) => {
    try {
        const query = new URLSearchParams();
        if (params.search) query.append('search', params.search);
        if (params.categoria) query.append('categoria', params.categoria);
        // Adiciona outros filtros se necessário

        const response = await axios.get(`${API_URL}/anuncios/publicos?${query.toString()}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao procurar anúncios:', error);
        return [];
    }
};

const getCategorias = async () => {
    try {
        const response = await axios.get(`${API_URL}/categorias`);
        return response.data;
    } catch (error) {
        console.error('Erro ao obter categorias:', error);
        return [];
    }
};

const getAnunciosPorCategoria = async (categoriaId) => {
    try {
        const response = await axios.get(`${API_URL}/anuncios/categoria/${categoriaId}`);
        return response.data;
    } catch (error) {
        console.error(`Erro ao procurar anúncios da categoria ${categoriaId}:`, error);
        return [];
    }
};

export { getAnuncios, getAnunciosDestaque, getAnunciosPorTipo, getAnunciosAleatorios, getCategorias, getAnunciosPorCategoria };
