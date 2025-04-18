import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaCreditCard, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import './Cartoes.css';

const Cartoes = () => {
    const [cartoes, setCartoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [novoCartao, setNovoCartao] = useState({
        Numero: '',
        CVC: '',
        Data: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        carregarCartoes();
    }, []);

    const carregarCartoes = async () => {
        try {
            setLoading(true);
            const response = await api.get('/cartoes');
            setCartoes(response.data);
            setError('');
        } catch (err) {
            setError('Erro ao carregar cartões. Por favor, tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === 'Numero') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
        } else if (name === 'CVC') {
            formattedValue = value.replace(/\D/g, '');
        }

        setNovoCartao(prev => ({
            ...prev,
            [name]: formattedValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/cartoes', {
                Numero: novoCartao.Numero.replace(/\s/g, ''),
                CVC: novoCartao.CVC,
                Data: novoCartao.Data
            });
            setShowModal(false);
            setNovoCartao({ Numero: '', CVC: '', Data: '' });
            await carregarCartoes();
        } catch (err) {
            setError('Erro ao adicionar cartão. Por favor, verifique os dados e tente novamente.');
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRemoverCartao = async (cartaoId) => {
        if (window.confirm('Tem certeza que deseja remover este cartão?')) {
            try {
                await api.delete(`/cartoes/${cartaoId}`);
                await carregarCartoes();
            } catch (err) {
                setError('Erro ao remover cartão. Por favor, tente novamente.');
                console.error(err);
            }
        }
    };

    const formatNumeroCartao = (numero) => {
        if (!numero) return '';
        const numeroStr = String(numero);
        const cleaned = numeroStr.replace(/\D/g, '');
        const match = cleaned.match(/(\d{4})(\d{4})(\d{4})(\d{4})/);
        if (match) {
            return '**** **** **** ' + match[4];
        }
        return numeroStr;
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div className="cartoes-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Meus Cartões</h5>
                <Button variant="primary" className="btn-add-card" onClick={() => setShowModal(true)}>
                    <FaPlus className="me-2" />
                    Adicionar Novo Cartão
                </Button>
            </div>

            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            {cartoes.length === 0 ? (
                <div className="empty-state">
                    <FaCreditCard className="mb-3" />
                    <h5>Nenhum cartão cadastrado</h5>
                    <p>Adicione um cartão para começar a fazer compras</p>
                    <Button variant="primary" className="btn-add-card" onClick={() => setShowModal(true)}>
                        <FaPlus className="me-2" />
                        Adicionar Cartão
                    </Button>
                </div>
            ) : (
                <div className="cartoes-lista">
                    {cartoes.map(cartao => (
                        <Card key={cartao.ID_Cartao} className="cartao-card">
                            <div className="cartao-numero">
                                {formatNumeroCartao(cartao.Numero)}
                            </div>
                            <div className="cartao-validade">
                                Válido até: {cartao.Data}
                            </div>
                            <div className="cartao-actions">
                                <Button 
                                    variant="link" 
                                    className="text-white"
                                    onClick={() => handleRemoverCartao(cartao.ID_Cartao)}
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Novo Cartão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Número do Cartão</Form.Label>
                            <Form.Control
                                type="text"
                                name="Numero"
                                value={novoCartao.Numero}
                                onChange={handleInputChange}
                                placeholder="1234 5678 9012 3456"
                                required
                                maxLength="19"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Data de Validade</Form.Label>
                            <Form.Control
                                type="date"
                                name="Data"
                                value={novoCartao.Data}
                                onChange={handleInputChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>CVC</Form.Label>
                            <Form.Control
                                type="text"
                                name="CVC"
                                value={novoCartao.CVC}
                                onChange={handleInputChange}
                                placeholder="123"
                                required
                                maxLength="3"
                            />
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" disabled={submitting}>
                                {submitting ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Cartoes;
