import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Spinner, Alert, Container } from 'react-bootstrap';
import { anuncioService } from '../../services/api';
import { Link, useLocation } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const MeusAnuncios = () => {
    // Verificar se o componente está sendo usado como página independente ou dentro do perfil
    const location = useLocation();
    const isStandalone = location.pathname === '/meus-anuncios';
    const [anuncios, setAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        carregarMeusAnuncios();
    }, []);

    const carregarMeusAnuncios = async () => {
        try {
            setLoading(true);
            // Tentar obter os anúncios do usuário
            try {
                const response = await anuncioService.getMeusAnuncios();
                console.log('Meus anúncios:', response);
                
                // Verificar se a resposta é um array válido
                if (Array.isArray(response)) {
                    // Filtrar anúncios com dados válidos para evitar erros de renderização
                    const anunciosValidos = response.filter(anuncio => {
                        return anuncio && anuncio.ID_Anuncio && 
                               // Garantir que o título existe
                               typeof anuncio.Titulo === 'string';
                    });
                    
                    setAnuncios(anunciosValidos);
                    setError('');
                } else {
                    console.error('Resposta inválida do servidor:', response);
                    setAnuncios([]);
                    setError('Formato de dados inválido. Por favor, tente novamente.');
                }
            } catch (apiError) {
                console.error('Erro na API:', apiError);
                // Se houver erro na API, tentar usar dados de sessão ou localStorage
                const localAnuncios = localStorage.getItem('meusAnuncios');
                if (localAnuncios) {
                    try {
                        const parsedAnuncios = JSON.parse(localAnuncios);
                        setAnuncios(parsedAnuncios);
                        setError('Usando dados em cache. Alguns dados podem estar desatualizados.');
                    } catch (parseError) {
                        console.error('Erro ao analisar dados locais:', parseError);
                        setAnuncios([]);
                        setError('Não foi possível carregar seus anúncios. Por favor, tente novamente mais tarde.');
                    }
                } else {
                    setAnuncios([]);
                    setError('Não foi possível carregar seus anúncios. Por favor, tente novamente mais tarde.');
                }
            }
        } catch (err) {
            console.error('Erro ao carregar anúncios:', err);
            setAnuncios([]);
            setError('Erro ao carregar seus anúncios. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };
    
    // Salvar anúncios no localStorage quando eles forem carregados com sucesso
    useEffect(() => {
        if (anuncios.length > 0 && !error) {
            localStorage.setItem('meusAnuncios', JSON.stringify(anuncios));
        }
    }, [anuncios, error]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };

    const getStatusBadge = (statusId) => {
        switch (statusId) {
            case 2:
                return <Badge bg="success">Aprovado</Badge>;
            case 1:
                return <Badge bg="warning">Pendente</Badge>;
            case 3:
                return <Badge bg="danger">Rejeitado</Badge>;
            default:
                return <Badge bg="secondary">Desconhecido</Badge>;
        }
    };

    // Renderização condicional com base no loading e erro
    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Carregando seus anúncios...</p>
                </div>
            );
        }

        if (error) {
            return <Alert variant="danger">{error}</Alert>;
        }

        if (anuncios.length === 0) {
            return (
                <div className="text-center py-5">
                    <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                    <h5>Você ainda não tem anúncios</h5>
                    <p className="text-muted">Comece a vender ou trocar seus itens agora mesmo!</p>
                    <Link to="/anuncios/criar">
                        <Button variant="primary">
                            <i className="fas fa-plus me-2"></i> Criar Anúncio
                        </Button>
                    </Link>
                </div>
            );
        }

        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Total: {anuncios.length} anúncios</h5>
                    <Link to="/anuncios/criar">
                        <Button variant="primary" size="sm">
                            <i className="fas fa-plus me-1"></i> Novo Anúncio
                        </Button>
                    </Link>
                </div>

                <Row xs={1} md={2} lg={isStandalone ? 3 : 2} className="g-4">
                    {anuncios.map(anuncio => (
                        <Col key={anuncio.ID_Anuncio}>
                            <Card className="h-100 shadow-sm">
                                <div className="position-relative">
                                    {anuncio.item_imagems && anuncio.item_imagems.length > 0 && anuncio.item_imagems[0]?.imagem ? (
                                        <Card.Img 
                                            variant="top" 
                                            src={`http://localhost:8000/storage/${anuncio.item_imagems[0].imagem.Caminho}`}
                                            style={{ height: '180px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/300x180?text=Imagem+não+disponível';
                                            }}
                                        />
                                    ) : (
                                        <div 
                                            className="bg-light d-flex align-items-center justify-content-center" 
                                            style={{ height: '180px' }}
                                        >
                                            <i className="fas fa-image fa-3x text-muted"></i>
                                        </div>
                                    )}
                                    <div className="position-absolute top-0 end-0 m-2">
                                        {getStatusBadge(anuncio.Status_AnuncioID_Status_Anuncio || 1)}
                                    </div>
                                </div>
                                <Card.Body>
                                    <Card.Title>{anuncio.Titulo}</Card.Title>
                                    <Card.Text className="text-muted small">
                                        {anuncio.Descricao ? (
                                            <>
                                                {anuncio.Descricao.substring(0, 100)}
                                                {anuncio.Descricao.length > 100 ? '...' : ''}
                                            </>
                                        ) : (
                                            <span className="fst-italic">Sem descrição</span>
                                        )}
                                    </Card.Text>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <Badge bg="info">{anuncio.categorium?.Nome || 'Sem categoria'}</Badge>
                                        <span className="fw-bold">{anuncio.Preco ? formatCurrency(anuncio.Preco) : 'Preço não definido'}</span>
                                    </div>
                                </Card.Body>
                                <Card.Footer className="bg-white">
                                    <div className="d-flex justify-content-between">
                                        <small className="text-muted">
                                            <i className="far fa-calendar-alt me-1"></i> 
                                            {anuncio.aprovacao && anuncio.aprovacao.Data_Aprovacao ? 
                                                new Date(anuncio.aprovacao.Data_Aprovacao).toLocaleDateString() : 
                                                anuncio.Status_AnuncioID_Status_Anuncio === 2 ? 'Aprovado' : 'Pendente'}
                                        </small>
                                        <div>
                                            <Link to={`/anuncios/${anuncio.ID_Anuncio}`}>
                                                <Button variant="outline-primary" size="sm" className="me-1">
                                                    <i className="fas fa-eye"></i>
                                                </Button>
                                            </Link>
                                            <Link to={`/anuncios/${anuncio.ID_Anuncio}/editar`}>
                                                <Button variant="outline-secondary" size="sm">
                                                    <i className="fas fa-edit"></i>
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </>
        );
    };
    
    // Se for uma página independente, adicionar o layout completo
    if (isStandalone) {
        return (
            <>
                <Header />
                <Container className="my-5">
                    <h2 className="mb-4">Meus Anúncios</h2>
                    {renderContent()}
                </Container>
                <Footer />
            </>
        );
    }
    
    // Se for usado dentro do perfil, retornar apenas o conteúdo
    return renderContent();
};

export default MeusAnuncios;
