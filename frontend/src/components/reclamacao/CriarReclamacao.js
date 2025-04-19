import React, { useState } from 'react';
import { criarReclamacao } from '../../services/reclamacaoService';
import { toast } from 'react-toastify';

const CriarReclamacao = ({ compraId, onSuccess, onCancel }) => {
    const [descricao, setDescricao] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!descricao.trim()) {
            toast.error('Por favor, descreva o problema');
            return;
        }

        setLoading(true);
        try {
            await criarReclamacao(compraId, descricao);
            toast.success('Reclamação criada com sucesso!');
            onSuccess();
        } catch (error) {
            console.error('Erro ao criar reclamação:', error);
            toast.error(error.message || 'Erro ao criar reclamação');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Criar Reclamação</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Descrição do Problema
                            </label>
                            <textarea
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                placeholder="Descreva detalhadamente o problema..."
                                required
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'Enviar Reclamação'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CriarReclamacao; 