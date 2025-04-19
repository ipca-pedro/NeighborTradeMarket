import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:8000/api';

class CompraService {
    // Iniciar uma nova compra
    async iniciarCompra(anuncioId, cartaoId) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Utilizador não autenticado');
            }

            const response = await axios.post(`${API_URL}/compras/anuncio/${anuncioId}`, {
                cartao_id: cartaoId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data.error || 'Erro ao iniciar compra');
            } else if (error.request) {
                throw new Error('Não foi possível conectar ao servidor');
            } else {
                throw new Error('Erro ao processar a requisição');
            }
        }
    }

    // Listar minhas compras
    async minhasCompras() {
        try {
            const response = await api.get('/compras/minhas');
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Erro ao buscar compras';
        }
    }

    // Listar minhas vendas
    async minhasVendas() {
        try {
            const response = await api.get('/compras/vendas');
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Erro ao buscar vendas';
        }
    }

    // Obter detalhes de uma compra
    async detalhesCompra(compraId) {
        const response = await api.get(`/compras/${compraId}/detalhes`);
        return response.data;
    }

    // Atualizar status da compra (para vendedores)
    async atualizarStatus(compraId, statusId) {
        try {
            const response = await api.put(`/compras/${compraId}/status`, {
                status_id: statusId
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Erro ao atualizar status';
        }
    }

    // Cancelar uma compra (para compradores)
    async cancelarCompra(compraId) {
        try {
            const response = await api.delete(`/compras/${compraId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Erro ao cancelar compra';
        }
    }

    // Confirmar recebimento (para compradores)
    async confirmarRecebimento(compraId) {
        const response = await api.post(`/compras/${compraId}/confirmar-recebimento`);
        return response.data;
    }

    // Obter vendas de um anúncio específico
    async vendasAnuncio(anuncioId) {
        const response = await api.get(`/compras/anuncio/${anuncioId}`);
        return response.data;
    }

    // Obter opções de status disponíveis
    async getStatusOptions() {
        const response = await api.get('/compras/status-options');
        return response.data;
    }

    // Verificar se o utilizador tem cartão associado
    async verificarCartao() {
        const response = await api.get('/utilizador/cartao');
        return response.data;
    }
}

export default new CompraService();

export const buscarMinhasCompras = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Utilizador não autenticado');
        }

        const response = await api.get('/compras/minhas', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        console.log('Resposta das compras:', response.data); // Debug
        return response.data;
    } catch (error) {
        console.error('Erro detalhado:', error.response || error); // Debug
        throw new Error('Erro ao buscar compras: ' + error.message);
    }
};

export const buscarCompraPorId = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Utilizador não autenticado');
        }

        const response = await api.get(`/compras/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error('Erro ao buscar compra: ' + error.message);
    }
}; 