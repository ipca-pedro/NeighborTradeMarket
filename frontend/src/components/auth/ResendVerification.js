import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import api from '../../services/api';

const ResendVerification = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/auth/resend-verification', { email });
            setStatus({
                type: 'success',
                message: 'Email de verificação reenviado com sucesso!'
            });
        } catch (error) {
            setStatus({
                type: 'danger',
                message: error.response?.data?.message || 'Erro ao reenviar email de verificação'
            });
        }
        setLoading(false);
    };

    return (
        <Container className="mt-5">
            <div className="w-100" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h2 className="text-center mb-4">Reenviar Email de Verificação</h2>
                
                {status.message && (
                    <Alert variant={status.type}>
                        {status.message}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Introduza o seu email"
                        />
                    </Form.Group>

                    <Button 
                        variant="primary" 
                        type="submit" 
                        className="w-100"
                        disabled={loading}
                    >
                        {loading ? 'A enviar...' : 'Reenviar Email de Verificação'}
                    </Button>
                </Form>
            </div>
        </Container>
    );
};

export default ResendVerification;
