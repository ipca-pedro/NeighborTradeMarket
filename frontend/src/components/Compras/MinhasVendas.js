import React, { useState, useEffect } from 'react';
import CompraService from '../../services/CompraService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge, Spinner, Alert } from 'react-bootstrap';
import '../perfil/MinhasVendas.css';

const MinhasVendas = () => {
    const [vendas, setVendas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusOptions, setStatusOptions] = useState([]);
    const [isReservado, setIsReservado] = useState(false);

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

    const handleProcessarVenda = async (compraId) => {
        try {
            await CompraService.processarVenda(compraId);
            await carregarVendas();
            alert('Venda processada com sucesso!');
        } catch (err) {
            alert('Erro ao processar venda: ' + err.message);
        }
    };

    const handleMarcarEnviado = async (compraId) => {
        try {
            await CompraService.marcarEnviado(compraId);
            await carregarVendas();
            alert('Venda marcada como enviada com sucesso!');
        } catch (err) {
            alert('Erro ao marcar venda como enviada: ' + err.message);
        }
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

    return (
        <div className="minhas-vendas">
            <h2>Minhas Vendas</h2>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Carregando...</span>
                    </Spinner>
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <>
                    <div className="vendas-list">
                        {vendas.map((venda) => (
                            <div key={venda.ID_Compra} className="venda-card">
                                <div className="venda-header">
                                    <h3>{venda.anuncio?.Titulo || 'Produto não disponível'}</h3>
                                    {getStatusBadge(venda.StatusID_Status)}
                                </div>
                                <div className="venda-info">
                                    <p><strong>Comprador:</strong> {venda.comprador?.Name || 'N/A'}</p>
                                    <p><strong>Data da Venda:</strong> {format(new Date(venda.DataCompra), "dd 'de' MMMM 'de' yyyy", {
                                            locale: ptBR,
                                    })}</p>
                                    <p><strong>Valor:</strong> €{venda.ValorTotal?.toFixed(2) || '0.00'}</p>
                                </div>
                                <div className="venda-actions">
                                    {venda.StatusID_Status === 1 && !isReservado && (
                                        <button
                                            onClick={() => handleProcessarVenda(venda.ID_Compra)}
                                            className="btn-processar"
                                        >
                                            Processar Venda
                                        </button>
                                    )}
                                    {venda.StatusID_Status === 2 && !isReservado && (
                                    <button
                                            onClick={() => handleMarcarEnviado(venda.ID_Compra)}
                                            className="btn-enviar"
                                    >
                                            Marcar como Enviado
                                    </button>
                                    )}
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