import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Card, Badge, Spinner } from 'react-bootstrap';
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
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        loadPendingUsers();
    }, []);

    const loadPendingUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getPendingUsers();
            setUsers(response);
            setError('');
        } catch (err) {
            console.error('Erro ao carregar utilizadores pendentes:', err);
            setError('Erro ao carregar utilizadores pendentes. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await adminService.approveUser(userId);
            setMessage('Utilizador aprovado com sucesso!');
            // Remover o usuário da lista
            setUsers(users.filter(user => user.ID_User !== userId));
        } catch (err) {
            console.error('Erro ao aprovar utilizador:', err);
            setError('Erro ao aprovar utilizador. Por favor, tente novamente.');
        }
    };

    const handleReject = (userId) => {
        setSelectedUserId(userId);
        setRejectReason('');
        setShowRejectModal(true);
    };

    const confirmReject = async () => {
        if (!rejectReason.trim()) {
            return;
        }

        try {
            await adminService.rejectUser(selectedUserId, rejectReason);
            setMessage('Utilizador rejeitado com sucesso!');
            // Remover o usuário da lista
            setUsers(users.filter(user => user.ID_User !== selectedUserId));
            setShowRejectModal(false);
        } catch (err) {
            console.error('Erro ao rejeitar utilizador:', err);
            setError('Erro ao rejeitar utilizador. Por favor, tente novamente.');
        }
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
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">Carregando utilizadores pendentes...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <Alert variant="info">Não há utilizadores pendentes de aprovação.</Alert>
                        ) : (
                            <Table responsive hover className="align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>CC</th>
                                        <th>Data de Nascimento</th>
                                        <th>Documentos</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.ID_User}>
                                            <td>
                                                <div className="d-flex align-items-center">
                                                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                                                        <span>{user.Name?.charAt(0) || '?'}</span>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold">{user.Name}</div>
                                                        <small className="text-muted">@{user.User_Name}</small>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{user.Email}</td>
                                            <td>{user.CC}</td>
                                            <td>{new Date(user.Data_Nascimento).toLocaleDateString()}</td>
                                            <td>
                                                {user.imagem?.Caminho ? (
                                                    <a 
                                                        href={`${getStorageBaseUrl()}/storage/${user.imagem.Caminho}`}
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <i className="fas fa-file-alt me-1"></i> Ver Documento
                                                    </a>
                                                ) : (
                                                    <Badge bg="warning" text="dark">Sem documento</Badge>
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
                                                    onClick={() => handleApprove(user.ID_User)}
                                                >
                                                    <i className="fas fa-check me-1"></i> Aprovar
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    size="sm"
                                                    onClick={() => handleReject(user.ID_User)}
                                                >
                                                    <i className="fas fa-times me-1"></i> Rejeitar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            {/* Modal de Rejeição */}
            <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Rejeitar Utilizador</Modal.Title>
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
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
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
