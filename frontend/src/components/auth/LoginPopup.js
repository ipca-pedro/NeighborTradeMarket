import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const LoginPopup = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            await login(email, password);
            onClose();
            navigate('/perfil');
        } catch (err) {
            setError('Email ou palavra-passe inválidos');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Card className="shadow">
            <Card.Body className="p-4">
                <h4 className="text-center mb-4">Iniciar sessão na sua conta</h4>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
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

                    <Form.Group className="mb-3">
                        <Form.Label className="d-flex justify-content-between">
                            <span>Palavra-passe</span>
                            <Link to="/recuperar-password" className="text-decoration-none" onClick={onClose}>
                                Esqueceu a Palavra-passe?
                            </Link>
                        </Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Introduza a sua palavra-passe"
                                required
                            />
                            <Button 
                                variant="link" 
                                className="position-absolute end-0 top-0 text-decoration-none" 
                                style={{ padding: '0.375rem 0.75rem' }}
                                onClick={togglePasswordVisibility}
                            >
                                <i className={`far ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </Button>
                        </div>
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100 py-2 mt-2 mb-3" 
                        disabled={loading}
                        style={{ backgroundColor: '#F97316', borderColor: '#F97316' }}
                    >
                        {loading ? 'A iniciar sessão...' : 'INICIAR SESSÃO'}
                    </Button>

                    <div className="text-center">
                        <p className="mb-0">Não tem uma conta?</p>
                        <Link 
                            to="/registar" 
                            className="d-block fw-bold text-decoration-none"
                            onClick={onClose}
                        >
                            CRIAR CONTA
                        </Link>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default LoginPopup;
