import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Badge, Button, Row, Col } from 'react-bootstrap';
import api from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MinhasVendas = () => {
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [atualizando, setAtualizando] = useState(false);

    useEffect(() => {
        carregarVendas();
    }, []);

    const carregarVendas = async () => {
        try {
            setLoading(true);
            const response = await api.get('/vendas/minhas');
            setVendas(response.data);
            setError('');
        } catch (err) {
            setError('Erro ao carregar vendas. Por favor, tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmarVenda = async (compraId) => {
        if (!window.confirm('Confirmar esta venda? Isso indica que você recebeu o pagamento e irá enviar o produto.')) {
            return;
        }

        try {
            setAtualizando(true);
            await api.post(`/vendas/${compraId}/confirmar`);
            await carregarVendas(); // Recarrega a lista
            alert('Venda confirmada com sucesso!');
        } catch (err) {
            alert('Erro ao confirmar venda: ' + (err.response?.data?.message || err.message));
        } finally {
            setAtualizando(false);
        }
    };

    const handleMarcarComoEnviado = async (compraId) => {
        if (!window.confirm('Marcar como enviado? Certifique-se de que o produto já foi realmente enviado.')) {
            return;
        }

        try {
            setAtualizando(true);
            await api.post(`/vendas/${compraId}/enviado`);
            await carregarVendas();
            alert('Produto marcado como enviado com sucesso!');
        } catch (err) {
            alert('Erro ao marcar como enviado: ' + (err.response?.data?.message || err.message));
        } finally {
            setAtualizando(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pendente':
                return 'warning';
            case 'confirmado':
                return 'success';
            case 'enviado':
                return 'info';
            case 'concluído':
                return 'primary';
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
        <div>
            <h5 className="mb-4">Minhas Vendas</h5>

            {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

            {vendas.length === 0 ? (
                <Alert variant="info">
                    Você ainda não tem vendas.
                </Alert>
            ) : (
                <Row>
                    {vendas.map(venda => (
                        <Col md={6} lg={4} key={venda.ID_Compra} className="mb-4">
                            <Card>
                                <Card.Header className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">Venda #{venda.ID_Compra}</span>
                                    <Badge bg={getStatusColor(venda.Status)}>
                                        {venda.Status}
                                    </Badge>
                                </Card.Header>
                                <Card.Body>
                                    <h6 className="mb-3">{venda.anuncio.Titulo}</h6>
                                    <p className="text-muted small mb-2">{venda.anuncio.Descricao}</p>
                                    <p className="mb-2">
                                        <strong>Preço:</strong> {formatCurrency(venda.anuncio.Preco)}
                                    </p>
                                    <p className="mb-3">
                                        <strong>Data da venda:</strong>{' '}
                                        {format(new Date(venda.Data_compra), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </p>
                                    
                                    <div className="border-top pt-3">
                                        <h6 className="mb-2">Informações do Comprador</h6>
                                        <p className="mb-1">
                                            <strong>Nome:</strong> {venda.comprador.Nome}
                                        </p>
                                        <p className="mb-1">
                                            <strong>Email:</strong> {venda.comprador.Email}
                                        </p>
                                    </div>

                                    {/* Ações baseadas no status */}
                                    <div className="mt-3 d-grid gap-2">
                                        {venda.Status === 'Pendente' && (
                                            <Button
                                                variant="success"
                                                size="sm"
                                                onClick={() => handleConfirmarVenda(venda.ID_Compra)}
                                                disabled={atualizando}
                                            >
                                                {atualizando ? 'Processando...' : 'Confirmar Venda'}
                                            </Button>
                                        )}
                                        
                                        {venda.Status === 'Confirmado' && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleMarcarComoEnviado(venda.ID_Compra)}
                                                disabled={atualizando}
                                            >
                                                {atualizando ? 'Processando...' : 'Marcar como Enviado'}
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default MinhasVendas; 