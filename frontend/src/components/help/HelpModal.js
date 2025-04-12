import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useChat } from '../../contexts/ChatContext';

const HelpModal = ({ show, onHide }) => {
    const { toggleChat } = useChat();

    const handleChatClick = () => {
        onHide();
        toggleChat();
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Precisa de Ajuda?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-4">
                    <h5 className="text-primary">
                        <i className="fas fa-phone me-2"></i>
                        Telefone
                    </h5>
                    <p className="ms-4 mb-0">
                        <a href="tel:+351253802190" className="text-decoration-none">
                            (+351) 253 802 190
                        </a>
                    </p>
                </div>

                <div className="mb-4">
                    <h5 className="text-primary">
                        <i className="fas fa-envelope me-2"></i>
                        Email
                    </h5>
                    <p className="ms-4 mb-0">
                        <a href="mailto:info@neighbortrade.com" className="text-decoration-none">
                            info@neighbortrade.com
                        </a>
                    </p>
                </div>

                <div className="mb-4">
                    <h5 className="text-primary">
                        <i className="fas fa-map-marker-alt me-2"></i>
                        Morada
                    </h5>
                    <p className="ms-4 mb-0">
                        Campus do IPCA<br />
                        Lugar do Aldão<br />
                        4750-810 Barcelos
                    </p>
                </div>

                <div>
                    <h5 className="text-primary">
                        <i className="fas fa-robot me-2"></i>
                        Assistente Virtual
                    </h5>
                    <p className="ms-4 mb-0">
                        Nosso assistente virtual está disponível 24/7 para ajudar com suas dúvidas.
                    </p>
                    <div className="ms-4 mt-2">
                        <Button variant="primary" onClick={handleChatClick}>
                            <i className="fas fa-comments me-2"></i>
                            Iniciar Chat
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default HelpModal;
