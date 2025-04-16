import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Row, Col, Modal } from 'react-bootstrap';
import { authService } from '../../services/api';

const Cartoes = () => {
    const [cartoes, setCartoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        Numero: '',
        CVC: '',
        Data: ''
    });

    useEffect(() => {
        carregarCartoes();
    }, []);

    const carregarCartoes = async () => {
        try {
            setLoading(true);
            const data = await authService.getCartoes();
            setCartoes(data);
            setError('');
        } catch (err) {
            setError('Erro ao carregar cartões. Por favor, tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await authService.adicionarCartao(formData);
            setMessage('Cartão adicionado com sucesso!');
            setFormData({ Numero: '', CVC: '', Data: '' });
            setShowModal(false);
            carregarCartoes();
        } catch (err) {
            setError('Erro ao adicionar cartão. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoverCartao = async (cartaoId) => {
        if (!window.confirm('Tem certeza que deseja remover este cartão?')) return;

        try {
            setLoading(true);
            await authService.removerCartao(cartaoId);
            setMessage('Cartão removido com sucesso!');
            carregarCartoes();
        } catch (err) {
            setError('Erro ao remover cartão. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Meus Cartões</h5>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus me-2"></i>Adicionar Cartão
                </Button>
            </Card.Header>
            <Card.Body>
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Carregando...</span>
                        </div>
                    </div>
                ) : cartoes.length === 0 ? (
                    <p className="text-center py-4 text-muted">
                        Nenhum cartão cadastrado. Adicione um cartão para facilitar suas compras.
                    </p>
                ) : (
                    <Row className="g-3">
                        {cartoes.map(cartao => (
                            <Col key={cartao.ID_Cartao} md={6} lg={4}>
                                <Card className="h-100">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div>
                                                <h6 className="mb-1">Cartão de Crédito</h6>
                                                <p className="text-muted mb-0">
                                                    **** **** **** {cartao.Numero.toString().slice(-4)}
                                                </p>
                                            </div>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => handleRemoverCartao(cartao.ID_Cartao)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </Button>
                                        </div>
                                        <div className="small text-muted">
                                            <div>Validade: {new Date(cartao.Data).toLocaleDateString()}</div>
                                            <div>CVC: ***</div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Card.Body>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Adicionar Cartão</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Número do Cartão</Form.Label>
                            <Form.Control
                                type="text"
                                name="Numero"
                                value={formData.Numero}
                                onChange={handleChange}
                                placeholder="1234 5678 9012 3456"
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>CVC</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="CVC"
                                        value={formData.CVC}
                                        onChange={handleChange}
                                        placeholder="123"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data de Validade</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="Data"
                                        value={formData.Data}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit" disabled={loading}>
                                {loading ? 'Adicionando...' : 'Adicionar Cartão'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Card>
    );
};

export default Cartoes; 