import React, { useState, useEffect, useRef } from 'react';
import { buscarMensagens, enviarMensagem, buscarParticipantes } from '../../services/reclamacaoService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ChatReclamacao = ({ reclamacaoId, userType }) => {
    const [mensagens, setMensagens] = useState([]);
    const [novaMensagem, setNovaMensagem] = useState('');
    const [participantes, setParticipantes] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    // Carregar mensagens e participantes
    useEffect(() => {
        const carregarDados = async () => {
            try {
                setLoading(true);
                const [mensagensData, participantesData] = await Promise.all([
                    buscarMensagens(reclamacaoId),
                    buscarParticipantes(reclamacaoId)
                ]);
                // Extract messages from the response
                setMensagens(mensagensData.mensagens || []);
                setParticipantes(participantesData);
            } catch (err) {
                setError('Erro ao carregar mensagens');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        carregarDados();
        // Atualizar mensagens a cada 30 segundos
        const interval = setInterval(carregarDados, 30000);
        return () => clearInterval(interval);
    }, [reclamacaoId]);

    // Scroll para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensagens]);

    const handleEnviarMensagem = async (e) => {
        e.preventDefault();
        if (!novaMensagem.trim()) return;

        try {
            const mensagemEnviada = await enviarMensagem(reclamacaoId, novaMensagem, userType);
            setMensagens([...mensagens, mensagemEnviada]);
            setNovaMensagem('');
        } catch (err) {
            setError('Erro ao enviar mensagem');
            console.error(err);
        }
    };

    const getTipoUsuarioLabel = (tipo) => {
        switch (tipo) {
            case 'comprador':
                return 'Comprador';
            case 'vendedor':
                return 'Vendedor';
            case 'admin':
                return 'Administrador';
            default:
                return tipo;
        }
    };

    if (loading) return <div className="text-center">Carregando mensagens...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
            {/* Cabeçalho do chat */}
            <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Chat da Reclamação</h3>
                <p className="text-sm text-gray-500">
                    Participantes: {Object.values(participantes).map(p => p.nome).join(', ')}
                </p>
            </div>

            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mensagens.map((mensagem, index) => (
                    <div
                        key={index}
                        className={`flex ${
                            mensagem.usuario === userType ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                                mensagem.usuario === userType
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            <div className="font-semibold">
                                {getTipoUsuarioLabel(mensagem.usuario)}
                            </div>
                            <div className="text-sm">
                                {format(new Date(mensagem.data), 'dd/MM/yyyy HH:mm', {
                                    locale: ptBR,
                                })}
                            </div>
                            <div className="mt-1">{mensagem.mensagem}</div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Área de envio de mensagem */}
            <form onSubmit={handleEnviarMensagem} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={novaMensagem}
                        onChange={(e) => setNovaMensagem(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Enviar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatReclamacao; 