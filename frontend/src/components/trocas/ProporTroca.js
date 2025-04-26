import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import anuncioService from '../../services/anuncioService';
import trocaService from '../../services/trocaService';
import { formatarPreco } from '../../utils/formatUtils';

const ProporTroca = () => {
    const { anuncioId } = useParams();
    const navigate = useNavigate();
    
    const [anuncioDesejado, setAnuncioDesejado] = useState(null);
    const [meusAnuncios, setMeusAnuncios] = useState([]);
    const [selectedAnuncioId, setSelectedAnuncioId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarDados();
    }, [anuncioId]);

    const carregarDados = async () => {
        try {
            setLoading(true);
            
            // Carregar anúncio desejado
            const resAnuncioDesejado = await anuncioService.getAnuncio(anuncioId);
            setAnuncioDesejado(resAnuncioDesejado.data);

            // Carregar anúncios do usuário
            const resMeusAnuncios = await anuncioService.getMeusAnuncios();
            
            // Filtrar apenas anúncios ativos e diferentes do anúncio desejado
            const anunciosAtivos = resMeusAnuncios.data.filter(anuncio => 
                anuncio.Status_AnuncioID_Status_Anuncio === 1 && anuncio.ID_Anuncio !== parseInt(anuncioId)
            );
            
            setMeusAnuncios(anunciosAtivos);
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
            toast.error('Erro ao carregar dados. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedAnuncioId) {
            toast.warning('Por favor, selecione um anúncio para propor a troca.');
            return;
        }

        try {
            await trocaService.proporTroca(anuncioId, selectedAnuncioId);
            toast.success('Proposta de troca enviada com sucesso!');
            navigate('/minhas-propostas');
        } catch (error) {
            console.error('Erro ao propor troca:', error);
            toast.error('Erro ao enviar proposta de troca. Por favor, tente novamente.');
        }
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h2 className="mb-4">Propor Troca</h2>
            <Row>
                <Col md={6}>
                    <Card className="mb-4">
                        <Card.Header>
                            <h5 className="mb-0">Anúncio Desejado</h5>
                        </Card.Header>
                        <Card.Body>
                            {anuncioDesejado && (
                                <>
                                    <h4>{anuncioDesejado.Titulo}</h4>
                                    <p className="text-muted">{anuncioDesejado.Descricao}</p>
                                    <p><strong>Valor:</strong> {formatarPreco(anuncioDesejado.Preco)}</p>
                                    <p><strong>Categoria:</strong> {anuncioDesejado.categorium?.Descricao_Categoria}</p>
                                    <p><strong>Tipo:</strong> {anuncioDesejado.tipo_item?.Descricao_TipoItem}</p>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">Selecione seu Anúncio para Troca</h5>
                        </Card.Header>
                        <Card.Body>
                            {meusAnuncios.length === 0 ? (
                                <p className="text-muted">
                                    Você não possui anúncios ativos disponíveis para troca.
                                </p>
                            ) : (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Escolha um anúncio seu para propor a troca:</Form.Label>
                                        <Form.Select 
                                            value={selectedAnuncioId}
                                            onChange={(e) => setSelectedAnuncioId(e.target.value)}
                                            required
                                        >
                                            <option value="">Selecione um anúncio</option>
                                            {meusAnuncios.map(anuncio => (
                                                <option key={anuncio.ID_Anuncio} value={anuncio.ID_Anuncio}>
                                                    {anuncio.Titulo} - {formatarPreco(anuncio.Preco)}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <div className="d-grid gap-2">
                                        <Button variant="primary" type="submit">
                                            Propor Troca
                                        </Button>
                                        <Button 
                                            variant="outline-secondary"
                                            onClick={() => navigate(-1)}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProporTroca; 