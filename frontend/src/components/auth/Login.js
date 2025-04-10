import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [redirectMessage, setRedirectMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Verificar se há uma mensagem de redirecionamento na localização atual
    useEffect(() => {
        if (location.state && location.state.message) {
            setRedirectMessage(location.state.message);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Fazer login e obter resposta
            const response = await authService.login(email, password);
            
            // Obter o usuário do localStorage (onde o authService o armazena)
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            
            console.log('Usuário logado:', user);
            
            // Verificar se o usuário é administrador
            if (user && user.TipoUserID_TipoUser === 1) {
                console.log('Usuário é administrador, redirecionando para /admin');
                // Redirecionar para a página de administração
                navigate('/admin');
            } else {
                console.log('Usuário não é administrador, redirecionando para a página anterior ou home');
                // Redirecionar para a página anterior se existir
                if (location.state && location.state.from) {
                    navigate(location.state.from);
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            console.error('Erro de login:', err);
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
                {redirectMessage && <Alert variant="info">{redirectMessage}</Alert>}
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
