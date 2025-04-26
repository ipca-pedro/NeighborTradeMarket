import React, { useState, useEffect } from 'react';
import CompraService from '../../services/CompraService';
import { criarReclamacao } from '../../services/reclamacaoService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';
import AvaliacaoModal from '../avaliacao/AvaliacaoModal';

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

    useEffect(() => {
        carregarCompras();
    }, []);

    const carregarCompras = async () => {
        try {
            setLoading(true);
            const data = await CompraService.minhasCompras();
            setCompras(data);
            setError(null);
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
                                <h3>{compra.anuncio.Titulo}</h3>
                                <span className="status">{compra.status.Descricao}</span>
                            </div>
                            <div className="compra-info">
                                <p>
                                    <strong>Data:</strong>{' '}
                                    {format(new Date(compra.Data_compra), "dd 'de' MMMM 'de' yyyy", {
                                        locale: ptBR,
                                    })}
                                </p>
                                <p>
                                    <strong>Valor:</strong> R$ {compra.Valor.toFixed(2)}
                                </p>
                                {compra.Observacoes && (
                                    <p>
                                        <strong>Observações:</strong> {compra.Observacoes}
                                    </p>
                                )}
                            </div>
                            <div className="compra-actions">
                                {compra.StatusID_Status === 1 && ( // Status Pendente
                                    <button
                                        onClick={() => handleCancelarCompra(compra.ID_Compra)}
                                        className="btn-cancelar"
                                    >
                                        Cancelar Compra
                                    </button>
                                )}
                                {compra.StatusID_Status === 3 && ( // Status Enviado
                                    <button
                                        onClick={() => handleConfirmarRecebimento(compra.ID_Compra)}
                                        className="btn-confirmar"
                                    >
                                        Confirmar Recebimento
                                    </button>
                                )}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {compra.PodeReclamar && (
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

                                    {/* Botão de avaliação - apenas se não houver avaliação e compra estiver concluída */}
                                    {!compra.avaliacao && compra.StatusID_Status === 4 && (
                                        <button
                                            className="btn-avaliar"
                                            style={{ backgroundColor: '#ffc107', color: '#222', border: 'none', borderRadius: '4px', padding: '6px 12px', cursor: 'pointer' }}
                                            onClick={() => handleAbrirAvaliacao(compra)}
                                        >
                                            Avaliar Compra
                                        </button>
                                    )}

                                    {/* Mostrar nota se já existe avaliação */}
                                    {compra.avaliacao && (
                                        <span className="avaliacao-info" style={{ color: '#666', padding: '6px 12px' }}>
                                            <i className="fas fa-star" style={{ color: '#ffc107', marginRight: '4px' }}></i>
                                            Avaliado: {compra.avaliacao.nota?.Descricao_nota || 'N/A'}
                                        </span>
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