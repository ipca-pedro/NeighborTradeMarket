import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const ForgotPassword = () => {
    const navigate = useNavigate();
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
            await api.resetPassword(formData);
            navigate('/login', { 
                state: { message: 'Palavra-passe atualizada com sucesso! Inicie sessão com a sua nova palavra-passe.' }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao redefinir palavra-passe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Container className="my-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <div className="bg-white p-4 rounded shadow">
                            <h2 className="text-center mb-4">Recuperar Palavra-passe</h2>

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
                        <Form.Label>Nova Palavra-passe</Form.Label>
                        <Form.Control
                            type="password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Confirmar Nova Palavra-passe</Form.Label>
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
                        className="w-100 mb-3"
                        disabled={loading}
                    >
                        {loading ? 'A processar...' : 'Recuperar Palavra-passe'}
                    </Button>
                    
                    <div className="text-center mt-3">
                        <Link to="/login">Voltar para Iniciar Sessão</Link>
                    </div>
                </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default ForgotPassword;
