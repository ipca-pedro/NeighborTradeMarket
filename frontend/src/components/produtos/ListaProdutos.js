import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ListaProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const response = await api.getProdutos();
            setProdutos(response.data);
        } catch (err) {
            setError('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Produtos Disponíveis</h2>
            <Row>
                {produtos.map(produto => (
                    <Col key={produto.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <Card>
                            {produto.imagens && produto.imagens.length > 0 && (
                                <Card.Img 
                                    variant="top" 
                                    src={`${process.env.REACT_APP_API_URL}/storage/${produto.imagens[0].Url}`}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <Card.Body>
                                <Card.Title>{produto.Nome}</Card.Title>
                                <Card.Text>
                                    R$ {produto.Preco.toFixed(2)}
                                </Card.Text>
                                <div className="mb-2">
                                    <Badge bg="secondary" className="me-2">
                                        {produto.Categoria}
                                    </Badge>
                                    <Badge bg="info">
                                        {produto.Condicao}
                                    </Badge>
                                </div>
                                <Link 
                                    to={`/produtos/${produto.id}`}
                                    className="btn btn-primary btn-sm"
                                >
                                    Ver Detalhes
                                </Link>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ListaProdutos;
