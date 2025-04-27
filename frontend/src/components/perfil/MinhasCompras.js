import React, { useState, useEffect } from 'react';
import { Card, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { buscarMinhasCompras } from '../../services/CompraService';
import { criarReclamacao } from '../../services/reclamacaoService';
import { toast } from 'react-toastify';
import AvaliacaoModal from '../avaliacao/AvaliacaoModal';
import { FaStar } from 'react-icons/fa';
import { buscarAvaliacoesRecebidas } from '../../services/avaliacaoService';

const MinhasCompras = () => {
    const navigate = useNavigate();
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReclamacaoModal, setShowReclamacaoModal] = useState(false);
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [descricaoReclamacao, setDescricaoReclamacao] = useState('');
    const [submittingReclamacao, setSubmittingReclamacao] = useState(false);
    const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
    const [selectedCompraParaAvaliacao, setSelectedCompraParaAvaliacao] = useState(null);
    const [showAvaliacoesVendedorModal, setShowAvaliacoesVendedorModal] = useState(false);
    const [avaliacoesVendedor, setAvaliacoesVendedor] = useState([]);
    const [selectedVendedor, setSelectedVendedor] = useState(null);
    const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false);

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

    const handleAbrirAvaliacao = (compra) => {
        setSelectedCompraParaAvaliacao(compra);
        setShowAvaliacaoModal(true);
    };

    const handleAvaliacaoSuccess = async () => {
        await carregarCompras(); // Recarrega a lista de compras após avaliação
        toast.success('Avaliação enviada com sucesso!');
    };

    const handleVerAvaliacoesVendedor = async (vendedor) => {
        setSelectedVendedor(vendedor);
        setLoadingAvaliacoes(true);
        try {
            const avaliacoes = await buscarAvaliacoesRecebidas(vendedor.ID_User);
            setAvaliacoesVendedor(avaliacoes);
            setShowAvaliacoesVendedorModal(true);
        } catch (err) {
            toast.error('Erro ao carregar avaliações do vendedor');
        } finally {
            setLoadingAvaliacoes(false);
        }
    };

    const calcularMediaAvaliacoes = (avaliacoes) => {
        if (!avaliacoes || avaliacoes.length === 0) return 0;
        const soma = avaliacoes.reduce((acc, aval) => acc + aval.nota.valor, 0);
        return (soma / avaliacoes.length).toFixed(1);
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
                                        <strong>Vendedor:</strong> 
                                        <Button 
                                            variant="link" 
                                            className="p-0 ms-1"
                                            onClick={() => handleVerAvaliacoesVendedor(compra.anuncio?.utilizador)}
                                        >
                                            {compra.anuncio?.utilizador?.Nome || 'N/A'}
                                        </Button><br />
                                        <strong>Status:</strong> {compra.status?.Descricao_status_compra || 'N/A'}
                                    </Card.Text>
                                    
                                    <div className="mt-3">
                                            <Button 
                                                variant="danger" 
                                                onClick={() => handleAbrirReclamacao(compra)}
                                                className="me-2"
                                            disabled={compra.reclamacoes && compra.reclamacoes.length > 0}
                                            >
                                            {compra.reclamacoes && compra.reclamacoes.length > 0
                                                ? 'Já Reclamado'
                                                : 'Fazer Reclamação'
                                            }
                                            </Button>
                                        
                                            <Button 
                                            variant="success"
                                            onClick={() => handleAbrirAvaliacao(compra)}
                                            className="ms-2"
                                            disabled={compra.avaliacoes && compra.avaliacoes.length > 0}
                                        >
                                            {compra.avaliacoes && compra.avaliacoes.length > 0 ? 'Já Avaliado' : 'Avaliar'}
                                            </Button>
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

            <AvaliacaoModal
                show={showAvaliacaoModal}
                onHide={() => setShowAvaliacaoModal(false)}
                compraId={selectedCompraParaAvaliacao?.ID_Compra}
                onSuccess={handleAvaliacaoSuccess}
            />

            <Modal 
                show={showAvaliacoesVendedorModal} 
                onHide={() => setShowAvaliacoesVendedorModal(false)}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Avaliações de {selectedVendedor?.Nome}
                        {avaliacoesVendedor.length > 0 && (
                            <span className="ms-3">
                                <FaStar className="text-warning" /> {calcularMediaAvaliacoes(avaliacoesVendedor)}
                            </span>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingAvaliacoes ? (
                        <div className="text-center">
                            <Spinner animation="border" />
                        </div>
                    ) : avaliacoesVendedor.length === 0 ? (
                        <Alert variant="info">Este vendedor ainda não possui avaliações.</Alert>
                    ) : (
                        <div className="avaliacoes-list">
                            {avaliacoesVendedor.map((avaliacao) => (
                                <Card key={avaliacao.ID_Avaliacao} className="mb-3">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div>
                                                <strong>Nota: </strong>
                                                {[...Array(avaliacao.nota.valor)].map((_, i) => (
                                                    <FaStar key={i} className="text-warning" />
                                                ))}
                                            </div>
                                            <small className="text-muted">
                                                {formatarData(avaliacao.Data)}
                                            </small>
                                        </div>
                                        <Card.Text>{avaliacao.Comentario}</Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default MinhasCompras; 