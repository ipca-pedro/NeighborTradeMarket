import React, { useState, useEffect, useMemo } from 'react';
import { Container, Table, Button, Badge, Spinner, Alert, Card, OverlayTrigger, Tooltip, Row, Col, Form, InputGroup, FormControl, Dropdown } from 'react-bootstrap';
import { buscarTodasReclamacoes, atualizarStatus } from '../../services/reclamacaoService';
import { formatarData } from '../../utils/dataUtils';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const GestaoReclamacoes = () => {
    const [reclamacoes, setReclamacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const [filtro, setFiltro] = useState('todas');
    const [searchTerm, setSearchTerm] = useState('');

    // Status options for filtering and display
    const statusOptions = [
        { id: 'todas', name: 'Todas' },
        { id: 'pendentes', name: 'Pendentes', statusId: 1 },
        { id: 'analise', name: 'Em Análise', statusId: 2 },
        { id: 'resolvidas', name: 'Resolvidas', statusId: 3 },
        { id: 'rejeitadas', name: 'Rejeitadas', statusId: 4 }
    ];

    useEffect(() => {
        carregarReclamacoes();
    }, []);

    const carregarReclamacoes = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await buscarTodasReclamacoes();
            console.log('Reclamações carregadas:', response);
            
            // Verificar se temos dados na resposta
            if (response && response.reclamacoes) {
                setReclamacoes(Array.isArray(response.reclamacoes) ? response.reclamacoes : []);
            } else {
                setReclamacoes(Array.isArray(response) ? response : []);
            }
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
            setMessage(''); // Limpar mensagens anteriores
            await atualizarStatus(reclamacaoId, novoStatus);
            await carregarReclamacoes();
            setMessage('Status atualizado com sucesso!');
            // Auto-dismiss message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError('Erro ao atualizar status da reclamação: ' + (err.message || 'Tente novamente.'));
            setTimeout(() => setError(''), 5000);
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

    // Filtrar reclamações com base no filtro selecionado e termo de pesquisa
    const reclamacoesFiltradas = useMemo(() => {
        return reclamacoes.filter(reclamacao => {
            // Aplicar filtro de status
            let matchesFiltro = true;
            if (filtro !== 'todas') {
                const statusId = statusOptions.find(opt => opt.id === filtro)?.statusId;
                matchesFiltro = reclamacao.Status_ReclamacaoID_Status_Reclamacao === statusId;
            }
            
            // Aplicar termo de pesquisa
            const searchMatch = searchTerm === '' || 
                (reclamacao.Descricao && reclamacao.Descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (reclamacao.compras && reclamacao.compras[0]?.anuncio?.Titulo?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (reclamacao.compras && reclamacao.compras[0]?.utilizador?.Name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (reclamacao.compras && reclamacao.compras[0]?.anuncio?.utilizador?.Name?.toLowerCase().includes(searchTerm.toLowerCase()));
                
            return matchesFiltro && searchMatch;
        });
    }, [reclamacoes, filtro, searchTerm]);

    const renderDescricaoTooltip = (props, descricao) => (
        <Tooltip id="descricao-tooltip" {...props}>
            {descricao || 'Sem descrição'}
        </Tooltip>
    );

    const limparFiltros = () => {
        setFiltro('todas');
        setSearchTerm('');
    }

    return (
        <>
            <Header />
            <Container fluid className="px-4 my-5">
                <Card className="shadow-sm mb-4">
                    <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                        <h2 className="mb-0">Gestão de Reclamações</h2>
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

                        {/* Filtros e Pesquisa */}
                        <Row className="mb-3 gx-2">
                            <Col md={6}>
                                <InputGroup>
                                    <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
                                    <FormControl
                                        placeholder="Pesquisar por descrição, produto, comprador ou vendedor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={5}>
                                <div className="d-flex">
                                    {statusOptions.map(option => (
                                        <Button
                                            key={option.id}
                                            variant={filtro === option.id ? 'primary' : 'outline-primary'}
                                            className="me-1"
                                            onClick={() => setFiltro(option.id)}
                                        >
                                            {option.name}
                                        </Button>
                                    ))}
                                </div>
                            </Col>
                            <Col md={1} className="d-flex align-items-center">
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={limparFiltros} 
                                    title="Limpar Filtros"
                                    disabled={filtro === 'todas' && searchTerm === ''}
                                >
                                    <i className="fas fa-times"></i>
                                </Button>
                            </Col>
                        </Row>

                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-3">A carregar reclamações...</p>
                            </div>
                        ) : reclamacoesFiltradas.length === 0 ? (
                            <Alert variant="info">
                                {searchTerm || filtro !== 'todas' 
                                    ? 'Nenhuma reclamação encontrada para os filtros selecionados.' 
                                    : 'Não há reclamações registradas no sistema.'}
                            </Alert>
                        ) : (
                            <>
                                <div className="mb-2 text-muted small">
                                    A mostrar {reclamacoesFiltradas.length} de {reclamacoes.length} reclamações
                                </div>
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
                                                        <Dropdown>
                                                            <Dropdown.Toggle 
                                                                variant="outline-secondary" 
                                                                size="sm"
                                                                id={`dropdown-status-${reclamacao.ID_Reclamacao}`}
                                                            >
                                                                <i className="fas fa-cog"></i>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item 
                                                                    onClick={() => handleAtualizarStatus(reclamacao.ID_Reclamacao, 1)}
                                                                    disabled={reclamacao.Status_ReclamacaoID_Status_Reclamacao === 1}
                                                                >
                                                                    <i className="fas fa-clock text-warning me-2"></i>
                                                                    Marcar como Pendente
                                                                </Dropdown.Item>
                                                                <Dropdown.Item 
                                                                    onClick={() => handleAtualizarStatus(reclamacao.ID_Reclamacao, 2)}
                                                                    disabled={reclamacao.Status_ReclamacaoID_Status_Reclamacao === 2}
                                                                >
                                                                    <i className="fas fa-search text-info me-2"></i>
                                                                    Em Análise
                                                                </Dropdown.Item>
                                                                <Dropdown.Item 
                                                                    onClick={() => handleAtualizarStatus(reclamacao.ID_Reclamacao, 3)}
                                                                    disabled={reclamacao.Status_ReclamacaoID_Status_Reclamacao === 3}
                                                                >
                                                                    <i className="fas fa-check text-success me-2"></i>
                                                                    Resolver
                                                                </Dropdown.Item>
                                                                <Dropdown.Divider />
                                                                <Dropdown.Item 
                                                                    onClick={() => handleAtualizarStatus(reclamacao.ID_Reclamacao, 4)}
                                                                    disabled={reclamacao.Status_ReclamacaoID_Status_Reclamacao === 4}
                                                                    className="text-danger"
                                                                >
                                                                    <i className="fas fa-times me-2"></i>
                                                                    Rejeitar
                                                                </Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </>
                        )}
                    </Card.Body>
                </Card>
            </Container>
            <Footer />
        </>
    );
};

export default GestaoReclamacoes; 