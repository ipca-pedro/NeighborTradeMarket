import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Badge, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const DetalhesProduto = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        carregarProduto();
    }, [id]);

    const carregarProduto = async () => {
        try {
            const response = await api.getProduto(id);
            setProduto(response.data);
        } catch (err) {
            setError('Erro ao carregar produto');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!produto) {
        return <Alert variant="warning">Produto não encontrado</Alert>;
    }

    return (
        <Container className="mt-4">
            <Row>
                <Col md={6}>
                    {produto.imagens && produto.imagens.length > 0 && (
                        <Image 
                            src={`${process.env.REACT_APP_API_URL}/storage/${produto.imagens[0].Url}`}
                            fluid 
                            rounded
                        />
                    )}
                    {produto.imagens && produto.imagens.length > 1 && (
                        <Row className="mt-3">
                            {produto.imagens.slice(1).map((imagem, index) => (
                                <Col key={imagem.id} xs={4} className="mb-3">
                                    <Image 
                                        src={`${process.env.REACT_APP_API_URL}/storage/${imagem.Url}`}
                                        fluid 
                                        rounded
                                        style={{ cursor: 'pointer' }}
                                    />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
                <Col md={6}>
                    <h2>{produto.Nome}</h2>
                    <h3 className="text-primary mb-4">R$ {produto.Preco.toFixed(2)}</h3>
                    
                    <div className="mb-3">
                        <Badge bg="secondary" className="me-2">
                            {produto.Categoria}
                        </Badge>
                        <Badge bg="info">
                            {produto.Condicao}
                        </Badge>
                    </div>

                    <div className="mb-4">
                        <h5>Descrição</h5>
                        <p>{produto.Descricao}</p>
                    </div>

                    <div className="mb-4">
                        <h5>Vendedor</h5>
                        <p>{produto.vendedor.Name}</p>
                    </div>

                    <Button variant="success" size="lg" className="w-100 mb-2">
                        Comprar
                    </Button>
                    <Button variant="outline-primary" size="lg" className="w-100">
                        Conversar com Vendedor
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default DetalhesProduto;
