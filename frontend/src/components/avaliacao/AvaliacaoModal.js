import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { criarAvaliacao, buscarNotas } from '../../services/avaliacaoService';

const AvaliacaoModal = ({ show, onHide, compraId, onSuccess }) => {
    const [selectedNota, setSelectedNota] = useState(null);
    const [comentario, setComentario] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [notas, setNotas] = useState([]);

    useEffect(() => {
        const carregarNotas = async () => {
            try {
                console.log('Carregando notas disponíveis...');
                const notasData = await buscarNotas();
                console.log('Notas carregadas:', notasData);
                setNotas(notasData);
            } catch (error) {
                console.error('Erro ao carregar notas:', error);
                toast.error('Erro ao carregar opções de avaliação');
            }
        };
        if (show) {
            carregarNotas();
            setSelectedNota(null);
            setComentario('');
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Iniciando submissão da avaliação...');
        console.log('Dados do formulário:', {
            compraId,
            notaId: selectedNota,
            comentario
        });

        // Validações
        if (!compraId) {
            console.error('ID da compra não fornecido');
            toast.error('Erro: ID da compra não fornecido');
            return;
        }

        if (!selectedNota) {
            console.error('Nenhuma nota selecionada');
            toast.error('Por favor, selecione uma classificação');
            return;
        }

        if (!comentario.trim()) {
            console.error('Comentário vazio');
            toast.error('Por favor, deixe um comentário');
            return;
        }

        setSubmitting(true);
        try {
            console.log('Enviando avaliação para a API...');
            await criarAvaliacao({
                compra_id: compraId,
                nota_id: selectedNota,
                comentario: comentario.trim()
            });

            console.log('Avaliação enviada com sucesso');
            toast.success('Avaliação enviada com sucesso!');
            setSelectedNota(null);
            setComentario('');
            onSuccess();
            onHide();
        } catch (error) {
            console.error('Erro ao enviar avaliação:', error);
            toast.error(error.message || 'Erro ao enviar avaliação');
        } finally {
            setSubmitting(false);
        }
    };

    const renderEstrelas = (quantidade) => {
        return [...Array(quantidade)].map((_, index) => (
            <FaStar key={index} className="star" size={16} style={{ color: '#ffc107', marginRight: '2px' }} />
        ));
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Avaliar Compra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Label>Sua Avaliação</Form.Label>
                        <div className="d-flex flex-column gap-2">
                            {notas.map((nota) => (
                                <div
                                    key={nota.ID_Nota}
                                    className={`p-2 rounded cursor-pointer ${
                                        selectedNota === nota.ID_Nota
                                            ? 'bg-primary text-white'
                                            : 'bg-light'
                                    }`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setSelectedNota(nota.ID_Nota)}
                                >
                                    <div className="d-flex align-items-center">
                                        <div className="me-2">
                                            {renderEstrelas(nota.ID_Nota)}
                                        </div>
                                        <span>{nota.Descricao_nota}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Comentário</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            placeholder="Deixe um comentário sobre sua experiência..."
                            required
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={submitting}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Enviar Avaliação'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AvaliacaoModal;