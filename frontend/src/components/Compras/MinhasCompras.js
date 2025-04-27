import React, { useState, useEffect } from 'react';
import CompraService from '../../services/CompraService';
import { criarReclamacao } from '../../services/reclamacaoService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';
import AvaliacaoModal from '../avaliacao/AvaliacaoModal';
import { Badge, Spinner, Alert } from 'react-bootstrap';

const MinhasCompras = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCompra, setSelectedCompra] = useState(null);
    const [showReclamacaoModal, setShowReclamacaoModal] = useState(false);
    const [descricaoReclamacao, setDescricaoReclamacao] = useState('');
    const [submittingReclamacao, setSubmittingReclamacao] = useState(false);
    const [showAvaliacaoModal, setShowAvaliacaoModal] = useState(false);
    const [selectedCompraParaAvaliacao, setSelectedCompraParaAvaliacao] = useState(null);
    const [isReservado, setIsReservado] = useState(false);

    useEffect(() => {
        carregarCompras();
    }, []);

    const carregarCompras = async () => {
        try {
            setLoading(true);
            const data = await CompraService.minhasCompras();
            setCompras(data);
            setError(null);
            setIsReservado(data.some(compra => compra.StatusID_Status === 8));
        } catch (err) {
            setError('Erro ao carregar compras: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelarCompra = async (compraId) => {
        if (window.confirm('Tem certeza que deseja cancelar esta compra?')) {
            try {
                await CompraService.cancelarCompra(compraId);
                await carregarCompras(); // Recarrega a lista
                alert('Compra cancelada com sucesso!');
            } catch (err) {
                alert('Erro ao cancelar compra: ' + err.message);
            }
        }
    };

    const handleConfirmarRecebimento = async (compraId) => {
        if (window.confirm('Confirmar o recebimento deste item?')) {
            try {
                await CompraService.confirmarRecebimento(compraId);
                await carregarCompras(); // Recarrega a lista
                alert('Recebimento confirmado com sucesso!');
            } catch (err) {
                alert('Erro ao confirmar recebimento: ' + err.message);
            }
        }
    };

    const handleSubmitReclamacao = async (compraId, descricao) => {
        try {
            // Verificar se o usuário está autenticado
            const token = localStorage.getItem('token');
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            
            if (!token || !user.ID_User) {
                alert('Por favor, faça login para criar uma reclamação.');
                return;
            }

            console.log('Iniciando criação de reclamação:', {
                compraId,
                descricao,
                user: user.ID_User
            });

            const response = await criarReclamacao({
                compraId,
                descricao
            });

            alert('Reclamação criada com sucesso!');
            await carregarCompras(); // Recarrega a lista
        } catch (err) {
            console.error('Erro ao criar reclamação:', err);
            alert(err.message || 'Erro ao criar reclamação. Por favor, tente novamente.');
        }
    };

    const handleAbrirAvaliacao = (compra) => {
        // Verificar se a compra está em estado válido para avaliação
        if (compra.StatusID_Status !== 4) {
            toast.error('Só é possível avaliar compras concluídas');
            return;
        }

        // Verificar se já existe avaliação
        if (compra.avaliacao) {
            toast.info('Esta compra já foi avaliada');
            return;
        }

        setSelectedCompraParaAvaliacao(compra);
        setShowAvaliacaoModal(true);
    };

    const handleAvaliacaoSuccess = async () => {
        await carregarCompras(); // Recarrega a lista de compras após avaliação
        toast.success('Avaliação enviada com sucesso!');
    };

    const getStatusBadge = (statusId) => {
        switch (statusId) {
            case 1:
                return <Badge bg="warning" text="dark">Pendente</Badge>;
            case 2:
                return <Badge bg="success">Em Processamento</Badge>;
            case 3:
                return <Badge bg="info">Enviado</Badge>;
            case 4:
                return <Badge bg="success">Concluído</Badge>;
            case 5:
                return <Badge bg="danger">Cancelado</Badge>;
            case 8:
                return <Badge bg="warning" text="dark">Reservado</Badge>;
            default:
                return <Badge bg="secondary">Desconhecido</Badge>;
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="minhas-compras">
            <h2>Minhas Compras</h2>
            {compras.length === 0 ? (
                <p>Você ainda não realizou nenhuma compra.</p>
            ) : (
                <div className="compras-list">
                    {compras.map((compra) => (
                        <div key={compra.ID_Compra} className="compra-card">
                            <div className="compra-header">
                                <h3>{compra.anuncio?.Titulo || 'Produto não disponível'}</h3>
                                {getStatusBadge(compra.StatusID_Status)}
                            </div>
                            <div className="compra-info">
                                <p><strong>Vendedor:</strong> {compra.anuncio?.utilizador?.Name || 'N/A'}</p>
                                <p><strong>Data da Compra:</strong> {format(new Date(compra.Data_compra), "dd 'de' MMMM 'de' yyyy", {
                                    locale: ptBR,
                                })}</p>
                                <p><strong>Valor:</strong> R$ {compra.Valor.toFixed(2)}</p>
                            </div>
                            <div className="compra-actions">
                                {compra.StatusID_Status === 1 && !isReservado && (
                                    <button
                                        onClick={() => handleCancelarCompra(compra.ID_Compra)}
                                        className="btn-cancelar"
                                    >
                                        Cancelar Compra
                                    </button>
                                )}
                                {compra.StatusID_Status === 3 && !isReservado && (
                                    <button
                                        onClick={() => handleConfirmarRecebimento(compra.ID_Compra)}
                                        className="btn-confirmar"
                                    >
                                        Confirmar Recebimento
                                    </button>
                                )}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {compra.PodeReclamar && !isReservado && (
                                        <button
                                            className="btn-reclamacao"
                                            onClick={() => {
                                                const descricao = prompt('Descreva o motivo da reclamação:');
                                                if (descricao) handleSubmitReclamacao(compra.ID_Compra, descricao);
                                            }}
                                        >
                                            Fazer Reclamação
                                        </button>
                                    )}

                                    {!compra.avaliacao && compra.StatusID_Status === 4 && !isReservado && (
                                        <button
                                            className="btn-avaliar"
                                            style={{ backgroundColor: '#ffc107', color: '#222', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}
                                            onClick={() => handleAbrirAvaliacao(compra)}
                                        >
                                            Avaliar Compra
                                        </button>
                                    )}
                                </div>
                                
                                <button
                                    onClick={() => window.location.href = `/compras/${compra.ID_Compra}`}
                                    className="btn-detalhes"
                                >
                                    Ver Detalhes
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Avaliação */}
            <AvaliacaoModal
                show={showAvaliacaoModal}
                onHide={() => {
                    setShowAvaliacaoModal(false);
                    setSelectedCompraParaAvaliacao(null);
                }}
                compraId={selectedCompraParaAvaliacao?.ID_Compra}
                onSuccess={handleAvaliacaoSuccess}
            />
        </div>
    );
};

export default MinhasCompras;