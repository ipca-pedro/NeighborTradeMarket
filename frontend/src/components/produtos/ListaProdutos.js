import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link, useParams, useLocation } from 'react-router-dom';
import NoProductsFound from './NoProductsFound';
import { getAnuncios, getAnunciosPorCategoria, getCategorias } from '../../services/anuncioService';
import { getImageUrl } from '../../services/api';
import './ProductCard.css';

const ListaProdutos = () => {
    // Suporta ambos os formatos: parâmetros de rota e query parameters
    const { categoriaId: routeCategoriaId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const queryCategoriaId = queryParams.get('categoria');
    const searchTerm = queryParams.get('q') || '';
    const tipoId = queryParams.get('tipo') || '';
    // Prioriza o parâmetro da query, mas aceita o da rota se não houver
    const categoriaId = queryCategoriaId || routeCategoriaId;
    
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [categoriaInfo, setCategoriaInfo] = useState(null);

    // Carregar informações da categoria se um ID for fornecido
    useEffect(() => {
        const fetchCategoriaInfo = async () => {
            if (categoriaId) {
                try {
                    // Buscar as informações da categoria
                    const categorias = await getCategorias();
                    const categoria = categorias.find(cat => 
                        cat.ID_Categoria === parseInt(categoriaId)
                    );
                    if (categoria) setCategoriaInfo(categoria);
                } catch (err) {
                    // Não define erro para não bloquear a carga dos produtos
                }
            }
        };
        fetchCategoriaInfo();
    }, [categoriaId]);

    useEffect(() => {
        carregarProdutos();
        // eslint-disable-next-line
    }, [categoriaId, searchTerm, tipoId]);

    const carregarProdutos = async () => {
        try {
            setLoading(true);
            let produtosFiltrados = [];
            if (categoriaId) {
                produtosFiltrados = await getAnunciosPorCategoria(categoriaId);
            } else if (searchTerm || tipoId) {
                produtosFiltrados = await getAnuncios({ 
                    search: searchTerm,
                    tipo: tipoId
                });
            } else {
                produtosFiltrados = await getAnuncios();
            }
            // Filtrar apenas produtos com status 1 (Ativo) ou 8 (Reservado)
            produtosFiltrados = produtosFiltrados.filter(produto => 
                produto.Status_AnuncioID_Status_Anuncio === 1 || 
                produto.Status_AnuncioID_Status_Anuncio === 8
            );
            setProdutos(produtosFiltrados || []);
        } catch (err) {
            setError('Erro ao carregar produtos: ' + (err.message || 'Erro desconhecido.'));
        } finally {
            setLoading(false);
        }
    };

    // Função para renderizar um card de produto
    const renderProdutoCard = (produto) => {
        // Obter imagem principal
        let imgUrl = '/images/no-image.jpg';
        if (produto.imagens && produto.imagens.length > 0) {
            imgUrl = produto.imagens[0]?.URL || imgUrl;
        } else if (produto.item_imagems && produto.item_imagems.length > 0 && produto.item_imagems[0]?.imagem) {
            // Usar a função getImageUrl para padronizar o acesso às imagens
            imgUrl = getImageUrl({ imagem: produto.item_imagems[0].imagem });
        }

        // Verificar se o produto está reservado (status 8)
        const isReservado = produto.Status_AnuncioID_Status_Anuncio === 8;

        return (
            <Col key={produto.ID_Item || produto.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card className="h-100 shadow-sm product-card">
                    <div className="product-image-container">
                                <Card.Img 
                                    variant="top" 
                            src={imgUrl} 
                            alt={produto.Titulo}
                            style={{ maxHeight: '180px', objectFit: 'contain', width: 'auto' }}
                            onError={(e) => { e.target.onerror = null; e.target.src = '/images/no-image.jpg'; }}
                        />
                        {isReservado && (
                            <div className="position-absolute top-0 end-0 m-2">
                                <Badge bg="warning" text="dark">Reservado</Badge>
                            </div>
                        )}
                    </div>
                    <Card.Body className="d-flex flex-column">
                        <Card.Title className="product-title" style={{fontSize: '1.1rem', fontWeight: 600}}>{produto.Titulo || produto.Nome}</Card.Title>
                                <div className="mb-2">
                                    <Badge bg="secondary" className="me-2">
                                {produto.categorium?.Descricao_Categoria || produto.Categoria || "Categoria N/A"}
                                    </Badge>
                            <Badge bg={isReservado ? "warning" : "info"} text={isReservado ? "dark" : "light"}>
                                {isReservado ? "Reservado" : "Disponível"}
                                    </Badge>
                                </div>
                        <div className="price-container mb-2" style={{fontWeight: 700, color: '#F97316', fontSize: '1.2rem'}}>
                            {produto.Preco ? parseFloat(produto.Preco).toFixed(2) : "N/A"}€
                        </div>
                        <Card.Text className="product-description text-muted mb-3" style={{fontSize: '0.95rem'}}>
                            {produto.Descricao ? produto.Descricao.substring(0, 80) + (produto.Descricao.length > 80 ? '...' : '') : ''}
                        </Card.Text>
                        <Button 
                            as={Link} 
                            to={`/anuncios/${produto.ID_Anuncio || produto.ID_Item || produto.id}`}
                            variant={isReservado ? "secondary" : "primary"}
                            className="mt-auto w-100"
                            style={isReservado ? {} : { backgroundColor: '#F97316', borderColor: '#F97316' }}
                            disabled={isReservado}
                        >
                            <i className="fas fa-search me-2"></i>
                            {isReservado ? 'Produto Reservado' : 'Ver Detalhes'}
                        </Button>
                            </Card.Body>
                        </Card>
                    </Col>
        );
    };

    return (
        <>
            <Header />
            {loading ? (
                <Container className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{fontSize: '1.3rem', color: '#444', fontWeight: 500}}>
                        A carregar produtos/anúncios...
                    </div>
                </Container>
            ) : error ? (
                <Container className="py-5">
                    <div className="alert alert-danger">
                        {error}
                    </div>
                    <NoProductsFound />
                </Container>
            ) : produtos.length === 0 ? (
                <NoProductsFound />
            ) : (
                <Container className="mt-4" style={{ minHeight: '50vh', marginBottom: 'calc(2rem + 7mm)' }}>
                    <h2 className="mb-4">
                        {searchTerm ? (
                            <>Resultados para <span className="text-primary">"{searchTerm}"</span></>
                        ) : categoriaId ? (
                            categoriaInfo ? 
                                `Produtos de ${categoriaInfo.Descricao_Categoria}` : 
                                `Produtos na Categoria ${categoriaId}`
                        ) : 'Todos os Produtos'}
                    </h2>
                    <Row>
                        {produtos.map(renderProdutoCard)}
            </Row>
        </Container>
            )}
        </>
    );
};

export default ListaProdutos;
