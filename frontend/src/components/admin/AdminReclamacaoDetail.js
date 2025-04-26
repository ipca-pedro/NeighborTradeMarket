import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Row, Col, Badge, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { buscarReclamacaoPorId, atualizarStatus, buscarMensagens, enviarMensagem } from '../../services/reclamacaoService';
import { formatarData } from '../../utils/dataUtils';
import Header from '../layout/Header';

const AdminReclamacaoDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reclamacao, setReclamacao] = useState(null);
    const [mensagens, setMensagens] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [acaoConfirmacao, setAcaoConfirmacao] = useState({ tipo: '', status: null });

    useEffect(() => {
        carregarDados();
    }, [id]);

    const carregarDados = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Carregar a reclamação e as mensagens em paralelo
            const [reclamacaoData, mensagensData] = await Promise.all([
                buscarReclamacaoPorId(id),
                buscarMensagens(id)
            ]);
            
            setReclamacao(reclamacaoData);
            setMensagens(mensagensData.mensagens || []);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            setError('Erro ao carregar os dados da reclamação. Por favor, tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleEnviarMensagem = async (e) => {
        e.preventDefault();
        if (!novaMensagem.trim()) return;

        try {
            await enviarMensagem(id, novaMensagem);
            // Recarregar as mensagens após enviar
            const mensagensData = await buscarMensagens(id);
            setMensagens(mensagensData.mensagens || []);
            setNovaMensagem('');
            setSuccess('Mensagem enviada com sucesso!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError('Erro ao enviar mensagem: ' + err.message);
        }
    };

    const confirmacaoStatus = (tipo, status) => {
        setAcaoConfirmacao({ tipo, status });
        setShowConfirmModal(true);
    };

    const handleAtualizarStatus = async () => {
        try {
            setShowConfirmModal(false);
            setLoading(true);
            
            const { status } = acaoConfirmacao;
            const response = await atualizarStatus(id, status);
            
            // Atualizar o estado do reclamacao com a resposta
            setReclamacao(prev => ({
                ...prev,
                Status_ReclamacaoID_Status_Reclamacao: status
            }));
            
            setSuccess(`Status atualizado com sucesso! ${response.processamento}`);
            
            // Recarregar dados após atualização
            await carregarDados();
        } catch (err) {
            setError('Erro ao atualizar status: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 1: return <Badge bg="warning">Pendente</Badge>;
            case 2: return <Badge bg="info">Em Análise</Badge>;
            case 3: return <Badge bg="success">Aceita/Resolvida</Badge>;
            case 4: return <Badge bg="danger">Rejeitada</Badge>;
            default: return <Badge bg="secondary">Desconhecido</Badge>;
        }
    };

    if (loading && !reclamacao) {
        return (
            <>
                <Header />
                <Container className="my-5 text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Carregando detalhes da reclamação...</p>
                </Container>
            </>
        );
    }

    if (error && !reclamacao) {
        return (
            <>
                <Header />
                <Container className="my-5">
                    <Alert variant="danger">
                        {error}
                        <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="ms-3"
                            onClick={carregarDados}
                        >
                            Tentar Novamente
                        </Button>
                    </Alert>
                </Container>
            </>
        );
    }

    if (!reclamacao) {
        return (
            <>
                <Header />
                <Container className="my-5">
                    <Alert variant="warning">
                        Reclamação não encontrada
                        <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="ms-3"
                            onClick={() => navigate('/admin/reclamacoes')}
                        >
                            Voltar para Lista
                        </Button>
                    </Alert>
                </Container>
            </>
        );
    }

    const podeTomar = reclamacao.Status_ReclamacaoID_Status_Reclamacao !== 3 && 
                     reclamacao.Status_ReclamacaoID_Status_Reclamacao !== 4;

    return (
        <>
            <Header />
            <Container className="my-5">
                {success && <Alert variant="success" dismissible onClose={() => setSuccess(null)}>{success}</Alert>}
                {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}
                
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                        <h2 className="mb-0">Reclamação #{reclamacao.ID_Reclamacao}</h2>
                        <Button 
                            variant="outline-light" 
                            size="sm"
                            onClick={() => navigate('/admin/reclamacoes')}
                        >
                            Voltar para Lista
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        <Row className="mb-4">
                            <Col md={6}>
                                <h5>Informações da Reclamação</h5>
                                <p><strong>Data:</strong> {formatarData(reclamacao.DataReclamacao)}</p>
                                <p><strong>Status:</strong> {getStatusBadge(reclamacao.Status_ReclamacaoID_Status_Reclamacao)}</p>
                                <p><strong>Descrição:</strong> {reclamacao.Descricao}</p>
                            </Col>
                            <Col md={6}>
                                <h5>Compra Relacionada</h5>
                                <p><strong>Produto:</strong> {reclamacao.compras?.[0]?.anuncio?.Titulo || 'N/A'}</p>
                                <p><strong>Comprador:</strong> {reclamacao.compras?.[0]?.utilizador?.Name || 'N/A'}</p>
                                <p><strong>Vendedor:</strong> {reclamacao.compras?.[0]?.anuncio?.utilizador?.Name || 'N/A'}</p>
                            </Col>
                        </Row>
                        
                        {podeTomar && (
                            <div className="mb-4 p-3 bg-light border rounded">
                                <h5 className="mb-3">Tomar Decisão</h5>
                                <p className="text-muted">Como administrador, você pode aceitar ou rejeitar esta reclamação:</p>
                                <div className="d-flex gap-2">
                                    <Button 
                                        variant="success" 
                                        onClick={() => confirmacaoStatus('aceitar', 3)}
                                    >
                                        <i className="fas fa-check me-2"></i>
                                        Aceitar Reclamação
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={() => confirmacaoStatus('rejeitar', 4)}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Rejeitar Reclamação
                                    </Button>
                                    <Button 
                                        variant="info" 
                                        onClick={() => confirmacaoStatus('análise', 2)}
                                    >
                                        <i className="fas fa-search me-2"></i>
                                        Marcar Em Análise
                                    </Button>
                                </div>
                                <p className="mt-2 small text-muted">
                                    <i className="fas fa-info-circle me-1"></i>
                                    Aceitar a reclamação marcará a compra como problemática. Esta ação não pode ser desfeita.
                                </p>
                            </div>
                        )}
                        
                        <h5 className="mb-3">Histórico de Mensagens</h5>
                        <div className="chat-container border rounded p-3 mb-4" style={{maxHeight: '400px', overflowY: 'auto'}}>
                            {mensagens.length === 0 ? (
                                <p className="text-center text-muted my-5">Nenhuma mensagem trocada ainda.</p>
                            ) : (
                                mensagens.map((msg, index) => (
                                    <div key={index} className="mb-3">
                                        <div className={`p-3 rounded ${msg.usuario === 'admin' ? 'bg-light text-dark ms-auto' : msg.usuario === 'comprador' ? 'bg-primary text-white' : 'bg-success text-white'}`} style={{maxWidth: '80%'}}>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <small className="fw-bold">{
                                                    msg.usuario === 'admin' ? 'Administrador' : 
                                                    msg.usuario === 'comprador' ? 'Comprador' : 'Vendedor'
                                                }</small>
                                                <small>{new Date(msg.data).toLocaleString()}</small>
                                            </div>
                                            <div>{msg.mensagem}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <form onSubmit={handleEnviarMensagem}>
                            <div className="mb-3">
                                <label htmlFor="novaMensagem" className="form-label">Enviar Mensagem</label>
                                <textarea 
                                    id="novaMensagem"
                                    className="form-control" 
                                    rows="3" 
                                    value={novaMensagem}
                                    onChange={(e) => setNovaMensagem(e.target.value)}
                                    placeholder="Digite sua mensagem aqui..."
                                ></textarea>
                            </div>
                            <Button type="submit" variant="primary">
                                <i className="fas fa-paper-plane me-2"></i>
                                Enviar Mensagem
                            </Button>
                        </form>
                    </Card.Body>
                </Card>
            </Container>
            
            {/* Modal de confirmação */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Ação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {acaoConfirmacao.tipo === 'aceitar' && (
                        <>
                            <p>Você está prestes a <strong>aceitar</strong> esta reclamação.</p>
                            <p>Isso marcará a compra como problemática e notificará o comprador e o vendedor.</p>
                            <p className="text-danger">Esta ação não pode ser desfeita!</p>
                        </>
                    )}
                    {acaoConfirmacao.tipo === 'rejeitar' && (
                        <>
                            <p>Você está prestes a <strong>rejeitar</strong> esta reclamação.</p>
                            <p>A compra continuará válida e ambas as partes serão notificadas.</p>
                            <p className="text-danger">Esta ação não pode ser desfeita!</p>
                        </>
                    )}
                    {acaoConfirmacao.tipo === 'análise' && (
                        <>
                            <p>Você está prestes a marcar esta reclamação como <strong>Em Análise</strong>.</p>
                            <p>As partes envolvidas serão notificadas que você está analisando o caso.</p>
                        </>
                    )}
                    <p>Tem certeza que deseja continuar?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant={
                            acaoConfirmacao.tipo === 'aceitar' ? 'success' : 
                            acaoConfirmacao.tipo === 'rejeitar' ? 'danger' : 'info'
                        } 
                        onClick={handleAtualizarStatus}
                    >
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AdminReclamacaoDetail; 