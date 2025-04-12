import React, { useState } from 'react';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ChatBot from '../chat/ChatBot';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const NoProductsFound = () => {

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            
            <Container className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <div className="empty-state text-center">
                    <div className="empty-state-icon mb-4">
                        <i className="fas fa-times-circle fa-5x text-danger"></i>
                    </div>
                    <h2 className="mb-4">Nenhum Produto Disponível</h2>
                    <p className="text-muted mb-4">
                        Desculpe, não encontramos produtos disponíveis nesta categoria no momento.
                    </p>
                    <ButtonGroup className="d-flex justify-content-center gap-3">
                        <Button 
                            as={Link} 
                            to="/" 
                            variant="primary" 
                            size="lg"
                            className="px-4"
                        >
                            <i className="fas fa-home me-2"></i>
                            Voltar à Página Principal
                        </Button>
                        <Button 
                            variant="primary" 
                            size="lg"
                            className="px-4"
                            onClick={() => document.querySelector('.chat-toggle-button').click()}
                        >
                            <i className="fas fa-robot me-2"></i>
                            Falar com Assistente
                        </Button>
                    </ButtonGroup>
                    <ChatBot />
                </div>
            </Container>

            <Footer />
        </div>
    );
};

export default NoProductsFound;
