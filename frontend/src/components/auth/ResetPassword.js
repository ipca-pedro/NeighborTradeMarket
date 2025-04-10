import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        Email: '',
        Password: '',
        Password_confirmation: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.resetPassword({
                ...formData,
                token
            });
            
            // Redirecionar para login após sucesso
            navigate('/login', { 
                state: { message: 'Senha atualizada com sucesso! Faça login com sua nova senha.' }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao redefinir senha');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">
                    Token de recuperação não encontrado.
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <div className="w-100" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h2 className="text-center mb-4">Redefinir Senha</h2>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Nova Senha</Form.Label>
                        <Form.Control
                            type="password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirmar Nova Senha</Form.Label>
                        <Form.Control
                            type="password"
                            name="Password_confirmation"
                            value={formData.Password_confirmation}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100"
                        disabled={loading}
                    >
                        {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default ResetPassword;
