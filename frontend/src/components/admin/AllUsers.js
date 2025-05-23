import React, { useState, useEffect, useMemo } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Card, Badge, Spinner, Dropdown, InputGroup, FormControl, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import api, { adminService, getImageUrl } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

// Helper function to get the base URL for storage - Reuse from PendingUsers
const getStorageBaseUrl = () => {
    const apiUrl = api.defaults.baseURL || '';
    return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
};

// Helper function to render address tooltip - Reuse from PendingUsers
const renderAddressTooltip = (props, morada) => (
    <Tooltip id="address-tooltip" {...props}>
        {morada?.Rua ? morada.Rua : 'Morada não disponível'}
        {/* Add more address fields here if available */} 
    </Tooltip>
);

// Helper function to get document info - Reuse from PendingUsers
const getDocumentInfo = (imagem) => {
    if (!imagem?.Caminho) {
        return { text: 'Sem documento', isPdf: false, path: null };
    }
    const isPdf = imagem.Caminho.toLowerCase().endsWith('.pdf');
    const filename = imagem.Caminho.split('/').pop();
    return { text: filename, isPdf: isPdf, path: imagem.Caminho };
};

const AllUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    
    // --- State for Filtering and Searching ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterType, setFilterType] = useState('');

    // --- Assuming Status and Type options (fetch from API later if dynamic) ---
    // TODO: Ideally, fetch these from the database/API
    const statusOptions = [
        { id: '', name: 'Todos os Estados' },
        { id: 1, name: 'Pendente' }, 
        { id: 2, name: 'Ativo' },
        { id: 8, name: 'Rejeitado' },
        // Add other statuses like Inativo, Bloqueado if they exist with correct IDs from DB
    ];
    const typeOptions = [
        { id: '', name: 'Todos os Tipos' },
        { id: 1, name: 'Administrador' },
        { id: 2, name: 'Utilizador Normal' },
    ];
    // --- --- --- --- --- --- --- --- --- --- ---

    useEffect(() => {
        loadAllUsers();
    }, []);

    const loadAllUsers = async () => {
        try {
            setLoading(true);
            setError('');
            setMessage('');
            const response = await adminService.getAllUsers();
            setAllUsers(response || []);
        } catch (err) {
            console.error('Erro ao carregar utilizadores:', err);
            setError('Erro ao carregar utilizadores. Por favor, tente novamente.');
            setAllUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // --- Filtering Logic --- 
    const filteredUsers = useMemo(() => {
        return allUsers.filter(user => {
            const statusMatch = filterStatus === '' || user.Status_UtilizadorID_status_utilizador === parseInt(filterStatus);
            const typeMatch = filterType === '' || user.TipoUserID_TipoUser === parseInt(filterType);
            const searchMatch = searchTerm === '' || 
                                user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.User_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                user.Email?.toLowerCase().includes(searchTerm.toLowerCase());
            return statusMatch && typeMatch && searchMatch;
        });
    }, [allUsers, searchTerm, filterStatus, filterType]);
    // --- --- --- --- --- --- --- --- --- --- ---

    // --- Status and Type Badge Functions (Adjust IDs based on actual DB values) ---
    const getStatusBadge = (statusId) => {
        // TODO: Verify these IDs against your status_utilizador table
        switch (statusId) {
            case 1: return <Badge bg="warning">Pendente</Badge>;
            case 2: return <Badge bg="success">Ativo</Badge>;
            case 8: return <Badge bg="danger">Rejeitado</Badge>; 
            // Add other cases: Inativo, Bloqueado, etc.
            default: return <Badge bg="light" text="dark">Desconhecido ({statusId})</Badge>;
        }
    };

    const getUserTypeBadge = (typeId) => {
        // Assuming 1=Admin, 2=User based on previous context
        switch (typeId) {
            case 1: return <Badge bg="primary">Admin</Badge>;
            case 2: return <Badge bg="info">Utilizador</Badge>;
            default: return <Badge bg="light" text="dark">Desconhecido ({typeId})</Badge>;
        }
    };
    // --- --- --- --- --- --- --- --- --- --- ---

    // --- Placeholder for Status Change - Needs API implementation if required ---
    const handleStatusChange = async (userId, newStatusId) => {
        // TODO: Implement API call if needed, or remove this if status change is done elsewhere
        setMessage(`Ação 'Alterar Status' para User ID ${userId} para ${newStatusId} ainda não implementada.`);
        setError('');
        setTimeout(() => setMessage(''), 3000);
    };
    // --- --- --- --- --- --- --- --- --- --- ---

    return (
        <>
            <Header />
            <Container className="my-5">
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                        <h2 className="mb-0">Gestão de Utilizadores</h2>
                        {/* Optional: Add button to create new user? */}
                    </Card.Header>
                    <Card.Body>
                        {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
                        
                        {/* --- Filter and Search Controls --- */} 
                        <Row className="mb-3 gx-2">
                            <Col md={5}>
                                <InputGroup>
                                    <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
                                    <FormControl
                                        placeholder="Pesquisar por nome, username ou email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={3}>
                                <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                    {statusOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)} 
                                </Form.Select>
                            </Col>
                            <Col md={3}>
                                <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                                    {typeOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                                </Form.Select>
                            </Col>
                             <Col md={1} className="d-flex align-items-end">
                                <Button variant="outline-secondary" onClick={() => { setSearchTerm(''); setFilterStatus(''); setFilterType(''); }} title="Limpar Filtros">
                                    <i className="fas fa-times"></i>
                                </Button>
                            </Col>
                        </Row>
                         {/* --- --- --- --- --- --- --- --- --- */} 

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">A carregar utilizadores...</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-2 text-muted small">A mostrar {filteredUsers.length} de {allUsers.length} utilizadores</div>
                                <Table responsive hover className="align-middle">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Utilizador</th>
                                            <th>Email</th>
                                            <th>Morada</th>
                                            <th>Tipo</th>
                                            <th>Estado</th>
                                            <th>Documento</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map(user => {
                                                const docInfo = getDocumentInfo(user.imagem);
                                                return (
                                                    <tr key={user.ID_User}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                                                                    <span title={`${user.Name} (${user.User_Name})`}>{user.Name?.charAt(0)?.toUpperCase() || '?'}</span>
                                                                </div>
                                                                <div>
                                                                    <div className="fw-bold">{user.Name}</div>
                                                                    <small className="text-muted">@{user.User_Name}</small>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>{user.Email}</td>
                                                        <td>
                                                            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }} overlay={(props) => renderAddressTooltip(props, user.morada)}>
                                                                <span>{user.morada?.Rua?.substring(0, 25) + (user.morada?.Rua?.length > 25 ? '...' : '') || 'N/A'}</span>
                                                            </OverlayTrigger>
                                                        </td>
                                                        <td>{getUserTypeBadge(user.TipoUserID_TipoUser)}</td>
                                                        <td>{getStatusBadge(user.Status_UtilizadorID_status_utilizador)}</td>
                                                        <td>
                                                            {docInfo.path ? (
                                                                <a 
                                                                    href={`${getStorageBaseUrl()}/storage/${docInfo.path}`}
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center"
                                                                    title={docInfo.text}
                                                                >
                                                                    <i className={`fas ${docInfo.isPdf ? 'fa-file-pdf' : 'fa-file-image'} me-1`}></i> Ver
                                                                </a>
                                                            ) : (
                                                                <span className="text-muted small">Nenhum</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center text-muted py-4">
                                                    Nenhum utilizador encontrado com os filtros atuais.
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
        </>
    );
};

export default AllUsers;
