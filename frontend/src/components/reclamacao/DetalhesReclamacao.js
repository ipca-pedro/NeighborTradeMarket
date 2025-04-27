import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { buscarMinhasReclamacoes } from '../../services/reclamacaoService';
import Header from '../layout/Header';
import './DetalhesReclamacao.css';

const DetalhesReclamacao = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reclamacao, setReclamacao] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        carregarReclamacao();
    }, [id]);

    if (loading) {
        return (
            <>
                <Header />
                <Container className="py-4">
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-3">Carregando detalhes da reclamação...</p>
                    </div>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <Container className="py-4">
                    <Alert variant="danger">
                        <Alert.Heading>Erro ao carregar detalhes</Alert.Heading>
                        <p>{error}</p>
                    </Alert>
                </Container>
            </>
        );
    }

    if (!reclamacao) {
        return (
            <>
                <Header />
                <Container className="py-4">
                    <Alert variant="warning">
                        <Alert.Heading>Reclamação não encontrada</Alert.Heading>
                        <p>A reclamação solicitada não foi encontrada.</p>
                    </Alert>
                </Container>
            </>
        );
    }

    const compra = reclamacao.compras[0];

    return (
        <>
            <Header />
            <Container className="py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4>Detalhes da Reclamação</h4>
                    <Button variant="outline-primary" onClick={() => navigate('/perfil/reclamacoes')}>
                        Voltar
                    </Button>
                </div>

                <div className="reclamacao-card">
                    <div className="reclamacao-header">
                        <h5>Reclamação #{reclamacao.ID_Reclamacao}</h5>
                        <Badge 
                            bg={reclamacao.Status_ReclamacaoID_Status_Reclamacao === 3 ? 'success' : 
                                reclamacao.Status_ReclamacaoID_Status_Reclamacao === 4 ? 'danger' : 'warning'}
                            className="status-badge"
                        >
                            {reclamacao.Status_ReclamacaoID_Status_Reclamacao === 3 ? "Aceite" :
                             reclamacao.Status_ReclamacaoID_Status_Reclamacao === 4 ? "Rejeitada" : "Pendente"}
                        </Badge>
                    </div>

                    <div className="reclamacao-info">
                        <div className="info-section">
                            <div className="info-label">Anúncio</div>
                            <div className="info-value">{compra.anuncio.Titulo}</div>
                        </div>
                        <div className="info-section">
                            <div className="info-label">Data da Reclamação</div>
                            <div className="info-value">
                                {new Date(reclamacao.DataReclamacao).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="info-section">
                            <div className="info-label">Vendedor</div>
                            <div className="info-value">{compra.anuncio.utilizador.Name}</div>
                        </div>
                    </div>

                    <div className="reclamacao-descricao">
                        <h6>Descrição do Problema</h6>
                        <p>{reclamacao.Descricao}</p>
                    </div>

                    {reclamacao.Status_ReclamacaoID_Status_Reclamacao === 3 && (
                        <Alert variant="success" className="mt-3">
                            <Alert.Heading>Reclamação Aceite</Alert.Heading>
                            <p>
                                Sua reclamação foi aceite pela administração. O anúncio foi inativado.
                            </p>
                        </Alert>
                    )}

                    {reclamacao.Status_ReclamacaoID_Status_Reclamacao === 4 && (
                        <Alert variant="danger" className="mt-3">
                            <Alert.Heading>Reclamação Rejeitada</Alert.Heading>
                            <p>
                                Sua reclamação foi rejeitada pela administração.
                            </p>
                        </Alert>
                    )}
                </div>
            </Container>
        </>
    );
};

export default DetalhesReclamacao; 