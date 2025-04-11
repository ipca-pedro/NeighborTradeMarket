import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Card, Badge, Spinner, Dropdown } from 'react-bootstrap';
import { adminService } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [statusOptions, setStatusOptions] = useState([
        { id: 1, name: 'Pendente' },
        { id: 2, name: 'Ativo' },
        { id: 3, name: 'Inativo' },
        { id: 4, name: 'Bloqueado' }
    ]);

    useEffect(() => {
        loadAllUsers();
    }, []);

    const loadAllUsers = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAllUsers();
            setUsers(response);
            setError('');
        } catch (err) {
            console.error('Erro ao carregar utilizadores:', err);
            setError('Erro ao carregar utilizadores. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (userId, newStatusId) => {
        try {
            await adminService.updateUserStatus(userId, newStatusId);
            
            // Atualizar o estado local para refletir a mudança
            setUsers(users.map(user => 
                user.ID_User === userId 
                    ? {...user, Status_UtilizadorID_status_utilizador: newStatusId} 
                    : user
            ));
            
            setMessage('Status do utilizador atualizado com sucesso!');
            
            // Limpar a mensagem após 3 segundos
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (err) {
            console.error('Erro ao atualizar status do utilizador:', err);
            setError('Erro ao atualizar status do utilizador. Por favor, tente novamente.');
            
            // Limpar a mensagem de erro após 3 segundos
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    const getStatusBadge = (statusId) => {
        switch (statusId) {
            case 1:
                return <Badge bg="warning">Pendente</Badge>;
            case 2:
                return <Badge bg="success">Ativo</Badge>;
            case 3:
                return <Badge bg="secondary">Inativo</Badge>;
            case 4:
                return <Badge bg="danger">Bloqueado</Badge>;
            default:
                return <Badge bg="light" text="dark">Desconhecido</Badge>;
        }
    };

    const getUserTypeBadge = (typeId) => {
        switch (typeId) {
            case 1:
                return <Badge bg="primary">Administrador</Badge>;
            case 2:
                return <Badge bg="info">Utilizador</Badge>;
            default:
                return <Badge bg="light" text="dark">Desconhecido</Badge>;
        }
    };

    return (
        <>
            <Header />
            <Container className="my-5">
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white">
                        <h2 className="mb-0">Gestão de Utilizadores</h2>
                    </Card.Header>
                    <Card.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">Carregando utilizadores...</p>
                            </div>
                        ) : users.length === 0 ? (
                            <Alert variant="info">Não há utilizadores registrados no sistema.</Alert>
                        ) : (
                            <Table responsive hover className="align-middle">
                                <thead className="bg-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Tipo</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.ID_User}>
                                            <td>{user.ID_User}</td>
                                            <td>{user.Nome}</td>
                                            <td>{user.Email}</td>
                                            <td>
                                                {getUserTypeBadge(user.TipoUserID_TipoUser)}
                                            </td>
                                            <td>
                                                {getStatusBadge(user.Status_UtilizadorID_status_utilizador)}
                                            </td>
                                            <td>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="outline-secondary" size="sm" id={`dropdown-${user.ID_User}`}>
                                                        Alterar Status
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {statusOptions.map(status => (
                                                            <Dropdown.Item 
                                                                key={status.id}
                                                                onClick={() => handleStatusChange(user.ID_User, status.id)}
                                                                active={user.Status_UtilizadorID_status_utilizador === status.id}
                                                            >
                                                                {status.name}
                                                            </Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>
            <Footer />
        </>
    );
};

export default AllUsers;
