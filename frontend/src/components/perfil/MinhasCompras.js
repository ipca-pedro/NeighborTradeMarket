import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Button, Modal, Form, InputGroup, Row, Col, Pagination, Badge } from 'react-bootstrap';
import { FaSearch, FaSort, FaStar, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { criarReclamacao } from '../../services/reclamacaoService';
import './MinhasCompras.css';

const MinhasCompras = () => {
    const navigate = useNavigate();
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showReclamacaoModal, setShowReclamacaoModal] = useState(false);
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [reclamacao, setReclamacao] = useState('');
    const [submittingReclamacao, setSubmittingReclamacao] = useState(false);
    const [reclamacaoError, setReclamacaoError] = useState('');
    
    // Estados para filtros e paginação
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('Data_compra');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

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

    // Funções de filtro e ordenação
    const filteredCompras = compras.filter(compra => 
        compra.anuncio.Titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        compra.anuncio.Descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedCompras = [...filteredCompras].sort((a, b) => {
        if (sortBy === 'Data_compra') {
            return sortOrder === 'asc' 
                ? new Date(a.Data_compra) - new Date(b.Data_compra)
                : new Date(b.Data_compra) - new Date(a.Data_compra);
        }
        if (sortBy === 'Preco') {
            return sortOrder === 'asc'
                ? a.anuncio.Preco - b.anuncio.Preco
                : b.anuncio.Preco - a.anuncio.Preco;
        }
        return 0;
    });

    // Paginação
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedCompras.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedCompras.length / itemsPerPage);

    const handleReclamacao = (compra) => {
        setSelectedCompra(compra);
        setShowReclamacaoModal(true);
        setReclamacaoError('');
    };

    const handleSubmitReclamacao = async () => {
        if (!reclamacao.trim()) {
            setReclamacaoError('Por favor, descreva sua reclamação.');
            return;
        }

        try {
            setSubmittingReclamacao(true);
            setReclamacaoError('');
            
            const response = await criarReclamacao({
                descricao: reclamacao,
                compraId: selectedCompra.ID_Compra
            });

            await carregarCompras();
            setReclamacao('');
            setShowReclamacaoModal(false);
            setSelectedCompra(null);
            
            // Redireciona para a página de reclamações
            navigate('/perfil/reclamacoes', { 
                state: { 
                    newReclamacao: response,
                    message: 'Reclamação enviada com sucesso!' 
                }
            });
        } catch (err) {
            console.error(err);
            setReclamacaoError('Erro ao enviar reclamação. Por favor, tente novamente.');
        } finally {
            setSubmittingReclamacao(false);
        }
    };

    const verReclamacao = (reclamacaoId) => {
        navigate('/perfil/reclamacoes', { state: { selectedReclamacaoId: reclamacaoId } });
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

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pendente':
                return 'warning';
            case 'em análise':
                return 'info';
            case 'resolvida':
                return 'success';
            case 'rejeitada':
                return 'danger';
            default:
                return 'secondary';
        }
    };

    return (
        <>
            <div className="minhas-compras-container">
                <h5 className="mb-4">Minhas Compras</h5>

                {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

                {/* Barra de pesquisa e filtros */}
                <Row className="mb-4">
                    <Col md={6}>
                        <InputGroup>
                            <InputGroup.Text>
                                <FaSearch />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Pesquisar compras..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </Col>
                    <Col md={6}>
                        <div className="d-flex justify-content-end">
                            <Button
                                variant="outline-secondary"
                                className="me-2"
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            >
                                <FaSort className="me-1" />
                                {sortOrder === 'asc' ? 'Mais Recentes' : 'Mais Antigas'}
                            </Button>
                        </div>
                    </Col>
                </Row>

                {currentItems.length === 0 ? (
                    <Alert variant="info">
                        {searchTerm ? 'Nenhuma compra encontrada com o termo pesquisado.' : 'Você ainda não realizou nenhuma compra.'}
                    </Alert>
                ) : (
                    <div className="compras-lista">
                        {currentItems.map(compra => (
                            <Card key={compra.ID_Compra} className="mb-3 shadow-sm compra-card">
                                <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                                    <span className="fw-bold">Compra #{compra.ID_Compra}</span>
                                    {compra.reclamacao && (
                                        <Badge 
                                            bg={getStatusColor(compra.reclamacao.status)}
                                            className="reclamacao-badge"
                                            onClick={() => verReclamacao(compra.reclamacao.ID_Reclamacao)}
                                        >
                                            <FaExclamationCircle className="me-1" />
                                            Reclamação {compra.reclamacao.status}
                                        </Badge>
                                    )}
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={8}>
                                            <h6 className="mb-3">{compra.anuncio.Titulo}</h6>
                                            <p className="text-muted mb-2">{compra.anuncio.Descricao}</p>
                                            <div className="d-flex align-items-center mb-2">
                                                <FaStar className="text-warning me-1" />
                                                <span className="me-2">{compra.anuncio.avaliacao || 'Sem avaliação'}</span>
                                                <span className="text-muted">({compra.anuncio.totalAvaliacoes || 0} avaliações)</span>
                                            </div>
                                            <p className="mb-2">
                                                <strong>Preço:</strong> {formatCurrency(compra.anuncio.Preco)}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Data da compra:</strong>{' '}
                                                {format(new Date(compra.Data_compra), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                            </p>
                                        </Col>
                                        <Col md={4}>
                                            <div className="border-start ps-3">
                                                <h6 className="mb-2">Informações do Vendedor</h6>
                                                <p className="mb-1">
                                                    <strong>Nome:</strong> {compra.anuncio.utilizador.Nome}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Email:</strong> {compra.anuncio.utilizador.Email}
                                                </p>
                                                <div className="mt-3">
                                                    {!compra.reclamacao ? (
                                                        <Button 
                                                            variant="danger" 
                                                            size="sm"
                                                            onClick={() => handleReclamacao(compra)}
                                                        >
                                                            Fazer Reclamação
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => verReclamacao(compra.reclamacao.ID_Reclamacao)}
                                                        >
                                                            Ver Reclamação
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <Pagination>
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => setCurrentPage(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                        </Pagination>
                    </div>
                )}
            </div>

            {/* Modal de Reclamação */}
            <Modal show={showReclamacaoModal} onHide={() => setShowReclamacaoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Fazer Reclamação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {reclamacaoError && (
                        <Alert variant="danger" className="mb-3">
                            {reclamacaoError}
                        </Alert>
                    )}
                    <Form.Group>
                        <Form.Label>Descreva o problema:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={reclamacao}
                            onChange={(e) => setReclamacao(e.target.value)}
                            placeholder="Descreva detalhadamente o problema que você está enfrentando..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReclamacaoModal(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSubmitReclamacao}
                        disabled={submittingReclamacao}
                    >
                        {submittingReclamacao ? 'Enviando...' : 'Enviar Reclamação'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default MinhasCompras; 