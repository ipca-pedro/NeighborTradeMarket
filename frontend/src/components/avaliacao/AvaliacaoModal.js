import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { criarAvaliacao, buscarNotas } from '../../services/avaliacaoService';

const AvaliacaoModal = ({ show, onHide, compraId, onSuccess }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comentario, setComentario] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [notas, setNotas] = useState([]);

    useEffect(() => {
        const carregarNotas = async () => {
            try {
                const notasData = await buscarNotas();
                setNotas(notasData);
            } catch (error) {
                console.error('Erro ao carregar notas:', error);
                toast.error('Erro ao carregar opções de avaliação');
            }
        };
        if (show) {
            carregarNotas();
        }
    }, [show]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Por favor, selecione uma classificação');
            return;
        }

        setSubmitting(true);
        try {
            await criarAvaliacao({
                compra_id: compraId,
                nota_id: rating,
                comentario: comentario
            });

            toast.success('Avaliação enviada com sucesso!');
            setRating(0);
            setComentario('');
            onSuccess();
            onHide();
        } catch (error) {
            toast.error(error.message || 'Erro ao enviar avaliação');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Avaliar Compra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <div className="mb-4 text-center">
                        <div className="d-flex justify-content-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    className="star"
                                    size={32}
                                    style={{
                                        cursor: 'pointer',
                                        marginRight: '8px',
                                        color: (hover || rating) >= star ? '#ffc107' : '#e4e5e9'
                                    }}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(rating)}
                                />
                            ))}
                        </div>
                        <small className="text-muted mt-2">
                            {rating === 1 && "Muito insatisfeito"}
                            {rating === 2 && "Insatisfeito"}
                            {rating === 3 && "Neutro"}
                            {rating === 4 && "Satisfeito"}
                            {rating === 5 && "Muito satisfeito"}
                        </small>
                    </div>

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