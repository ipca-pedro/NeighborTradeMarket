import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { buscarMinhasCompras } from '../../services/CompraService';
import { criarReclamacao } from '../../services/reclamacaoService';
import { toast } from 'react-toastify';

const MinhasCompras = () => {
    const navigate = useNavigate();
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReclamacaoModal, setShowReclamacaoModal] = useState(false);
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [descricaoReclamacao, setDescricaoReclamacao] = useState('');
    const [submittingReclamacao, setSubmittingReclamacao] = useState(false);

    useEffect(() => {
        carregarCompras();
    }, []);

    const carregarCompras = async () => {
        try {
            setLoading(true);
            const data = await buscarMinhasCompras();
            setCompras(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar compras: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAbrirReclamacao = (compra) => {
        setSelectedCompra(compra);
        setShowReclamacaoModal(true);
    };

    const handleSubmitReclamacao = async (e) => {
        e.preventDefault();
        if (!descricaoReclamacao.trim()) {
            toast.error('Por favor, descreva o problema');
            return;
        }

        setSubmittingReclamacao(true);
        try {
            await criarReclamacao({
                compraId: selectedCompra.ID_Compra,
                descricao: descricaoReclamacao
            });
            
            setShowReclamacaoModal(false);
            setDescricaoReclamacao('');
            setSelectedCompra(null);
            toast.success('Reclamação enviada com sucesso! Um administrador irá analisar seu caso.');
            
            // Recarregar a lista de compras
            await carregarCompras();
            
        } catch (err) {
            toast.error(err.message || 'Erro ao criar reclamação');
        } finally {
            setSubmittingReclamacao(false);
        }
    };

    const formatarData = (dataString) => {
        try {
            const data = new Date(dataString);
            return data.toLocaleDateString('pt-BR');
        } catch (error) {
            return 'Data inválida';
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Minhas Compras</h2>
            
            {compras.length === 0 ? (
                <Alert variant="info">Você ainda não realizou nenhuma compra.</Alert>
            ) : (
                <div className="row">
                    {compras.map((compra) => (
                        <div key={compra.ID_Compra} className="col-12 mb-3">
                            <Card>
                                <Card.Body>
                                    <Card.Title>Compra #{compra.ID_Compra}</Card.Title>
                                    <Card.Text>
                                        <strong>Título:</strong> {compra.anuncio?.Titulo || 'N/A'}<br />
                                        <strong>Data:</strong> {formatarData(compra.Data_compra)}<br />
                                        <strong>Valor:</strong> €{compra.anuncio?.Preco?.toFixed(2) || '0.00'}<br />
                                        <strong>Vendedor:</strong> {compra.anuncio?.utilizador?.Nome || 'N/A'}<br />
                                        <strong>Status:</strong> {compra.status?.Descricao_status_compra || 'N/A'}
                                    </Card.Text>
                                    
                                    <div className="mt-3">
                                        {!(compra.Reclamacao || compra.reclamacao || (compra.reclamacoes && compra.reclamacoes.length > 0)) && (
                                            <Button 
                                                variant="danger" 
                                                onClick={() => handleAbrirReclamacao(compra)}
                                                className="me-2"
                                            >
                                                Fazer Reclamação
                                            </Button>
                                        )}
                                        
                                        {(compra.Reclamacao || compra.reclamacao || (compra.reclamacoes && compra.reclamacoes.length > 0)) && (
                                            <Button 
                                                variant="primary"
                                                onClick={() => navigate(`/reclamacoes/${(compra.Reclamacao?.ID_Reclamacao || compra.reclamacao?.ID_Reclamacao || compra.reclamacoes?.[0]?.ID_Reclamacao)}`)}
                                            >
                                                Ver Reclamação
                                            </Button>
                                        )}
                                    </div>
                                </Card.Body>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            <Modal show={showReclamacaoModal} onHide={() => setShowReclamacaoModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Fazer Reclamação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitReclamacao}>
                        <Form.Group>
                            <Form.Label>Descreva o problema:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={descricaoReclamacao}
                                onChange={(e) => setDescricaoReclamacao(e.target.value)}
                                placeholder="Descreva detalhadamente o problema que você está enfrentando..."
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={() => setShowReclamacaoModal(false)}
                        disabled={submittingReclamacao}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleSubmitReclamacao}
                        disabled={submittingReclamacao}
                    >
                        {submittingReclamacao ? 'Enviando...' : 'Enviar Reclamação'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MinhasCompras; 