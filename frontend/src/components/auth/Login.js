import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { Form, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.login(email, password);
            navigate('/');
        } catch (err) {
            setError('Email ou palavra-passe inválidos');
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
                            <h2 className="text-center mb-4">Iniciar Sessão</h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Palavra-passe</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mb-3" disabled={loading}>
                        {loading ? 'A entrar...' : 'Entrar'}
                    </Button>

                    <div className="text-center mt-3">
                        <Link to="/forgot-password">Esqueceu a sua palavra-passe?</Link>
                    </div>
                    <div className="text-center mt-3">
                        Não tem uma conta? <Link to="/registar">Criar Conta</Link>
                    </div>
                </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
}

export default Login;
