import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button, Alert, Card, Breadcrumb } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const RecuperarPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            await resetPassword(email);
            setMessage('Foi enviado um código para o seu email. Verifique a sua caixa de entrada.');
        } catch (err) {
            setError('Não foi possível enviar o código de recuperação. Verifique se o email está correto.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Container className="my-4">
                <Breadcrumb>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Início</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/conta-utilizador" }}>Conta Utilizador</Breadcrumb.Item>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/iniciar-sessao" }}>Iniciar Sessão</Breadcrumb.Item>
                    <Breadcrumb.Item active>Esqueceu a Palavra-passe</Breadcrumb.Item>
                </Breadcrumb>

                <div className="d-flex justify-content-center my-5">
                    <Card className="shadow-sm" style={{ maxWidth: '450px' }}>
                        <Card.Body className="p-4">
                            <h4 className="text-center mb-3">Esqueceu a Palavra-passe</h4>
                            <p className="text-center text-muted mb-4">
                                Introduza o endereço de email ou número de telefone
                                associado à sua conta NeighborTrade
                            </p>

                            {error && <Alert variant="danger">{error}</Alert>}
                            {message && <Alert variant="success">{message}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Introduza o seu email"
                                        required
                                    />
                                </Form.Group>

                                <Button 
                                    variant="primary" 
                                    type="submit" 
                                    className="w-100 py-2 mt-3" 
                                    disabled={loading}
                                    style={{ backgroundColor: '#F97316', borderColor: '#F97316' }}
                                >
                                    {loading ? 'A enviar código...' : 'ENVIAR CÓDIGO'}
                                </Button>

                                <div className="text-center mt-3">
                                    <p className="mb-1">Já tem uma conta? <Link to="/iniciar-sessao" className="text-decoration-none">Iniciar Sessão</Link></p>
                                    <p className="mb-0">Não tem uma conta? <Link to="/registar" className="text-decoration-none">Criar Conta</Link></p>
                                </div>
                            </Form>

                            <div className="mt-4 text-center">
                                <p className="mb-0">
                                    Pode contactar o <Link to="/apoio-cliente" className="text-decoration-none fw-bold">Apoio ao Cliente</Link> para ajuda a recuperar
                                    acesso à sua conta.
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Container>
            <Footer />
        </>
    );
};

export default RecuperarPassword;
