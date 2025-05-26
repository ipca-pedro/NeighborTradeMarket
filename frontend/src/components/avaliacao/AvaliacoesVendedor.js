import React, { useState, useEffect } from 'react';
import { Card, Alert, Spinner } from 'react-bootstrap';
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
            carregarAvaliacoes();
        }
    }, [vendedor]);

    const carregarAvaliacoes = async () => {
        try {
            setLoading(true);
            const data = await buscarAvaliacoesVendedor(vendedor.ID_User);
            setAvaliacoes(data);
        } catch (err) {
            setError('Erro ao carregar avaliações');
        } finally {
            setLoading(false);
        }
    };

    const renderEstrelas = (quantidade) => {
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
            {avaliacoes.length === 0 ? (
                <Alert variant="info">Este vendedor ainda não possui avaliações.</Alert>
            ) : (
                <div className="avaliacoes-list">
                    {avaliacoes.map((avaliacao) => (
                        <Card key={avaliacao.Id_Avaliacao} className="mb-3">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex align-items-center">
                                        <div className="me-2">{renderEstrelas(avaliacao.NotaID_Nota)}</div>
                                        <span className="text-muted">({avaliacao.NotaID_Nota})</span>
                                    </div>
                                    <small className="text-muted">
                                        {format(new Date(avaliacao.Data_Avaliacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                    </small>
                                </div>
                                <Card.Text>{avaliacao.Comentario}</Card.Text>
                                <div className="text-muted">
                                    <small>Por: {avaliacao.compra?.utilizador?.User_Name || 'Utilizador não disponível'}</small>
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