import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import trocaService from '../../services/trocaService';
import { toast } from 'react-toastify';

const PropostasTroca = () => {
    const [propostasRecebidas, setPropostasRecebidas] = useState([]);
    const [propostasEnviadas, setPropostasEnviadas] = useState([]);
    const [showRejeitarModal, setShowRejeitarModal] = useState(false);
    const [selectedTrocaId, setSelectedTrocaId] = useState(null);
    const [motivoRejeicao, setMotivoRejeicao] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        carregarPropostas();
    }, []);

    const carregarPropostas = async () => {
        try {
            setLoading(true);
            const [recebidas, enviadas] = await Promise.all([
                trocaService.getPropostasRecebidas(),
                trocaService.getPropostasEnviadas()
            ]);
            setPropostasRecebidas(recebidas.data);
            setPropostasEnviadas(enviadas.data);
        } catch (error) {
            toast.error('Erro ao carregar propostas de troca');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAceitar = async (trocaId) => {
        try {
            await trocaService.aceitarTroca(trocaId);
            toast.success('Proposta de troca aceita com sucesso!');
            carregarPropostas();
        } catch (error) {
            toast.error('Erro ao aceitar proposta de troca');
            console.error(error);
        }
    };

    const handleRejeitar = async () => {
        try {
            await trocaService.rejeitarTroca(selectedTrocaId, motivoRejeicao);
            toast.success('Proposta de troca rejeitada com sucesso!');
            setShowRejeitarModal(false);
            setMotivoRejeicao('');
            carregarPropostas();
        } catch (error) {
            toast.error('Erro ao rejeitar proposta de troca');
            console.error(error);
        }
    };

    const handleCancelar = async (trocaId) => {
        try {
            await trocaService.cancelarTroca(trocaId);
            toast.success('Proposta de troca cancelada com sucesso!');
            carregarPropostas();
        } catch (error) {
            toast.error('Erro ao cancelar proposta de troca');
            console.error(error);
        }
    };

    const abrirModalRejeitar = (trocaId) => {
        setSelectedTrocaId(trocaId);
        setShowRejeitarModal(true);
    };

    return (
        <Container className="mt-4">
            <h2>Propostas de Troca</h2>
            
            <h3 className="mt-4">Propostas Recebidas</h3>
            <Row>
                {propostasRecebidas.map((proposta) => (
                    <Col md={4} key={proposta.id} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>Troca Proposta</Card.Title>
                                <Card.Text>
                                    <strong>Anúncio Desejado:</strong> {proposta.anuncio_desejado.titulo}<br/>
                                    <strong>Em troca de:</strong> {proposta.meu_anuncio.titulo}<br/>
                                    <strong>Proposto por:</strong> {proposta.usuario_proponente.nome}<br/>
                                    <strong>Status:</strong> {proposta.status}
                                </Card.Text>
                                {proposta.status === 'PENDENTE' && (
                                    <div className="d-flex gap-2">
                                        <Button variant="success" onClick={() => handleAceitar(proposta.id)}>
                                            Aceitar
                                        </Button>
                                        <Button variant="danger" onClick={() => abrirModalRejeitar(proposta.id)}>
                                            Rejeitar
                                        </Button>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <h3 className="mt-4">Propostas Enviadas</h3>
            <Row>
                {propostasEnviadas.map((proposta) => (
                    <Col md={4} key={proposta.id} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Title>Troca Proposta</Card.Title>
                                <Card.Text>
                                    <strong>Anúncio Desejado:</strong> {proposta.anuncio_desejado.titulo}<br/>
                                    <strong>Oferecendo:</strong> {proposta.meu_anuncio.titulo}<br/>
                                    <strong>Status:</strong> {proposta.status}
                                    {proposta.motivo_rejeicao && (
                                        <><br/><strong>Motivo da rejeição:</strong> {proposta.motivo_rejeicao}</>
                                    )}
                                </Card.Text>
                                {proposta.status === 'PENDENTE' && (
                                    <Button variant="danger" onClick={() => handleCancelar(proposta.id)}>
                                        Cancelar Proposta
                                    </Button>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showRejeitarModal} onHide={() => setShowRejeitarModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Rejeitar Proposta de Troca</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Motivo da Rejeição</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={motivoRejeicao}
                                onChange={(e) => setMotivoRejeicao(e.target.value)}
                                placeholder="Explique o motivo da rejeição..."
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowRejeitarModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleRejeitar}>
                        Confirmar Rejeição
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default PropostasTroca; 