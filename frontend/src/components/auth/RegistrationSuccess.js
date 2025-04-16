import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Alert, Button, Card } from 'react-bootstrap';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const RegistrationSuccess = () => {
    return (
        <>
            <Header />
            <Container className="my-5">
                <Card className="shadow-sm">
                    <Card.Body className="p-5 text-center">
                        <div className="mb-4">
                            <i className="fas fa-check-circle text-success" style={{ fontSize: '4rem' }}></i>
                        </div>
                        <h2 className="mb-3">Pedido de Registo Enviado!</h2>
                        <Alert variant="success" className="mb-4">
                            <p className="mb-0">O seu pedido de registo foi enviado com sucesso e será analisado por um administrador.</p>
                        </Alert>
                        <p className="mb-4">
                            Iremos analisar os seus dados e entraremos em contacto através do email fornecido.
                            Após a aprovação, poderá aceder à sua conta e começar a utilizar a plataforma.
                        </p>
                        <div className="d-flex justify-content-center">
                            <Button as={Link} to="/" variant="primary" className="me-3">
                                <i className="fas fa-home me-2"></i>
                                Voltar para a Página Inicial
                            </Button>
                            <Button as={Link} to="/login" variant="outline-primary">
                                <i className="fas fa-sign-in-alt me-2"></i>
                                Iniciar Sessão
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default RegistrationSuccess;
