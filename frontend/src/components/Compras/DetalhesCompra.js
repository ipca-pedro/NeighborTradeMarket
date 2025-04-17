import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CompraService from '../../services/CompraService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DetalhesCompra = () => {
    const { id } = useParams();
    const [compra, setCompra] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusOptions, setStatusOptions] = useState([]);

    useEffect(() => {
        carregarDetalhes();
        carregarStatusOptions();
    }, [id]);

    const carregarDetalhes = async () => {
        try {
            setLoading(true);
            const data = await CompraService.detalhesCompra(id);
            setCompra(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar detalhes da compra: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const carregarStatusOptions = async () => {
        try {
            const options = await CompraService.getStatusOptions();
            setStatusOptions(options);
        } catch (err) {
            console.error('Erro ao carregar opções de status:', err);
        }
    };

    const handleAtualizarStatus = async (novoStatus) => {
        try {
            await CompraService.atualizarStatus(id, novoStatus);
            await carregarDetalhes();
            alert('Status atualizado com sucesso!');
        } catch (err) {
            alert('Erro ao atualizar status: ' + err.message);
        }
    };

    const handleCancelarCompra = async () => {
        if (window.confirm('Tem certeza que deseja cancelar esta compra?')) {
            try {
                await CompraService.cancelarCompra(id);
                await carregarDetalhes();
                alert('Compra cancelada com sucesso!');
            } catch (err) {
                alert('Erro ao cancelar compra: ' + err.message);
            }
        }
    };

    const handleConfirmarRecebimento = async () => {
        if (window.confirm('Confirmar o recebimento deste item?')) {
            try {
                await CompraService.confirmarRecebimento(id);
                await carregarDetalhes();
                alert('Recebimento confirmado com sucesso!');
            } catch (err) {
                alert('Erro ao confirmar recebimento: ' + err.message);
            }
        }
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!compra) return <div>Compra não encontrada</div>;

    const isVendedor = compra.anuncio.UtilizadorID_User === compra.UtilizadorID_User;
    const isComprador = !isVendedor;

    return (
        <div className="detalhes-compra">
            <h2>Detalhes da Compra</h2>
            <div className="compra-container">
                <div className="anuncio-info">
                    <h3>{compra.anuncio.Titulo}</h3>
                    <p className="status">{compra.status.Descricao}</p>
                    <div className="info-grid">
                        <div>
                            <strong>Data da Compra:</strong>
                            <p>
                                {format(new Date(compra.Data_compra), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                                    locale: ptBR,
                                })}
                            </p>
                        </div>
                        <div>
                            <strong>Valor:</strong>
                            <p>R$ {compra.Valor.toFixed(2)}</p>
                        </div>
                        <div>
                            <strong>{isVendedor ? 'Comprador' : 'Vendedor'}:</strong>
                            <p>{isVendedor ? compra.comprador.Nome : compra.anuncio.utilizador.Nome}</p>
                        </div>
                        {compra.Observacoes && (
                            <div>
                                <strong>Observações:</strong>
                                <p>{compra.Observacoes}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="acoes">
                    {isVendedor && compra.StatusID_Status !== 4 && compra.StatusID_Status !== 5 && (
                        <div className="atualizar-status">
                            <h4>Atualizar Status</h4>
                            <select
                                value={compra.StatusID_Status}
                                onChange={(e) => handleAtualizarStatus(e.target.value)}
                            >
                                {statusOptions.map((status) => (
                                    <option key={status.ID_Status} value={status.ID_Status}>
                                        {status.Descricao}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {isComprador && (
                        <div className="acoes-comprador">
                            {compra.StatusID_Status === 1 && (
                                <button
                                    onClick={handleCancelarCompra}
                                    className="btn-cancelar"
                                >
                                    Cancelar Compra
                                </button>
                            )}
                            {compra.StatusID_Status === 3 && (
                                <button
                                    onClick={handleConfirmarRecebimento}
                                    className="btn-confirmar"
                                >
                                    Confirmar Recebimento
                                </button>
                            )}
                        </div>
                    )}

                    <button
                        onClick={() => window.history.back()}
                        className="btn-voltar"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetalhesCompra; 