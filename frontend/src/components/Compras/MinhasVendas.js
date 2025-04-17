import React, { useState, useEffect } from 'react';
import CompraService from '../../services/CompraService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MinhasVendas = () => {
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusOptions, setStatusOptions] = useState([]);

    useEffect(() => {
        carregarVendas();
        carregarStatusOptions();
    }, [currentPage]);

    const carregarVendas = async () => {
        try {
            setLoading(true);
            const response = await CompraService.minhasVendas(currentPage);
            setVendas(response.data);
            setTotalPages(response.last_page);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar vendas: ' + err.message);
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

    const handleAtualizarStatus = async (compraId, novoStatus) => {
        try {
            await CompraService.atualizarStatus(compraId, novoStatus);
            await carregarVendas();
            alert('Status atualizado com sucesso!');
        } catch (err) {
            alert('Erro ao atualizar status: ' + err.message);
        }
    };

    const renderPaginacao = () => {
        return (
            <div className="paginacao">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span>
                    Página {currentPage} de {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Próxima
                </button>
            </div>
        );
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="minhas-vendas">
            <h2>Minhas Vendas</h2>
            {vendas.length === 0 ? (
                <p>Você ainda não tem nenhuma venda.</p>
            ) : (
                <>
                    <div className="vendas-list">
                        {vendas.map((venda) => (
                            <div key={venda.ID_Compra} className="venda-card">
                                <div className="venda-header">
                                    <h3>{venda.anuncio.Titulo}</h3>
                                    <span className="status">{venda.status.Descricao}</span>
                                </div>
                                <div className="venda-info">
                                    <p>
                                        <strong>Comprador:</strong> {venda.comprador.Nome}
                                    </p>
                                    <p>
                                        <strong>Data:</strong>{' '}
                                        {format(new Date(venda.Data_compra), "dd 'de' MMMM 'de' yyyy", {
                                            locale: ptBR,
                                        })}
                                    </p>
                                    <p>
                                        <strong>Valor:</strong> R$ {venda.Valor.toFixed(2)}
                                    </p>
                                </div>
                                <div className="venda-actions">
                                    <select
                                        value={venda.StatusID_Status}
                                        onChange={(e) => handleAtualizarStatus(venda.ID_Compra, e.target.value)}
                                        disabled={venda.StatusID_Status === 4 || venda.StatusID_Status === 5} // Concluído ou Cancelado
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status.ID_Status} value={status.ID_Status}>
                                                {status.Descricao}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => window.location.href = `/compras/${venda.ID_Compra}`}
                                        className="btn-detalhes"
                                    >
                                        Ver Detalhes
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {renderPaginacao()}
                </>
            )}
        </div>
    );
};

export default MinhasVendas; 