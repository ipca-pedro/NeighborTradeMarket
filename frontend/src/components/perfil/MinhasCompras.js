import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Badge } from 'react-bootstrap';
import api from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MinhasCompras = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                                        </div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MinhasCompras; 