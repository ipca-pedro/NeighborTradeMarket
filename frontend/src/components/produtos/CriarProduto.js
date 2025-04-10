import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const CriarProduto = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({
        Titulo: '',
        Descricao: '',
        Preco: '',
        CategoriaID: '',
        Condicao: 'novo',
        TipoItemID_TipoItem: '1' // 1 para produto, 2 para serviço
    });
    const [imagens, setImagens] = useState([]);
    const [imagemPreview, setImagemPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Carregar categorias ao montar o componente
        const fetchCategorias = async () => {
            try {
                const response = await api.get('/categorias');
                setCategorias(response.data);
            } catch (err) {
                console.error('Erro ao carregar categorias:', err);
            }
        };

        fetchCategorias();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImagemChange = (e) => {
        const files = Array.from(e.target.files);
        setImagens(files);
        
        // Criar previews das imagens
        const previews = files.map(file => URL.createObjectURL(file));
        setImagemPreview(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!currentUser) {
            setError('É necessário estar autenticado para criar um anúncio');
            setLoading(false);
            return;
        }

        try {
            const formDataObj = new FormData();
            
            // Adicionar dados do produto
            Object.keys(formData).forEach(key => {
                formDataObj.append(key, formData[key]);
            });

            // Adicionar imagens
            imagens.forEach(imagem => {
                formDataObj.append('imagens[]', imagem);
            });

            // Adicionar ID do utilizador
            formDataObj.append('UtilizadorID_User', currentUser.ID_User);

            await api.post('/anuncios', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setSuccess('Anúncio criado com sucesso! Aguardando aprovação.');
            
            // Limpar formulário
            setFormData({
                Titulo: '',
                Descricao: '',
                Preco: '',
                CategoriaID: '',
                Condicao: 'novo',
                TipoItemID_TipoItem: '1'
            });
            setImagens([]);
            setImagemPreview([]);
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                navigate('/anuncios');
            }, 2000);
        } catch (err) {
            console.error('Erro completo:', err);
            setError(err.response?.data?.message || 'Erro ao criar anúncio. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-primary text-white">
                                <h2 className="mb-0">Criar Novo Anúncio</h2>
                            </Card.Header>
                            <Card.Body>
                                {error && <Alert variant="danger">{error}</Alert>}
                                {success && <Alert variant="success">{success}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col md={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Título do Anúncio</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="Titulo"
                                                    value={formData.Titulo}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Ex: iPhone 13 Pro Max 256GB"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Categoria</Form.Label>
                                                <Form.Select
                                                    name="CategoriaID"
                                                    value={formData.CategoriaID}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Selecione uma categoria</option>
                                                    {categorias.map(categoria => (
                                                        <option key={categoria.ID_Categoria} value={categoria.ID_Categoria}>
                                                            {categoria.Nome}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tipo de Anúncio</Form.Label>
                                                <Form.Select
                                                    name="TipoItemID_TipoItem"
                                                    value={formData.TipoItemID_TipoItem}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="1">Produto</option>
                                                    <option value="2">Serviço</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Preço (€)</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    name="Preco"
                                                    value={formData.Preco}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="0.00"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Condição</Form.Label>
                                                <Form.Select
                                                    name="Condicao"
                                                    value={formData.Condicao}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="novo">Novo</option>
                                                    <option value="seminovo">Seminovo</option>
                                                    <option value="usado">Usado</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Descrição</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            name="Descricao"
                                            value={formData.Descricao}
                                            onChange={handleChange}
                                            required
                                            placeholder="Descreva o seu produto ou serviço com detalhes..."
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Imagens</Form.Label>
                                        <Form.Control
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImagemChange}
                                            required
                                            className="mb-3"
                                        />
                                        <Form.Text className="text-muted mb-3 d-block">
                                            Pode selecionar múltiplas imagens. A primeira será a imagem principal.
                                        </Form.Text>
                                        
                                        {imagemPreview.length > 0 && (
                                            <div className="image-preview-container d-flex flex-wrap">
                                                {imagemPreview.map((preview, index) => (
                                                    <div key={index} className="image-preview me-2 mb-2">
                                                        <img 
                                                            src={preview} 
                                                            alt={`Preview ${index}`} 
                                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                            className="rounded"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Form.Group>

                                    <div className="d-grid gap-2">
                                        <Button 
                                            variant="primary" 
                                            type="submit"
                                            disabled={loading}
                                            size="lg"
                                            style={{ backgroundColor: '#F97316', borderColor: '#F97316' }}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    A criar anúncio...
                                                </>
                                            ) : (
                                                <>Publicar Anúncio</>
                                            )}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default CriarProduto;
