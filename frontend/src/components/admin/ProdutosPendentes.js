import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert, Card, Badge, Spinner, Row, Col, Image } from 'react-bootstrap';
import { adminService } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const ProdutosPendentes = () => {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProdutoId, setSelectedProdutoId] = useState(null);
    const [comentario, setComentario] = useState('');
    const [selectedProduto, setSelectedProduto] = useState(null);

    useEffect(() => {
        loadProdutosPendentes();
    }, []);

    const loadProdutosPendentes = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAnunciosPendentes();
            console.log('Anúncios pendentes:', response);
            setProdutos(response);
            setError('');
        } catch (err) {
            console.error('Erro ao carregar produtos pendentes:', err);
            setError('Erro ao carregar produtos pendentes. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleAprovar = async (produtoId) => {
        try {
            await adminService.aprovarAnuncio(produtoId);
            setMessage('Anúncio aprovado com sucesso!');
            // Remover o produto da lista
            setProdutos(produtos.filter(p => p.ID_Anuncio !== produtoId));
        } catch (err) {
            console.error('Erro ao aprovar anúncio:', err);
            setError('Erro ao aprovar anúncio. Por favor, tente novamente.');
        }
    };

    const handleRejeitar = (produto) => {
        setSelectedProdutoId(produto.ID_Anuncio);
        setSelectedProduto(produto);
        setComentario('');
        setShowModal(true);
    };

    const confirmRejeitar = async () => {
        if (!comentario.trim()) {
            return;
        }

        try {
            await adminService.rejeitarAnuncio(selectedProdutoId, comentario);
            setMessage('Anúncio rejeitado com sucesso!');
            // Remover o produto da lista
            setProdutos(produtos.filter(p => p.ID_Anuncio !== selectedProdutoId));
            setShowModal(false);
        } catch (err) {
            console.error('Erro ao rejeitar anúncio:', err);
            setError('Erro ao rejeitar anúncio. Por favor, tente novamente.');
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };

    return (
        <>
            <Header />
            <Container className="my-5">
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white">
                        <h2 className="mb-0">Anúncios Pendentes</h2>
                    </Card.Header>
                    <Card.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">Carregando anúncios pendentes...</p>
                            </div>
                        ) : produtos.length === 0 ? (
                            <Alert variant="info">Não há anúncios pendentes de aprovação.</Alert>
                        ) : (
                            <Row xs={1} md={2} className="g-4">
                                {produtos.map(produto => (
                                    <Col key={produto.ID_Anuncio}>
                                        <Card className="h-100 shadow-sm">
                                            <div className="position-relative">
                                                {produto.item_imagems && produto.item_imagems.length > 0 && produto.item_imagems[0].imagem ? (
                                                    <Card.Img 
                                                        variant="top" 
                                                        src={`http://localhost:8000/storage/${produto.item_imagems[0].imagem.Caminho}`} 
                                                        style={{ height: '200px', objectFit: 'cover' }} 
                                                    />
                                                ) : (
                                                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '200px' }}>
                                                        <i className="fas fa-image fa-3x text-muted"></i>
                                                    </div>
                                                )}
                                                <Badge 
                                                    bg="warning" 
                                                    text="dark" 
                                                    className="position-absolute top-0 end-0 m-2"
                                                >
                                                    Pendente
                                                </Badge>
                                            </div>
                                            <Card.Body>
                                                <Card.Title>{produto.Titulo}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
                                                    {formatCurrency(produto.Preco)}
                                                </Card.Subtitle>
                                                <Card.Text>
                                                    {produto.Descricao}
                                                </Card.Text>
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <Badge bg="info" pill>
                                                        {produto.categorium?.Nome || 'Sem categoria'}
                                                    </Badge>
                                                    <small className="text-muted">
                                                        Tipo: {produto.tipo_item?.Nome || 'Não especificado'}
                                                    </small>
                                                </div>
                                                <div className="border-top pt-2 mt-2">
                                                    <p className="mb-1"><strong>Utilizador:</strong> {produto.utilizador?.Nome || 'Desconhecido'}</p>
                                                    <p className="mb-1"><small className="text-muted">Email: {produto.utilizador?.Email || 'N/A'}</small></p>
                                                    <p className="mb-0"><small className="text-muted">Data: {produto.aprovacao?.Data_Aprovacao || 'Pendente'}</small></p>
                                                </div>
                                            </Card.Body>
                                            <Card.Footer className="bg-white">
                                                <div className="d-flex justify-content-between">
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleAprovar(produto.ID_Anuncio)}
                                                    >
                                                        <i className="fas fa-check me-1"></i> Aprovar
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => handleRejeitar(produto)}
                                                    >
                                                        <i className="fas fa-times me-1"></i> Rejeitar
                                                    </Button>
                                                </div>
                                            </Card.Footer>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            {/* Modal de Rejeição */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton className="bg-danger text-white">
                    <Modal.Title>Rejeitar Anúncio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProduto && (
                        <Row className="mb-4">
                            <Col md={4}>
                                {selectedProduto.item_imagems && selectedProduto.item_imagems.length > 0 && selectedProduto.item_imagems[0].imagem ? (
                                    <Image 
                                        src={`http://localhost:8000/storage/${selectedProduto.item_imagems[0].imagem.Caminho}`} 
                                        alt={selectedProduto.Titulo}
                                        fluid
                                        rounded
                                        className="mb-2"
                                    />
                                ) : (
                                    <div className="bg-light d-flex align-items-center justify-content-center rounded" style={{ height: '150px' }}>
                                        <i className="fas fa-image fa-3x text-muted"></i>
                                    </div>
                                )}
                            </Col>
                            <Col md={8}>
                                <h5>{selectedProduto.Titulo}</h5>
                                <p className="text-muted">{selectedProduto.Descricao}</p>
                                <div className="d-flex justify-content-between">
                                    <Badge bg="info">{selectedProduto.categorium?.Nome || 'Sem categoria'}</Badge>
                                    <span className="fw-bold">{formatCurrency(selectedProduto.Preco)}</span>
                                </div>
                                <small className="text-muted d-block mt-2">Anunciante: {selectedProduto.utilizador?.Nome}</small>
                            </Col>
                        </Row>
                    )}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Motivo da rejeição</Form.Label>
                            <Form.Control 
                                as="textarea" 
                                rows={3} 
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                placeholder="Informe o motivo da rejeição do anúncio"
                                required
                            />
                            <Form.Text className="text-muted">
                                Este comentário será enviado ao utilizador para que ele possa corrigir o anúncio.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={confirmRejeitar}
                        disabled={!comentario.trim()}
                    >
                        Confirmar Rejeição
                    </Button>
                </Modal.Footer>
            </Modal>
            <Footer />
        </>
    );
};

export default ProdutosPendentes;
