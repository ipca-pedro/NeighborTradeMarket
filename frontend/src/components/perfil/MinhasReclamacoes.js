import React, { useState, useEffect } from 'react';
import { Container, Badge, Alert, Table, Button } from 'react-bootstrap';
import { buscarMinhasReclamacoes } from '../../services/reclamacaoService';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import './MinhasReclamacoes.css';

const MinhasReclamacoes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isStandalone = location.pathname === '/minhas-reclamacoes';
    const [reclamacoes, setReclamacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const styles = {
        tableContainer: {
            margin: '20px 0',
            padding: '0 20px'
        },
        table: {
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        badge: {
            padding: '8px 12px',
            fontSize: '0.9em'
        },
        actionButton: {
            marginRight: '8px'
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('pt-BR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    useEffect(() => {
        const fetchReclamacoes = async () => {
            try {
                const response = await buscarMinhasReclamacoes();
                // Ensure we always have an array, even if empty
                setReclamacoes(Array.isArray(response) ? response : []);
                setLoading(false);
            } catch (err) {
                console.error('Erro ao carregar reclamações:', err);
                setError('Erro ao carregar reclamações');
                setLoading(false);
            }
        };

        fetchReclamacoes();
    }, []);

    if (loading) {
        return (
            <>
                {isStandalone && <Header />}
                <Container className={isStandalone ? "py-4" : ""}>
                    <div>Carregando...</div>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                {isStandalone && <Header />}
                <Container className={isStandalone ? "py-4" : ""}>
                    <Alert variant="danger">{error}</Alert>
                </Container>
            </>
        );
    }

    return (
        <>
            {isStandalone && <Header />}
            <Container className={isStandalone ? "py-4" : ""}>
                <div className="reclamacoes-simples">
                    <h4 className="mb-4">Minhas Reclamações</h4>
                    
                    {reclamacoes.length === 0 ? (
                        <Alert variant="info">
                            Você ainda não possui reclamações.
                        </Alert>
                    ) : (
                        <div style={styles.tableContainer}>
                            <Table hover style={styles.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Data</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reclamacoes.map((reclamacao) => (
                                        <tr key={reclamacao.ID_Reclamacao}>
                                            <td>{reclamacao.ID_Reclamacao}</td>
                                            <td>{formatDate(reclamacao.DataReclamacao)}</td>
                                            <td>
                                                <Badge 
                                                    bg={reclamacao.Status_ReclamacaoID_Status_Reclamacao === 3 ? 'success' : 
                                                        reclamacao.Status_ReclamacaoID_Status_Reclamacao === 4 ? 'danger' : 'warning'}
                                                    style={styles.badge}
                                                >
                                                    {reclamacao.Status_ReclamacaoID_Status_Reclamacao === 3 ? 'Aceite' :
                                                     reclamacao.Status_ReclamacaoID_Status_Reclamacao === 4 ? 'Rejeitada' : 'Pendente'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    style={styles.actionButton}
                                                    onClick={() => navigate(`/reclamacoes/${reclamacao.ID_Reclamacao}`)}
                                                >
                                                    Ver Detalhes
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

export default MinhasReclamacoes; 