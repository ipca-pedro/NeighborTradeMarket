import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert, Spinner } from 'react-bootstrap';
import api from '../../services/api';

const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState({ loading: true, error: null, success: false });

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await api.verifyEmail(token);
                setStatus({ loading: false, error: null, success: true });
                // Redirecionar para login após 3 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus({
                    loading: false,
                    error: error.response?.data?.message || 'Erro ao verificar email',
                    success: false
                });
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <Container className="mt-5">
            <div className="w-100" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h2 className="text-center mb-4">Verificação de Email</h2>

                {status.loading && (
                    <div className="text-center">
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">A verificar...</span>
                        </Spinner>
                        <p className="mt-2">A verificar o seu email...</p>
                    </div>
                )}

                {status.error && (
                    <>
                        <Alert variant="danger">
                            {status.error}
                        </Alert>
                        <p className="text-center">
                            <a href="/resend-verification">Reenviar email de verificação</a>
                        </p>
                    </>
                )}

                {status.success && (
                    <Alert variant="success">
                        Email verificado com sucesso! Será redirecionado para a página de login em breve...
                    </Alert>
                )}
            </div>
        </Container>
    );
};

export default VerifyEmail;
