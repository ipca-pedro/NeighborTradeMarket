import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import api from '../../services/api';

const PendingUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        loadPendingUsers();
    }, []);

    const loadPendingUsers = async () => {
        try {
            const response = await api.get('/admin/pending-users');
            setUsers(response.data);
        } catch (err) {
            setError('Erro ao carregar utilizadores pendentes');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await api.post(`/admin/approve-user/${userId}`);
            loadPendingUsers();
        } catch (err) {
            setError('Erro ao aprovar utilizador');
        }
    };

    const handleReject = async (userId) => {
        try {
            await api.post(`/admin/reject-user/${userId}`);
            loadPendingUsers();
        } catch (err) {
            setError('Erro ao rejeitar utilizador');
        }
    };

    if (loading) return <div>A carregar...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    return (
        <Container className="mt-4">
            <h2>Utilizadores Pendentes</h2>
            
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>CC</th>
                        <th>Data de Nascimento</th>
                        <th>Comprovativo</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.ID_User}>
                            <td>{user.Name}</td>
                            <td>{user.Email}</td>
                            <td>{user.CC}</td>
                            <td>{new Date(user.Data_Nascimento).toLocaleDateString()}</td>
                            <td>
                                <a 
                                    href={`${process.env.REACT_APP_API_URL}/storage/${user.morada?.imagem?.Path}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    Ver Comprovativo
                                </a>
                            </td>
                            <td>
                                <Button 
                                    variant="success" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleApprove(user.ID_User)}
                                >
                                    Aprovar
                                </Button>
                                <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleReject(user.ID_User)}
                                >
                                    Rejeitar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>


        </Container>
    );
};

export default PendingUsers;
