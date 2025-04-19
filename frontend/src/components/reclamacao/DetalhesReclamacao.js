import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { buscarMinhasReclamacoes, atualizarStatus } from '../../services/reclamacaoService';
import ChatReclamacao from './ChatReclamacao';

const DetalhesReclamacao = () => {
    const { id } = useParams();
    const [reclamacao, setReclamacao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const carregarReclamacao = async () => {
            try {
                setLoading(true);
                const reclamacoes = await buscarMinhasReclamacoes();
                const reclamacaoEncontrada = reclamacoes.find(r => r.ID_Reclamacao === parseInt(id));
                
                if (!reclamacaoEncontrada) {
                    throw new Error('Reclamação não encontrada');
                }

                setReclamacao(reclamacaoEncontrada);
                
                // Determinar o tipo de usuário
                const user = JSON.parse(localStorage.getItem('user'));
                if (user.TipoUserID_TipoUser === 1) {
                    setUserType('admin');
                } else if (reclamacaoEncontrada.Compra.UtilizadorID_User === user.ID_User) {
                    setUserType('comprador');
                } else if (reclamacaoEncontrada.Compra.Anuncio.UtilizadorID_User === user.ID_User) {
                    setUserType('vendedor');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        carregarReclamacao();
    }, [id]);

    const handleAtualizarStatus = async (novoStatus) => {
        try {
            await atualizarStatus(id, novoStatus);
            setReclamacao(prev => ({
                ...prev,
                Status_ReclamacaoID_Status_Reclamacao: novoStatus
            }));
        } catch (err) {
            setError('Erro ao atualizar status');
            console.error(err);
        }
    };

    if (loading) return <div className="text-center">Carregando...</div>;
    if (error) return <div className="text-red-500">{error}</div>;
    if (!reclamacao) return <div>Reclamação não encontrada</div>;

    return (
        <div className="container mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-4">Detalhes da Reclamação</h1>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Informações da Compra</h2>
                            <p><span className="font-medium">Anúncio:</span> {reclamacao.Compra.Anuncio.Titulo}</p>
                            <p><span className="font-medium">Data da Compra:</span> {new Date(reclamacao.Compra.Data).toLocaleDateString()}</p>
                            <p><span className="font-medium">Vendedor:</span> {reclamacao.Compra.Anuncio.Utilizador.Name}</p>
                        </div>
                        
                        <div>
                            <h2 className="text-lg font-semibold mb-2">Status da Reclamação</h2>
                            <p className="mb-2">
                                <span className="font-medium">Status Atual:</span>{' '}
                                <span className={`px-2 py-1 rounded ${
                                    reclamacao.Status_ReclamacaoID_Status_Reclamacao === 1 ? 'bg-yellow-100 text-yellow-800' :
                                    reclamacao.Status_ReclamacaoID_Status_Reclamacao === 2 ? 'bg-blue-100 text-blue-800' :
                                    reclamacao.Status_ReclamacaoID_Status_Reclamacao === 3 ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                                }`}>
                                    {reclamacao.Status_Reclamacao.Descricao_status_reclamacao}
                                </span>
                            </p>
                            
                            {userType === 'admin' && (
                                <div className="mt-4">
                                    <h3 className="font-medium mb-2">Atualizar Status:</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleAtualizarStatus(2)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Em Análise
                                        </button>
                                        <button
                                            onClick={() => handleAtualizarStatus(3)}
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Resolvida
                                        </button>
                                        <button
                                            onClick={() => handleAtualizarStatus(4)}
                                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                                        >
                                            Fechada
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Descrição Inicial</h2>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p>{reclamacao.Descricao}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            Data: {new Date(reclamacao.DataReclamacao).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Chat da Reclamação</h2>
                    <ChatReclamacao reclamacaoId={id} userType={userType} />
                </div>
            </div>
        </div>
    );
};

export default DetalhesReclamacao; 