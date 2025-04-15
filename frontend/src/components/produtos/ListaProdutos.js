import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { Link, useParams, useLocation } from 'react-router-dom';
import NoProductsFound from './NoProductsFound';
import api from '../../services/api';
import { anuncioService } from '../../services/api'; // Importar o serviço de anúncios

const ListaProdutos = () => {
    // Suporta ambos os formatos: parâmetros de rota e query parameters
    const { categoriaId: routeCategoriaId } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const queryCategoriaId = queryParams.get('categoria');
    
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
                    console.log("Buscando informações da categoria:", categoriaId);
                    const categorias = await anuncioService.getCategorias();
                    console.log("Categorias disponíveis:", categorias);
                    
                    const categoria = categorias.find(cat => 
                        cat.ID_Categoria === parseInt(categoriaId)
                    );
                    
                    if (categoria) {
                        console.log("Categoria encontrada:", categoria);
                        setCategoriaInfo(categoria);
                    } else {
                        console.warn("Categoria não encontrada com ID:", categoriaId);
                    }
                } catch (err) {
                    console.error("Erro ao buscar informações da categoria:", err);
                    // Não define erro para não bloquear a carga dos produtos
                }
            }
        };
        
        fetchCategoriaInfo();
    }, [categoriaId]);

    useEffect(() => {
        console.log("Carregando produtos com filtro de categoria:", categoriaId);
        carregarProdutos();
    }, [categoriaId]); // Recarregar quando a categoria mudar

    const carregarProdutos = async () => {
        try {
            let produtosFiltrados = [];
            
            if (categoriaId) {
                // Usar método específico para buscar por categoria
                console.log("Buscando produtos da categoria:", categoriaId);
                produtosFiltrados = await anuncioService.getAnunciosPorCategoria(categoriaId);
            } else {
                // Usar o método genérico para todos os anúncios
                console.log("Buscando todos os produtos");
                produtosFiltrados = await anuncioService.getAnuncios();
            }
            
            console.log("Total de produtos recebidos:", produtosFiltrados?.length || 0);
            console.log("Exemplo de produto:", produtosFiltrados?.length > 0 ? produtosFiltrados[0] : "Nenhum produto");
            
            setProdutos(produtosFiltrados || []);
        } catch (err) {
            console.error("Erro ao carregar produtos:", err);
            setError('Erro ao carregar produtos da categoria: ' + (err.message || 'Erro desconhecido. Verifique o console para mais informações.'));
        } finally {
            setLoading(false);
        }
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
                        {categoriaId ? (
                            categoriaInfo ? 
                                `Produtos de ${categoriaInfo.Descricao_Categoria}` : 
                                `Produtos na Categoria ${categoriaId}`
                        ) : 'Todos os Produtos'}
                    </h2>
                    <Row>
                        {produtos.map(produto => (
                            <Col key={produto.ID_Item || produto.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                                <Card>
                                    {produto.imagens && produto.imagens.length > 0 ? (
                                        <Card.Img 
                                            variant="top" 
                                            src={produto.imagens[0]?.URL || produto.item_imagems?.[0]?.imagem?.Caminho ? `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${produto.item_imagems[0].imagem.Caminho}` : '/images/no-image.jpg'}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/images/no-image.jpg'; }}
                                        />
                                    ) : (
                                        <div className="bg-light text-center py-5">
                                            <i className="fas fa-image fa-3x text-secondary"></i>
                                        </div>
                                    )}
                                    <Card.Body>
                                        <Card.Title>{produto.Titulo || produto.Nome}</Card.Title>
                                        <Card.Text>
                                            {produto.Preco ? produto.Preco.toFixed(2) : "N/A"}€
                                        </Card.Text>
                                        <div className="mb-2">
                                            <Badge bg="secondary" className="me-2">
                                                {produto.categorium?.Descricao_Categoria || produto.Categoria || "Categoria N/A"}
                                            </Badge>
                                            <Badge bg="info">
                                                {produto.Condicao || produto.Estado || "Estado N/A"}
                                            </Badge>
                                        </div>
                                        <Link 
                                            to={`/anuncios/${produto.ID_Item || produto.id}`}
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
            )}

        </>
    );
};

export default ListaProdutos;
