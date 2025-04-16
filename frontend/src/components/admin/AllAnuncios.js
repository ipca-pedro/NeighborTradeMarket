import React, { useState, useEffect, useMemo } from 'react';
import {
    Container, Table, Button, Modal, Form, Alert, Card, Badge, Spinner, 
    InputGroup, FormControl, Row, Col, Dropdown, OverlayTrigger, Tooltip, Image, Carousel, ListGroup
} from 'react-bootstrap';
import api, { adminService, anuncioService } from '../../services/api'; // Assuming anuncioService exists for categories/types
import Header from '../layout/Header';
import Footer from '../layout/Footer';

// Helper function to get the base URL for storage
const getStorageBaseUrl = () => {
    const apiUrl = api.defaults.baseURL || '';
    return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
};

// Helper to format currency
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
};

// --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- ---

const AllAnuncios = () => {
    // --- Badge Components (Moved Inside) ---
    const AnuncioStatusBadge = ({ statusId }) => {
        // IDs based on StatusAnuncio model constants
        switch (statusId) {
            case 1: return <Badge bg="success">Ativo</Badge>;
            case 4: return <Badge bg="warning">Pendente</Badge>;
            case 7: return <Badge bg="danger">Rejeitado</Badge>;
            case 2: return <Badge bg="secondary">Inativo</Badge>;
            case 3: return <Badge bg="info">Vendido</Badge>;
            default: return <Badge bg="light" text="dark">Desconhecido ({statusId})</Badge>;
        }
    };

    const CategoriaBadge = ({ categoria }) => (
        <Badge bg="info" pill>{categoria?.Descricao_Categoria || 'N/A'}</Badge>
    );

    const TipoItemBadge = ({ tipoItem }) => (
        <Badge bg="secondary" pill>{tipoItem?.Descricao_TipoItem || 'N/A'}</Badge>
    );
    // --- End Badge Components ---

    const [allAnuncios, setAllAnuncios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // --- Filter State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    // --- Options for Filters ---
    const [statusOptions, setStatusOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [typeOptions, setTypeOptions] = useState([]);

    // --- Modal State ---
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedAnuncio, setSelectedAnuncio] = useState(null);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false); // Loading state for status update
    const [message, setMessage] = useState(''); // Added for success message handling

    // --- Load Initial Data (Anuncios, Categories, Types) ---
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            // Fetch in parallel
            const [anunciosRes, categoriesRes, typesRes] = await Promise.all([
                adminService.getAllAnunciosAdmin(), // Fetch all initially
                anuncioService.getCategorias(), // Need function to get categories
                anuncioService.getTiposItem() // Need function to get item types
            ]);

            setAllAnuncios(anunciosRes || []);
            
            // Prepare options for dropdowns
            setCategoryOptions([{ ID_Categoria: '', Descricao_Categoria: 'Todas as Categorias' }, ...(categoriesRes || [])]);
            setTypeOptions([{ ID_Tipo: '', Descricao_TipoItem: 'Todos os Tipos' }, ...(typesRes || [])]);
            
            // Prepare status options (assuming fixed for now, adjust based on your StatusAnuncio table)
             setStatusOptions([
                 { id: '', name: 'Todos os Estados' },
                 { id: 1, name: 'Ativo' },
                 { id: 4, name: 'Pendente' },
                 { id: 7, name: 'Rejeitado' },
                 { id: 2, name: 'Inativo' }, // Adjust if needed
                 { id: 3, name: 'Vendido' }, // Adjust if needed
             ]);

        } catch (err) {
            console.error('Erro ao carregar dados de gestão de anúncios:', err);
            setError('Falha ao carregar dados. Tente recarregar a página.');
            setAllAnuncios([]);
        } finally {
            setLoading(false);
        }
    };

    // --- Filtering Logic --- 
    const filteredAnuncios = useMemo(() => {
        return allAnuncios.filter(anuncio => {
            const statusMatch = filterStatus === '' || anuncio.Status_AnuncioID_Status_Anuncio === parseInt(filterStatus);
            const categoryMatch = filterCategory === '' || anuncio.CategoriaID_Categoria === parseInt(filterCategory);
            const typeMatch = filterType === '' || anuncio.Tipo_ItemID_Tipo === parseInt(filterType);
            const searchMatch = searchTerm === '' || 
                                anuncio.Titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                anuncio.Descricao?.toLowerCase().includes(searchTerm.toLowerCase()) || // Search description too?
                                anuncio.utilizador?.Name?.toLowerCase().includes(searchTerm.toLowerCase());
            return statusMatch && categoryMatch && typeMatch && searchMatch;
        });
    }, [allAnuncios, searchTerm, filterStatus, filterCategory, filterType]);
    // --- --- --- --- --- --- --- --- --- --- ---

    // --- Modal Functions & Actions ---
    const openDetailsModal = (anuncio) => {
        setSelectedAnuncio(anuncio); // Set the full object
        setShowDetailsModal(true);
    };

    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedAnuncio(null);
    };
    
    const handleStatusChange = async (newStatusId) => {
        if (!selectedAnuncio || selectedAnuncio.Status_AnuncioID_Status_Anuncio === newStatusId) {
            return; // No change or no selection
        }

        setIsUpdatingStatus(true);
        setError(''); // Clear previous errors
        setMessage(''); // Clear previous messages

        try {
            const response = await adminService.updateAnuncioStatusAdmin(selectedAnuncio.ID_Anuncio, newStatusId);
            
            // Update the state for the selected anuncio in the modal
            setSelectedAnuncio(response.anuncio); 

            // Update the anuncio in the main list
            setAllAnuncios(prevAnuncios => 
                prevAnuncios.map(a => 
                    a.ID_Anuncio === selectedAnuncio.ID_Anuncio ? response.anuncio : a
                )
            );

            setMessage(response.message || 'Estado atualizado com sucesso!');
            // Keep modal open after status change

        } catch (err) {
            console.error('Erro ao atualizar estado do anúncio:', err);
            setError(err.message || 'Falha ao atualizar estado.');
        } finally {
            setIsUpdatingStatus(false);
        }
    };
    // --- --- --- --- --- --- --- --- --- --- ---

    return (
        <>
            <Header />
            <Container className="my-5">
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                        <h2 className="mb-0">Gestão de Anúncios</h2>
                    </Card.Header>
                    <Card.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        {/* --- Filter Controls --- */} 
                        <Row className="mb-3 gx-2">
                            <Col md={4}>
                                <InputGroup>
                                    <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
                                    <FormControl
                                        placeholder="Pesquisar título, descrição, utilizador..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={2}>
                                <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} title="Filtrar por Estado">
                                    {statusOptions.map(opt => <option key={`status-${opt.id}`} value={opt.id}>{opt.name}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} title="Filtrar por Categoria">
                                    {categoryOptions.map(opt => <option key={`cat-${opt.ID_Categoria}`} value={opt.ID_Categoria}>{opt.Descricao_Categoria}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={2}>
                                <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)} title="Filtrar por Tipo">
                                    {typeOptions.map(opt => <option key={`type-${opt.ID_Tipo}`} value={opt.ID_Tipo}>{opt.Descricao_TipoItem}</option>)}
                                </Form.Select>
                            </Col>
                            <Col md={2} className="d-flex align-items-end justify-content-end">
                                <Button variant="outline-secondary" onClick={() => { setSearchTerm(''); setFilterStatus(''); setFilterCategory(''); setFilterType(''); }} title="Limpar Filtros">
                                    <i className="fas fa-times"></i> Limpar
                                </Button>
                            </Col>
                        </Row>
                        {/* --- --- --- --- --- --- --- */} 

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">A carregar anúncios...</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-2 text-muted small">A mostrar {filteredAnuncios.length} de {allAnuncios.length} anúncios</div>
                                <Table responsive hover className="align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th style={{ width: '5%' }}></th> {/* Image Thumbnail */} 
                                            <th>Título</th>
                                            <th>Utilizador</th>
                                            <th>Preço</th>
                                            <th>Categoria / Tipo</th>
                                            <th>Estado</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAnuncios.length > 0 ? (
                                            filteredAnuncios.map(anuncio => {
                                                const firstImage = anuncio.item_imagems?.[0]?.imagem;
                                                return (
                                                    <tr key={anuncio.ID_Anuncio}>
                                                        <td>
                                                            {firstImage ? (
                                                                <Image 
                                                                    src={`${getStorageBaseUrl()}/storage/${firstImage.Caminho}`} 
                                                                    thumbnail 
                                                                    width="50" 
                                                                    onError={(e) => { e.target.style.display='none'; }}/>
                                                            ) : (
                                                                <div className="bg-light text-center d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px'}}>
                                                                     <i className="fas fa-image text-muted"></i>
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td>{anuncio.Titulo}</td>
                                                        <td>{anuncio.utilizador?.Name || 'N/A'}</td>
                                                        <td>{formatCurrency(anuncio.Preco)}</td>
                                                        <td>
                                                            <CategoriaBadge categoria={anuncio.categorium} /><br/>
                                                            <TipoItemBadge tipoItem={anuncio.tipo_item} />
                                                        </td>
                                                        <td>
                                                            <AnuncioStatusBadge statusId={anuncio.Status_AnuncioID_Status_Anuncio} />
                                                        </td>
                                                        <td>
                                                            <Button 
                                                                variant="outline-primary" 
                                                                size="sm" 
                                                                title="Ver Detalhes" 
                                                                onClick={() => openDetailsModal(anuncio)}
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center text-muted py-4">
                                                    Nenhum anúncio encontrado com os filtros atuais.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            {/* --- Details Modal --- */}
            <Modal show={showDetailsModal} onHide={closeDetailsModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Detalhes do Anúncio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedAnuncio && (
                        <Row>
                            <Col md={6} className="mb-3 mb-md-0">
                                {selectedAnuncio.item_imagems && selectedAnuncio.item_imagems.length > 0 ? (
                                    <Carousel interval={null}>
                                        {selectedAnuncio.item_imagems.map((img, index) => (
                                            <Carousel.Item key={img.ID_Imagem || index}>
                                                <img
                                                    className="d-block w-100" 
                                                    src={`${getStorageBaseUrl()}/storage/${img.imagem?.Caminho}`}
                                                    alt={`Imagem ${index + 1}`}
                                                    style={{ height: '400px', objectFit: 'contain' }}
                                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x400?text=Erro' }}
                                                />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                ) : (
                                    <div className="bg-light d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                                        <i className="fas fa-image fa-5x text-muted"></i>
                                    </div>
                                )}
                            </Col>
                            <Col md={6}>
                                <h5>{selectedAnuncio.Titulo}</h5>
                                <ListGroup variant="flush">
                                    <ListGroup.Item><strong>Preço:</strong> {formatCurrency(selectedAnuncio.Preco)}</ListGroup.Item>
                                    <ListGroup.Item><strong>Estado:</strong> <AnuncioStatusBadge statusId={selectedAnuncio.Status_AnuncioID_Status_Anuncio} /></ListGroup.Item>
                                    <ListGroup.Item><strong>Categoria:</strong> {selectedAnuncio.categorium?.Descricao_Categoria || 'N/A'}</ListGroup.Item>
                                    <ListGroup.Item><strong>Tipo:</strong> {selectedAnuncio.tipo_item?.Descricao_TipoItem || 'N/A'}</ListGroup.Item>
                                    <ListGroup.Item><strong>Descrição:</strong><br/><p style={{ maxHeight: '150px', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>{selectedAnuncio.Descricao || 'N/A'}</p></ListGroup.Item>
                                    <ListGroup.Item>
                                        <strong>Utilizador:</strong> {selectedAnuncio.utilizador?.Name || 'N/A'} (@{selectedAnuncio.utilizador?.User_Name || 'N/A'})
                                    </ListGroup.Item>
                                </ListGroup>
                                
                                {/* --- Status Change Dropdown --- */} 
                                <Form.Group className="mt-3">
                                    <Form.Label><strong>Alterar Estado:</strong></Form.Label>
                                    <Dropdown onSelect={(eventKey) => handleStatusChange(parseInt(eventKey))}>
                                        <Dropdown.Toggle 
                                            variant="outline-secondary" 
                                            id="dropdown-status-change" 
                                            size="sm"
                                            disabled={isUpdatingStatus} // Disable while updating
                                            className="w-100 d-flex justify-content-between align-items-center"
                                        >
                                            {isUpdatingStatus ? 
                                                <Spinner as="span" animation="border" size="sm" /> : 
                                                <AnuncioStatusBadge statusId={selectedAnuncio.Status_AnuncioID_Status_Anuncio} />
                                            }
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="w-100">
                                            {statusOptions.map(opt => (
                                                // Don't show the 'All' option and the current status
                                                opt.id !== '' && opt.id !== selectedAnuncio.Status_AnuncioID_Status_Anuncio ? (
                                                    <Dropdown.Item 
                                                        key={`status-change-${opt.id}`} 
                                                        eventKey={opt.id.toString()} // Pass ID as eventKey
                                                    >
                                                       {/* Render badge inside item for visual cue */}
                                                       <AnuncioStatusBadge statusId={opt.id} /> {opt.name} 
                                                    </Dropdown.Item>
                                                ) : null
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                                {error && <Alert variant="danger" className="mt-2 py-1 px-2 small">{error}</Alert>} {/* Show error specific to modal actions */} 
                            </Col>
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeDetailsModal}>
                        Fechar
                    </Button>
                     {/* Show success message inside modal footer? */}
                     {message && <span className="text-success ms-2 small"><i className="fas fa-check-circle me-1"></i>{message}</span>}
                </Modal.Footer>
            </Modal>
            {/* --- End Details Modal --- */}

        </>
    );
};

export default AllAnuncios; 