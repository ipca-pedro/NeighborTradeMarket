import React, { useState, useEffect } from 'react';
import { Modal, Card, Alert, Spinner } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { buscarAvaliacoesVendedor } from '../../services/avaliacaoService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AvaliacoesVendedor = ({ vendedor }) => {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (vendedor?.ID_User) {
            console.log('Carregando avaliações para vendedor:', vendedor);
            carregarAvaliacoes();
        }
    }, [vendedor]);

    const carregarAvaliacoes = async () => {
        try {
            setLoading(true);
            console.log('Buscando avaliações para vendedor ID:', vendedor.ID_User);
            const data = await buscarAvaliacoesVendedor(vendedor.ID_User);
            console.log('Avaliações carregadas:', data);
            setAvaliacoes(data);
            setError(null);
        } catch (err) {
            console.error('Erro ao carregar avaliações:', err);
            setError('Erro ao carregar avaliações');
        } finally {
            setLoading(false);
        }
    };

    const calcularMediaAvaliacoes = () => {
        if (!avaliacoes || avaliacoes.length === 0) return 0;
        console.log('Calculando média das avaliações:', avaliacoes);
        const soma = avaliacoes.reduce((acc, aval) => {
            const valor = aval.nota?.valor;
            console.log('Valor da avaliação:', valor);
            return acc + (valor || 0);
        }, 0);
        const media = (soma / avaliacoes.length).toFixed(1);
        console.log('Média calculada:', media);
        return media;
    };

    const formatarData = (data) => {
        try {
            if (!data) return 'Data não disponível';
            const date = new Date(data);
            if (isNaN(date.getTime())) return 'Data inválida';
            return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    };

    const renderEstrelas = (quantidade) => {
        console.log('Renderizando estrelas para quantidade:', quantidade);
        return [...Array(5)].map((_, index) => (
            <FaStar
                key={index}
                className={index < quantidade ? 'text-warning' : 'text-muted'}
                style={{ fontSize: '1rem' }}
            />
        ));
    };

    if (loading) {
        return (
            <div className="text-center p-4">
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <div className="avaliacoes-vendedor">
            <div className="d-flex align-items-center mb-4">
                <h4 className="mb-0 me-3">Avaliações do Vendedor</h4>
                <div className="d-flex align-items-center">
                    <div className="me-2">
                        {renderEstrelas(Math.round(calcularMediaAvaliacoes()))}
                    </div>
                    <span className="fs-5">({calcularMediaAvaliacoes()})</span>
                </div>
            </div>

            {avaliacoes.length === 0 ? (
                <Alert variant="info">Este vendedor ainda não possui avaliações.</Alert>
            ) : (
                <div className="avaliacoes-list">
                    {avaliacoes.map((avaliacao) => (
                        <Card key={avaliacao.ID_Avaliacao} className="mb-3">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex align-items-center">
                                        <div className="me-2">{renderEstrelas(avaliacao.nota?.valor || 0)}</div>
                                        <span className="text-muted">({avaliacao.nota?.valor || 0})</span>
                                    </div>
                                    <small className="text-muted">
                                        {formatarData(avaliacao.Data)}
                                    </small>
                                </div>
                                <Card.Text>{avaliacao.Comentario}</Card.Text>
                                <div className="text-muted">
                                    <small>Por: {avaliacao.utilizador?.Nome || 'Utilizador não disponível'}</small>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvaliacoesVendedor; 