import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import api from '../../services/api';

const ProdutosPendentes = () => {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        carregarProdutos();
    }, []);

    const carregarProdutos = async () => {
        try {
            const response = await api.getProdutosPendentes();
            setProdutos(response.data);
        } catch (err) {
            setError('Erro ao carregar produtos pendentes');
        } finally {
            setLoading(false);
        }
    };

    const handleAprovar = async (id) => {
        try {
            await api.aprovarProduto(id);
            setMessage('Produto aprovado com sucesso!');
            setProdutos(produtos.filter(p => p.id !== id));
        } catch (err) {
            setError('Erro ao aprovar produto');
        }
    };

    const handleRejeitar = async (id) => {
        try {
            await api.rejeitarProduto(id);
            setMessage('Produto rejeitado com sucesso!');
            setProdutos(produtos.filter(p => p.id !== id));
        } catch (err) {
            setError('Erro ao rejeitar produto');
        }
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Produtos Pendentes</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            {message && <Alert variant="success">{message}</Alert>}

            {produtos.length === 0 ? (
                <Alert variant="info">Não há produtos pendentes de aprovação.</Alert>
            ) : (
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Vendedor</th>
                            <th>Preço</th>
                            <th>Categoria</th>
                            <th>Condição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map(produto => (
                            <tr key={produto.id}>
                                <td>{produto.Nome}</td>
                                <td>{produto.vendedor.Name}</td>
                                <td>R$ {produto.Preco.toFixed(2)}</td>
                                <td>{produto.Categoria}</td>
                                <td>{produto.Condicao}</td>
                                <td>
                                    <Button
                                        variant="success"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleAprovar(produto.id)}
                                    >
                                        Aprovar
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleRejeitar(produto.id)}
                                    >
                                        Rejeitar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default ProdutosPendentes;
