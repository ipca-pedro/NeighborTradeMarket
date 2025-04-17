import React, { useState, useEffect } from 'react';
import CompraService from '../../services/CompraService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MinhasCompras = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        </div>
    );
};

export default MinhasCompras; 