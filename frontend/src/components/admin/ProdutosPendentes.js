import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Alert, Card, Badge, Spinner, Row, Col, Image, Carousel, ListGroup } from 'react-bootstrap';
import api, { adminService } from '../../services/api';
import Header from '../layout/Header';

// Helper function to get the base URL for storage
const getStorageBaseUrl = () => {
    const apiUrl = api.defaults.baseURL || '';
    // Remove '/api' from the end if it exists
    return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
};

const ProdutosPendentes = () => {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    // --- State for Modals ---
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedAnuncio, setSelectedAnuncio] = useState(null);
    const [rejectionReason, setRejectionReason] = useState(''); // Motivo da rejeição
    const [isSubmitting, setIsSubmitting] = useState(false); // Para disable botões durante API call
    // --- --- --- --- --- --- ---

    useEffect(() => {
        loadProdutosPendentes();
    }, []);

    const loadProdutosPendentes = async () => {
        setMessage('');
        setError('');
        try {
            setLoading(true);
            const response = await adminService.getAnunciosPendentes();
            setProdutos(Array.isArray(response?.data) ? response.data : []);
        } catch (err) {
            console.error('Erro ao carregar anúncios pendentes:', err); // Changed text
            setError(err.message || 'Erro ao carregar anúncios pendentes. Por favor, tente novamente.');
            setProdutos([]);
        } finally {
            setLoading(false);
        }
    };

    // --- Modal Handling ---
    const openDetailsModal = (produto) => {
        setSelectedAnuncio(produto);
        setRejectionReason(''); // Reset reason when opening
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedAnuncio(null);
        setRejectionReason('');
    };
    // --- --- --- --- --- --- ---

    // --- Actions from Modal ---
    const handleApprove = async () => {
        if (!selectedAnuncio) return;
        
        setMessage('');
        setError('');
        setIsSubmitting(true);
        try {
            console.log('Aprovar anúncio ID:', selectedAnuncio.ID_Anuncio);
            await adminService.aprovarAnuncio(selectedAnuncio.ID_Anuncio);
            setMessage('Anúncio aprovado com sucesso!');
            setProdutos(produtos.filter(p => p.ID_Anuncio !== selectedAnuncio.ID_Anuncio));
            closeDetailsModal();
        } catch (err) {
            console.error('Erro ao aprovar anúncio:', err);
            setError(err.response?.data?.message || 'Erro ao aprovar anúncio. Por favor, tente novamente.');
            // Keep modal open on error?
        } finally {
             setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!selectedAnuncio || !rejectionReason.trim()) {
             setError('Por favor, introduza um motivo para a rejeição.'); // Give specific feedback
             setTimeout(() => setError(''), 3000); // Clear feedback after a while
            return;
        }
        setMessage('');
        setError('');
        setIsSubmitting(true);
        try {
             console.log('DEBUG REJEITAR: ID:', selectedAnuncio.ID_Anuncio, 'Motivo:', rejectionReason);
            const res = await adminService.rejeitarAnuncio(selectedAnuncio.ID_Anuncio, rejectionReason);
            setMessage('Anúncio rejeitado com sucesso!');
            setProdutos(produtos.filter(p => p.ID_Anuncio !== selectedAnuncio.ID_Anuncio));
            closeDetailsModal();
        } catch (err) {
            console.error('Erro ao rejeitar anúncio:', err);
            if (err.response) {
                console.error('Resposta completa da API:', err.response);
                setError(`Erro API: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
            } else {
                setError(err.message || 'Erro ao rejeitar anúncio. Por favor, tente novamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    // --- --- --- --- --- --- ---

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-PT', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    };

    const renderImages = (images, style = { height: '300px', backgroundColor: '#f8f9fa' }, className = 'card-img-top') => {
        const storageBaseUrl = getStorageBaseUrl();

        if (!images || images.length === 0) {
            return (
                <div className={`text-center p-4 bg-light d-flex align-items-center justify-content-center ${className}`} style={style}>
                    <i className="fas fa-image text-muted fa-3x"></i>
                </div>
            );
        }

        if (images.length === 1) {
            return (
                <div style={style}>
                    <img
                        src={`${storageBaseUrl}/storage/${images[0].imagem.Caminho}`}
                        alt="Imagem do produto"
                        className={className}
                        style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x180?text=Erro' }}
                    />
                </div>
            );
        }

        return (
            <Carousel style={style} className={className} interval={null}>
                {images.map((img, index) => (
                    <Carousel.Item key={img.ID_Imagem || index}>
                        <img
                            src={`${storageBaseUrl}/storage/${img.imagem.Caminho}`}
                            alt={`Imagem ${index + 1}`}
                            style={{ height: '100%', width: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x180?text=Erro' }}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        );
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
                        {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">A carregar anúncios pendentes...</p>
                            </div>
                        ) : produtos.length === 0 ? (
                            <Alert variant="info">Não há anúncios pendentes de aprovação.</Alert>
                        ) : (
                            <Row xs={1} md={2} lg={3} className="g-4">
                                {produtos.map(produto => (
                                    <Col key={produto.ID_Anuncio}>
                                        <Card className="h-100 shadow-sm">
                                            {/* Wrapper for image/carousel with fixed height */}
                                            <div className="card-img-wrapper" style={{ height: '250px', overflow: 'hidden', backgroundColor: '#f8f9fa' }}> 
                                                {/* Pass style height 100% to fill wrapper, remove card-img-top class */}
                                                {renderImages(produto.item_imagems, { height: '100%' }, '')} 
                                            </div>
                                            <Card.Body className="d-flex flex-column">
                                                <Card.Title className="h5 mb-2">{produto.Titulo}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-primary fw-bold">
                                                    {formatCurrency(produto.Preco)}
                                                </Card.Subtitle>
                                                <div className="d-flex justify-content-between align-items-center mb-2 small">
                                                    <Badge bg="info" pill>{produto.categorium?.Descricao_Categoria || 'Sem categoria'}</Badge>
                                                    <Badge bg="secondary" pill>{produto.tipo_item?.Descricao_TipoItem || 'Não especificado'}</Badge>
                                                </div>
                                                <div className="mt-auto border-top pt-2 small text-muted">
                                                     <span>Utilizador: {produto.utilizador?.Name || 'N/A'}</span>
                                                     <span className="float-end">
                                                        Submetido: {produto.aprovacao?.Data_Submissao ? new Date(produto.aprovacao.Data_Submissao).toLocaleDateString() : 'N/A'}
                                                     </span>
                                                </div>
                                            </Card.Body>
                                            <Card.Footer className="bg-light text-center d-flex flex-column flex-md-row justify-content-center gap-2">
    <Button 
        className="zoom-btn"
        variant="success" 
        size="sm" 
        onClick={async () => {
            setSelectedAnuncio(produto);
            setIsSubmitting(true);
            setMessage('');
            setError('');
            try {
                await adminService.aprovarAnuncio(produto.ID_Anuncio);
                setMessage('Anúncio aprovado com sucesso!');
                setProdutos(produtos => produtos.filter(p => p.ID_Anuncio !== produto.ID_Anuncio));
            } catch (err) {
                setError(err.response?.data?.message || 'Erro ao aprovar anúncio. Por favor, tente novamente.');
            } finally {
                setIsSubmitting(false);
            }
        }}
        disabled={isSubmitting}
    >
        <i className="fas fa-check me-1"></i> Aceitar
    </Button>
    <Button 
        className="zoom-btn"
        variant="danger" 
        size="sm" 
        onClick={() => {
            setSelectedAnuncio(produto);
            setShowDetailsModal(true);
        }}
        disabled={isSubmitting}
    >
        <i className="fas fa-times me-1"></i> Recusar
    </Button>
    <Button 
        className="zoom-btn"
        variant="outline-primary" 
        size="sm" 
        onClick={() => openDetailsModal(produto)}
    >
        <i className="fas fa-eye me-1"></i> Ver Detalhes
    </Button>
</Card.Footer>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showDetailsModal} onHide={closeDetailsModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalhes do Anúncio Pendente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAnuncio && (
                        <Row>
                            <Col md={6}>
                                {renderImages(selectedAnuncio.item_imagems, { height: '400px' }, '')}
                            </Col>
                            <Col md={6}>
                                <h5>{selectedAnuncio.Titulo}</h5>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><strong>Preço:</strong> {formatCurrency(selectedAnuncio.Preco)}</ListGroup.Item>
                                    <ListGroup.Item><strong>Categoria:</strong> {selectedAnuncio.categorium?.Descricao_Categoria || 'N/A'}</ListGroup.Item>
                                    <ListGroup.Item><strong>Tipo:</strong> {selectedAnuncio.tipo_item?.Descricao_TipoItem || 'N/A'}</ListGroup.Item>
                                    <ListGroup.Item><strong>Descrição:</strong><br/><p style={{ maxHeight: '150px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>{selectedAnuncio.Descricao || 'N/A'}</p></ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Utilizador:</strong> {selectedAnuncio.utilizador?.Name || 'N/A'} ({selectedAnuncio.utilizador?.Email || 'N/A'})
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Submetido em:</strong> {selectedAnuncio.aprovacao?.Data_Submissao ? new Date(selectedAnuncio.aprovacao.Data_Submissao).toLocaleString() : 'N/A'}
                                    </ListGroup.Item>
                                </ListGroup>
                                
                                <Form.Group className="mt-3">
                                    <Form.Label>Motivo da Rejeição (se aplicável)</Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={2} 
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        placeholder="Se rejeitar, indique aqui o motivo..."
                                    />
                                </Form.Group>
                                
                                {error.includes('motivo') && <Alert variant="warning" className="mt-2 py-1 px-2 small">{error}</Alert>}
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDetailsModal} disabled={isSubmitting}>
                        Fechar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleReject} 
                        disabled={isSubmitting || !rejectionReason.trim()}
                    >
                        {isSubmitting ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/> : 'Rejeitar'}
                    </Button>

                </Modal.Footer>
            </Modal>

            <div style={{height: '18mm'}}></div>
        </>
    );
};

export default ProdutosPendentes;
