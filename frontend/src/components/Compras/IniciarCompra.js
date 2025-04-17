import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Row, Col, Card, Form } from 'react-bootstrap';
import CompraService from '../../services/CompraService';
import { authService } from '../../services/api';
import './Compras.css';

const AdicionarCartaoForm = ({ onCartaoAdicionado, onCancel }) => {
    const [formData, setFormData] = useState({
        Numero: '',
        CVC: '',
        Data: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Remover espaços e caracteres não numéricos
        const numeroLimpo = formData.Numero.replace(/\D/g, '');
        const cvcLimpo = formData.CVC.replace(/\D/g, '');

        // Validações
        if (numeroLimpo.length !== 16) {
            setError('O número do cartão deve ter 16 dígitos');
            setLoading(false);
            return;
        }

        if (cvcLimpo.length !== 3) {
            setError('O CVC deve ter 3 dígitos');
            setLoading(false);
            return;
        }

        if (!formData.Data) {
            setError('A data de validade é obrigatória');
            setLoading(false);
            return;
        }

        const dataValidade = new Date(formData.Data);
        const hoje = new Date();
        if (dataValidade <= hoje) {
            setError('A data de validade deve ser futura');
            setLoading(false);
            return;
        }

        try {
            const dadosCartao = {
                Numero: numeroLimpo,
                CVC: cvcLimpo,
                Data: formData.Data
            };

            const response = await authService.adicionarCartao(dadosCartao);
            onCartaoAdicionado(response);
        } catch (err) {
            if (err.errors) {
                // Erros de validação do backend
                const mensagensErro = Object.values(err.errors).flat();
                setError(mensagensErro.join('. '));
            } else {
                setError(err.message || 'Erro ao adicionar cartão. Verifique os dados e tente novamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleNumeroChange = (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        // Formatar com espaços a cada 4 dígitos
        valor = valor.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
        setFormData(prev => ({ ...prev, Numero: valor }));
    };

    const handleCVCChange = (e) => {
        let valor = e.target.value.replace(/\D/g, '').slice(0, 3);
        setFormData(prev => ({ ...prev, CVC: valor }));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Número do Cartão</Form.Label>
                <Form.Control
                    type="text"
                    value={formData.Numero}
                    onChange={handleNumeroChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19" // 16 dígitos + 3 espaços
                    required
                />
            </Form.Group>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>CVC</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.CVC}
                            onChange={handleCVCChange}
                            placeholder="123"
                            maxLength="3"
                            required
                        />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Data de Validade</Form.Label>
                        <Form.Control
                            type="date"
                            value={formData.Data}
                            onChange={(e) => setFormData(prev => ({ ...prev, Data: e.target.value }))}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>

            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

            <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={onCancel} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'A adicionar...' : 'Adicionar Cartão'}
                </Button>
            </div>
        </Form>
    );
};

const IniciarCompra = ({ anuncioId, titulo, preco, onCompraRealizada }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [cartoes, setCartoes] = useState([]);
    const [cartaoSelecionado, setCartaoSelecionado] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        if (showModal) {
            carregarCartoes();
        }
    }, [showModal]);

    const carregarCartoes = async () => {
        try {
            setLoading(true);
            const data = await authService.getCartoes();
            setCartoes(data);
            
            if (data.length === 1) {
                setCartaoSelecionado(data[0]);
            }
        } catch (err) {
            setError('Erro ao carregar cartões');
        } finally {
            setLoading(false);
        }
    };

    const validarCartao = (cartao) => {
        if (!cartao) return false;
        const dataValidade = new Date(cartao.Data);
        const hoje = new Date();
        return dataValidade > hoje;
    };

    const handleCartaoAdicionado = async (novoCartao) => {
        await carregarCartoes();
        setMostrarFormulario(false);
        // Seleciona o cartão recém adicionado
        const cartoes = await authService.getCartoes();
        const cartaoAdicionado = cartoes[cartoes.length - 1];
        setCartaoSelecionado(cartaoAdicionado);
    };

    const handleIniciarCompra = async () => {
        if (!cartaoSelecionado) {
            setError('Por favor, selecione um cartão');
            return;
        }

        if (!validarCartao(cartaoSelecionado)) {
            setError('O cartão selecionado está fora da validade');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const response = await CompraService.iniciarCompra(anuncioId, cartaoSelecionado.ID_Cartao);
            
            if (onCompraRealizada) {
                onCompraRealizada(response);
            }
            
            setShowModal(false);
        } catch (err) {
            if (err.message === 'Usuário não autenticado') {
                // Redirect to login page
                window.location.href = '/login';
            } else {
                setError(err.message || 'Erro ao iniciar compra');
            }
        } finally {
            setLoading(false);
        }
    };

    const CompraModal = () => (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Confirmar Compra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {mostrarFormulario ? (
                    <div>
                        <h5 className="mb-3">Adicionar Cartão</h5>
                        <AdicionarCartaoForm
                            onCartaoAdicionado={handleCartaoAdicionado}
                            onCancel={() => cartoes.length > 0 && setMostrarFormulario(false)}
                        />
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <h5>Detalhes da Compra</h5>
                            <p><strong>Artigo:</strong> {titulo}</p>
                            <p><strong>Valor:</strong> €{preco.toFixed(2)}</p>
                        </div>

                        <h5>Selecione um Cartão</h5>
                        {loading ? (
                            <div className="text-center py-4">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">A carregar...</span>
                                </div>
                            </div>
                        ) : cartoes.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="mb-4">Não tem nenhum cartão registado.</p>
                                <Button 
                                    variant="primary"
                                    onClick={() => setMostrarFormulario(true)}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Adicionar Cartão
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Row className="g-3 mb-3">
                                    {cartoes.map(cartao => (
                                        <Col key={cartao.ID_Cartao} md={6}>
                                            <Card 
                                                className={`h-100 cursor-pointer ${cartao.ID_Cartao === cartaoSelecionado?.ID_Cartao ? 'border-success bg-light' : ''}`}
                                                onClick={() => setCartaoSelecionado(cartao)}
                                            >
                                                <Card.Body>
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <h6 className="mb-1">Cartão de Crédito</h6>
                                                            <p className="text-muted mb-0">
                                                                **** **** **** {cartao.Numero.toString().slice(-4)}
                                                            </p>
                                                        </div>
                                                        {cartao.ID_Cartao === cartaoSelecionado?.ID_Cartao && (
                                                            <i className="fas fa-check-circle text-success"></i>
                                                        )}
                                                    </div>
                                                    <div className="small text-muted mt-2">
                                                        <div>Validade: {new Date(cartao.Data).toLocaleDateString()}</div>
                                                        {!validarCartao(cartao) && (
                                                            <div className="text-danger">
                                                                <i className="fas fa-exclamation-circle me-1"></i>
                                                                Cartão fora da validade
                                                            </div>
                                                        )}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                                <div className="d-grid">
                                    <Button 
                                        variant="outline-primary"
                                        onClick={() => setMostrarFormulario(true)}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Adicionar Novo Cartão
                                    </Button>
                                </div>
                            </>
                        )}
                    </>
                )}

                {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            </Modal.Body>
            {!mostrarFormulario && cartoes.length > 0 && (
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowModal(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="success"
                        onClick={handleIniciarCompra}
                        disabled={loading || !cartaoSelecionado || !validarCartao(cartaoSelecionado)}
                    >
                        {loading ? 'A processar...' : 'Confirmar Compra'}
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );

    return (
        <>
            <Button 
                variant="primary"
                onClick={() => setShowModal(true)}
            >
                <i className="fas fa-shopping-cart me-2"></i>
                Comprar
            </Button>
            {showModal && <CompraModal />}
        </>
    );
};

export default IniciarCompra; 