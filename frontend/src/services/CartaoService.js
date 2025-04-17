import axios from 'axios';

const CartaoService = {
    // Obter todos os cartões do Utilizador 
    getCartoes: async () => {
        const response = await axios.get('http://localhost:8000/api/cartoes');
        return response.data;
    },

    // Adicionar novo cartão
    adicionarCartao: async (dadosCartao) => {
        const response = await axios.post('http://localhost:8000/api/cartoes', dadosCartao);
        return response.data;
    },

    // Remover cartão
    removerCartao: async (cartaoId) => {
        const response = await axios.delete(`http://localhost:8000/api/cartoes/${cartaoId}`);
        return response.data;
    }
};

export default CartaoService; 