import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { buscarTodasReclamacoes, atualizarStatus } from '../../services/reclamacaoService';
import { formatarData } from '../../utils/dataUtils';

const GestaoReclamacoes = () => {
    const [reclamacoes, setReclamacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [filtro, setFiltro] = useState('todas');

    useEffect(() => {
        carregarReclamacoes();
    }, []);

    const carregarReclamacoes = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await buscarTodasReclamacoes();
            console.log('Reclamações carregadas:', data);
            setReclamacoes(Array.isArray(data) ? data : []);
            setMessage('');
        } catch (err) {
            console.error('Erro ao carregar reclamações:', err);
            setError('Erro ao carregar reclamações. Por favor, tente novamente.');
            setReclamacoes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAtualizarStatus = async (reclamacaoId, novoStatus) => {
        try {
            await atualizarStatus(reclamacaoId, novoStatus);
            await carregarReclamacoes();
            setMessage('Status atualizado com sucesso!');
        } catch (err) {
            setError('Erro ao atualizar status da reclamação');
        }
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case 1: return 'warning';  // Pendente
            case 2: return 'info';     // Em análise
            case 3: return 'success';  // Resolvida
            case 4: return 'danger';   // Rejeitada
            default: return 'secondary';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 1: return 'Pendente';
            case 2: return 'Em Análise';
            case 3: return 'Resolvida';
            case 4: return 'Rejeitada';
            default: return 'Desconhecido';
        }
    };

    const reclamacoesFiltradas = reclamacoes.filter(reclamacao => {
        if (filtro === 'todas') return true;
        if (filtro === 'pendentes') return reclamacao.Status_ReclamacaoID_Status_Reclamacao === 1;
        if (filtro === 'analise') return reclamacao.Status_ReclamacaoID_Status_Reclamacao === 2;
        if (filtro === 'resolvidas') return reclamacao.Status_ReclamacaoID_Status_Reclamacao === 3;
        return true;
    });

    const renderDescricaoTooltip = (props, descricao) => (
        <Tooltip id="descricao-tooltip" {...props}>
            {descricao || 'Sem descrição'}
        </Tooltip>
    );

    return (
        <Container className="my-5">
            <Card className="shadow-sm mb-4">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Gestão de Reclamações</h2>
                    <div className="btn-group">
                        <Button
                            variant={filtro === 'todas' ? 'light' : 'outline-light'}
                            onClick={() => setFiltro('todas')}
                        >
                            Todas
                        </Button>
                        <Button
                            variant={filtro === 'pendentes' ? 'light' : 'outline-light'}
                            onClick={() => setFiltro('pendentes')}
                        >
                            Pendentes
                        </Button>
                        <Button
                            variant={filtro === 'analise' ? 'light' : 'outline-light'}
                            onClick={() => setFiltro('analise')}
                        >
                            Em Análise
                        </Button>
                        <Button
                            variant={filtro === 'resolvidas' ? 'light' : 'outline-light'}
                            onClick={() => setFiltro('resolvidas')}
                        >
                            Resolvidas
                        </Button>
                    </div>
                </Card.Header>
                <Card.Body>
                    {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                    {error && (
                        <Alert variant="danger" onClose={() => setError('')} dismissible>
                            {error}
                            <Button 
                                variant="outline-danger" 
                                size="sm" 
                                className="ms-3"
                                onClick={carregarReclamacoes}
                            >
                                Tentar Novamente
                            </Button>
                        </Alert>
                    )}

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                            <p className="mt-3">A carregar reclamações...</p>
                        </div>
                    ) : reclamacoesFiltradas.length === 0 ? (
                        <Alert variant="info">
                            Nenhuma reclamação encontrada para o filtro selecionado.
                        </Alert>
                    ) : (
                        <Table responsive hover className="align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Data</th>
                                    <th>Descrição</th>
                                    <th>Produto</th>
                                    <th>Comprador</th>
                                    <th>Vendedor</th>
                                    <th>Estado</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reclamacoesFiltradas.map(reclamacao => (
                                    <tr key={reclamacao.ID_Reclamacao}>
                                        <td>#{reclamacao.ID_Reclamacao}</td>
                                        <td>{formatarData(reclamacao.DataReclamacao)}</td>
                                        <td>
                                            <OverlayTrigger
                                                placement="top"
                                                delay={{ show: 250, hide: 400 }}
                                                overlay={(props) => renderDescricaoTooltip(props, reclamacao.Descricao)}
                                            >
                                                <span>
                                                    {reclamacao.Descricao?.substring(0, 30) + (reclamacao.Descricao?.length > 30 ? '...' : '') || 'N/A'}
                                                </span>
                                            </OverlayTrigger>
                                        </td>
                                        <td>{reclamacao.compras?.[0]?.anuncio?.Titulo || 'N/A'}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '30px', height: '30px' }}>
                                                    <span>{reclamacao.compras?.[0]?.utilizador?.Name?.charAt(0)?.toUpperCase() || '?'}</span>
                                                </div>
                                                <span>{reclamacao.compras?.[0]?.utilizador?.Name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '30px', height: '30px' }}>
                                                    <span>{reclamacao.compras?.[0]?.anuncio?.utilizador?.Name?.charAt(0)?.toUpperCase() || '?'}</span>
                                                </div>
                                                <span>{reclamacao.compras?.[0]?.anuncio?.utilizador?.Name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <Badge bg={getStatusBadgeVariant(reclamacao.Status_ReclamacaoID_Status_Reclamacao)}>
                                                {getStatusText(reclamacao.Status_ReclamacaoID_Status_Reclamacao)}
                                            </Badge>
                                        </td>
                                        <td>
                                            <div className="d-flex gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    href={`/admin/reclamacoes/${reclamacao.ID_Reclamacao}`}
                                                    title="Ver Detalhes"
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </Button>
                                                <div className="dropdown">
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        className="dropdown-toggle"
                                                        data-bs-toggle="dropdown"
                                                        title="Alterar Status"
                                                    >
                                                        <i className="fas fa-cog"></i>
                                                    </Button>
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <button 
                                                                className="dropdown-item" 
                                                                onClick={() => handleAtualizarStatus(reclamacao.ID_Reclamacao, 1)}
                                                                disabled={reclamacao.Status_ReclamacaoID_Status_Reclamacao === 1}
                                                            >
                                                                <i className="fas fa-clock text-warning me-2"></i>
                                                                Marcar como Pendente
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button 
                                                                className="dropdown-item" 
                                                                onClick={() => handleAtualizarStatus(reclamacao.ID_Reclamacao, 2)}
                                                                disabled={reclamacao.Status_ReclamacaoID_Status_Reclamacao === 2}
                                                            >
                                                                <i className="fas fa-search text-info me-2"></i>
                                                                Em Análise
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button 
                                                                className="dropdown-item" 
                                                                onClick={() => handleAtualizarStatus(reclamacao.ID_Reclamacao, 3)}
                                                                disabled={reclamacao.Status_ReclamacaoID_Status_Reclamacao === 3}
                                                            >
                                                                <i className="fas fa-check text-success me-2"></i>
                                                                Resolver
                                                            </button>
                                                        </li>
                                                        <li>
                                                            <button 
                                                                className="dropdown-item text-danger" 
                                                                onClick={() => handleAtualizarStatus(reclamacao.ID_Reclamacao, 4)}
                                                                disabled={reclamacao.Status_ReclamacaoID_Status_Reclamacao === 4}
                                                            >
                                                                <i className="fas fa-times me-2"></i>
                                                                Rejeitar
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default GestaoReclamacoes; 