import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Card, Badge, Spinner, OverlayTrigger, Tooltip } from 'react-bootstrap';
import api, { adminService } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

// Helper function to get the base URL for storage
const getStorageBaseUrl = () => {
    const apiUrl = api.defaults.baseURL || '';
    return apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
};

const PendingUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        loadPendingUsers();
    }, []);

    const loadPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPendingUsers();
            setUsers(response || []);
            setError('');
            setMessage('');
        } catch (err) {
            console.error('Erro ao carregar utilizadores pendentes:', err);
            setError('Erro ao carregar utilizadores pendentes. Por favor, tente novamente.');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        setMessage('');
        setError('');
        try {
            await adminService.approveUser(userId);
            setMessage('Utilizador aprovado com sucesso!');
            setUsers(users.filter(user => user.ID_User !== userId));
        } catch (err) {
            console.error('Erro ao aprovar utilizador:', err);
            setError(err.response?.data?.message || 'Erro ao aprovar utilizador. Por favor, tente novamente.');
        }
    };

    const openRejectModal = (user) => {
        setSelectedUser(user);
        setRejectReason('');
        setShowRejectModal(true);
    };

    const confirmReject = async () => {
        if (!rejectReason.trim() || !selectedUser) {
            return;
        }
        setMessage('');
        setError('');
        try {
            await adminService.rejectUser(selectedUser.ID_User, rejectReason);
            setMessage('Utilizador rejeitado com sucesso!');
            setUsers(users.filter(user => user.ID_User !== selectedUser.ID_User));
            setShowRejectModal(false);
            setSelectedUser(null);
        } catch (err) {
            console.error('Erro ao rejeitar utilizador:', err);
            setError(err.response?.data?.message || 'Erro ao rejeitar utilizador. Por favor, tente novamente.');
        }
    };

    const renderAddressTooltip = (props, morada) => (
        <Tooltip id="button-tooltip" {...props}>
            {morada?.Rua ? morada.Rua : 'Morada não disponível'}
        </Tooltip>
    );

    const getDocumentInfo = (imagem) => {
        if (!imagem?.Caminho) {
            return { text: 'Sem documento', isPdf: false, path: null };
        }
        const isPdf = imagem.Caminho.toLowerCase().endsWith('.pdf');
        const filename = imagem.Caminho.split('/').pop();
        return { text: filename, isPdf: isPdf, path: imagem.Caminho };
    };

    return (
        <>
            <Header />
            <Container className="my-5">
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white">
                        <h2 className="mb-0">Utilizadores Pendentes</h2>
                    </Card.Header>
                    <Card.Body>
                        {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">A carregar utilizadores pendentes...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <Alert variant="info">Não há utilizadores pendentes de aprovação.</Alert>
                        ) : (
                            <Table responsive hover className="align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Morada</th>
                                        <th>Documento</th>
                                        <th>Estado</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => {
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
                                                            <small className="d-block text-muted">CC: {user.CC}</small>
                                                            <small className="d-block text-muted">Nasc: {new Date(user.Data_Nascimento).toLocaleDateString()}</small>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{user.Email}</td>
                                                <td>
                                                    <OverlayTrigger
                                                        placement="top"
                                                        delay={{ show: 250, hide: 400 }}
                                                        overlay={(props) => renderAddressTooltip(props, user.morada)}
                                                    >
                                                        <span>{user.morada?.Rua?.substring(0, 25) + (user.morada?.Rua?.length > 25 ? '...' : '') || 'N/A'}</span>
                                                    </OverlayTrigger>
                                                </td>
                                                <td>
                                                    {docInfo.path ? (
                                                        <a 
                                                            href={`${getStorageBaseUrl()}/storage/${docInfo.path}`}
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center"
                                                            title={docInfo.text}
                                                        >
                                                            <i className={`fas ${docInfo.isPdf ? 'fa-file-pdf' : 'fa-file-image'} me-1`}></i>
                                                            Ver
                                                        </a>
                                                    ) : (
                                                        <Badge bg="secondary" text="dark">Nenhum</Badge>
                                                    )}
                                                </td>
                                                <td>
                                                    <Badge bg="warning">Pendente</Badge>
                                                </td>
                                                <td>
                                                    <Button 
                                                        variant="success" 
                                                        size="sm" 
                                                        className="me-2" 
                                                        title="Aprovar Utilizador"
                                                        onClick={() => handleApprove(user.ID_User)}
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </Button>
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm"
                                                        title="Rejeitar Utilizador"
                                                        onClick={() => openRejectModal(user)}
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showRejectModal} onHide={() => { setShowRejectModal(false); setSelectedUser(null); }}>
                <Modal.Header closeButton>
                    <Modal.Title>Rejeitar Utilizador: {selectedUser?.Name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Motivo da rejeição</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Informe o motivo da rejeição do utilizador"
                                required
                                autoFocus
                            />
                            <Form.Text className="text-muted">
                                Este motivo pode ser comunicado ao utilizador.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowRejectModal(false); setSelectedUser(null); }}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={confirmReject} 
                        disabled={!rejectReason.trim()}
                    >
                        Confirmar Rejeição
                    </Button>
                </Modal.Footer>
            </Modal>
            <Footer />
        </>
    );
};

export default PendingUsers;
