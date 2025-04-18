import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Badge, Button, Modal, Form } from 'react-bootstrap';
import api from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MinhasCompras = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showReclamacaoModal, setShowReclamacaoModal] = useState(false);
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [reclamacao, setReclamacao] = useState('');
    const [submittingReclamacao, setSubmittingReclamacao] = useState(false);

    useEffect(() => {
        carregarCompras();
    }, []);

    const carregarCompras = async () => {
        try {
            setLoading(true);
            const response = await api.get('/compras/minhas');
            setCompras(response.data);
            setError('');
        } catch (err) {
            setError('Erro ao carregar compras. Por favor, tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReclamacao = (compra) => {
        setSelectedCompra(compra);
        setShowReclamacaoModal(true);
    };

    const handleSubmitReclamacao = async () => {
        if (!reclamacao.trim()) {
            return;
        }

        try {
            setSubmittingReclamacao(true);
            await api.post(`/reclamacoes/compra/${selectedCompra.ID_Compra}`, {
                descricao: reclamacao
            });

            // Atualizar a lista de compras
            await carregarCompras();
            
            // Limpar e fechar o modal
            setReclamacao('');
            setShowReclamacaoModal(false);
            setSelectedCompra(null);

            // Mostrar mensagem de sucesso
            alert('Reclamação enviada com sucesso!');

        } catch (err) {
            console.error(err);
            alert('Erro ao enviar reclamação. Por favor, tente novamente.');
        } finally {
            setSubmittingReclamacao(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pendente':
                return 'warning';
            case 'confirmado':
                return 'success';
            case 'cancelado':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
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
        <>
            <div>
                <h5 className="mb-4">Minhas Compras</h5>

                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                {compras.length === 0 ? (
                    <Alert variant="info">
                        Você ainda não realizou nenhuma compra.
                    </Alert>
                ) : (
                    <div className="compras-lista">
                        {compras.map(compra => (
                            <Card key={compra.ID_Compra} className="mb-3">
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">Compra #{compra.ID_Compra}</span>
                                    <Badge bg={getStatusColor(compra.Status)}>
                                        {compra.Status}
                                    </Badge>
                                </Card.Header>
                                <Card.Body>
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h6 className="mb-3">{compra.anuncio.Titulo}</h6>
                                            <p className="text-muted mb-2">{compra.anuncio.Descricao}</p>
                                            <p className="mb-2">
                                                <strong>Preço:</strong> {formatCurrency(compra.anuncio.Preco)}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Data da compra:</strong>{' '}
                                                {format(new Date(compra.Data_compra), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                            </p>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="border-start ps-3">
                                                <h6 className="mb-2">Informações do Vendedor</h6>
                                                <p className="mb-1">
                                                    <strong>Nome:</strong> {compra.anuncio.utilizador.Nome}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Email:</strong> {compra.anuncio.utilizador.Email}
                                                </p>
                                                <div className="mt-3">
                                                    {compra.Status === 'Confirmado' && !compra.temReclamacao && (
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleReclamacao(compra)}
                                                        >
                                                            Fazer Reclamação
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Reclamação */}
            <Modal show={showReclamacaoModal} onHide={() => setShowReclamacaoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Fazer Reclamação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Descreva o problema:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={reclamacao}
                                onChange={(e) => setReclamacao(e.target.value)}
                                placeholder="Descreva detalhadamente o problema com a sua compra..."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReclamacaoModal(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleSubmitReclamacao}
                        disabled={submittingReclamacao || !reclamacao.trim()}
                    >
                        {submittingReclamacao ? 'Enviando...' : 'Enviar Reclamação'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MinhasCompras; 