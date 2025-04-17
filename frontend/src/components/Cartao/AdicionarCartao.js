import React, { useState } from 'react';
import CartaoService from '../../services/CartaoService';
import './Cartao.css';

const AdicionarCartao = ({ onCartaoAdicionado, onClose }) => {
    const [cartao, setCartao] = useState({
        numero: '',
        nome: '',
        validade: '',
        cvc: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Formatação específica para cada campo
        switch (name) {
            case 'numero':
                formattedValue = value
                    .replace(/\D/g, '')
                    .slice(0, 16)
                    .replace(/(\d{4})(?=\d)/g, '$1 ');
                break;
            case 'validade':
                formattedValue = value
                    .replace(/\D/g, '')
                    .slice(0, 4)
                    .replace(/(\d{2})(\d)/, '$1/$2');
                break;
            case 'cvc':
                formattedValue = value.replace(/\D/g, '').slice(0, 3);
                break;
            default:
                break;
        }

        setCartao(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const validarCartao = () => {
        if (!cartao.numero || cartao.numero.replace(/\s/g, '').length !== 16) {
            setError('Número do cartão inválido');
            return false;
        }
        if (!cartao.nome) {
            setError('Nome do titular é obrigatório');
            return false;
        }
        if (!cartao.validade || cartao.validade.length !== 5) {
            setError('Data de validade inválida');
            return false;
        }
        if (!cartao.cvc || cartao.cvc.length !== 3) {
            setError('CVC inválido');
            return false;
        }

        // Validar data de validade
        const [mes, ano] = cartao.validade.split('/');
        const dataValidade = new Date(2000 + parseInt(ano), parseInt(mes) - 1);
        const hoje = new Date();
        
        if (dataValidade <= hoje) {
            setError('Cartão expirado');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validarCartao()) {
            return;
        }

        try {
            setLoading(true);
            const response = await CartaoService.adicionarCartao({
                ...cartao,
                numero: cartao.numero.replace(/\s/g, '')
            });

            if (onCartaoAdicionado) {
                onCartaoAdicionado(response.cartao);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao adicionar cartão');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Adicionar Novo Cartão</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Número do Cartão</label>
                        <input
                            type="text"
                            name="numero"
                            value={cartao.numero}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            className="form-control"
                        />
                    </div>

                    <div className="form-group">
                        <label>Nome do Titular</label>
                        <input
                            type="text"
                            name="nome"
                            value={cartao.nome}
                            onChange={handleInputChange}
                            placeholder="Nome como está no cartão"
                            className="form-control"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group half">
                            <label>Validade (MM/AA)</label>
                            <input
                                type="text"
                                name="validade"
                                value={cartao.validade}
                                onChange={handleInputChange}
                                placeholder="MM/AA"
                                className="form-control"
                            />
                        </div>

                        <div className="form-group half">
                            <label>CVC</label>
                            <input
                                type="text"
                                name="cvc"
                                value={cartao.cvc}
                                onChange={handleInputChange}
                                placeholder="123"
                                className="form-control"
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="modal-actions">
                        <button 
                            type="submit" 
                            className="btn-confirmar"
                            disabled={loading}
                        >
                            {loading ? 'Adicionando...' : 'Adicionar Cartão'}
                        </button>
                        <button 
                            type="button"
                            className="btn-cancelar"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdicionarCartao; 