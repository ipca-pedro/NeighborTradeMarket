import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { anuncioService } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const CriarProduto = () => {
    const navigate = useNavigate();
    const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [tiposItem, setTiposItem] = useState([]);
    const [formData, setFormData] = useState({
        Titulo: '',
        Descricao: '',
        Preco: '',
        CategoriaID_Categoria: '',
        Tipo_ItemID_Tipo: '1' // 1 para produto, 2 para serviço
    });
    const [imagens, setImagens] = useState([]);
    const [imagemPreview, setImagemPreview] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Carregar categorias e tipos de item ao montar o componente
        const fetchData = async () => {
            try {
                // Carregar categorias
                console.log('Tentando carregar categorias...');
                const categorias = await anuncioService.getCategories();
                setCategorias(categorias);
                console.log('Categorias carregadas:', categorias);
                
                // Carregar tipos de item
                console.log('Tentando carregar tipos de item...');
                const tipos = await anuncioService.getItemTypes();
                setTiposItem(tipos);
                console.log('Tipos de item carregados:', tipos);
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                console.error('Detalhes do erro:', err.response?.data || err.message);
                setError(`Erro ao carregar dados: ${err.response?.data?.message || err.message}`);
            }
        };

        fetchData();
    }, []);
    
    // Redirecionar para a página de login se o usuário não estiver autenticado
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: '/criar-anuncio', message: 'É necessário fazer login para criar um anúncio' }} />;
    }

    // Se o usuário está autenticado mas não tem currentUser, tentar obter novamente
    if (isAuthenticated && !currentUser) {
        return <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">A carregar...</span>
            </div>
        </div>;
    }

    // Se o usuário não tem ID, mostrar erro
    if (currentUser && !currentUser.ID_User) {
        return <div className="text-center py-5">
            <h3 className="text-danger">Erro de Autenticação</h3>
            <p className="text-muted">Não foi possível obter o ID do usuário. Por favor, faça logout e login novamente.</p>
            <Button variant="primary" onClick={() => navigate('/logout')}>
                Fazer Logout
            </Button>
        </div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Tratamento especial para o campo Preco
        if (name === 'Preco') {
            // Permitir entrada vazia ou parcial durante a digitação
            if (value === '' || value === '.' || value === ',') {
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
                return;
            }
            
            // Substituir vírgula por ponto (formato europeu para decimal)
            let processedValue = value.replace(',', '.');
            
            // Verificar se é um número válido
            if (isNaN(parseFloat(processedValue))) {
                return; // Não atualiza se não for um número válido
            }
            
            // Garantir que o valor não exceda 9999.99
            const numValue = parseFloat(processedValue);
            if (numValue > 9999.99) {
                return; // Não atualiza o estado se o valor for maior que o permitido
            }
            
            // Manter o valor como string para preservar zeros no final
            // Apenas formatar se o usuário terminou de digitar (contém um ponto e já tem dígitos após o ponto)
            if (processedValue.includes('.') && processedValue.split('.')[1].length > 0) {
                // Limitar a 2 casas decimais mas manter como string
                const parts = processedValue.split('.');
                if (parts[1].length > 2) {
                    processedValue = `${parts[0]}.${parts[1].substring(0, 2)}`;
                }
            }
            
            setFormData(prev => ({
                ...prev,
                [name]: processedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
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

        // Validar e formatar dados
        const preco = parseFloat(formData.Preco);
        if (isNaN(preco) || preco <= 0 || preco > 9999.99) {
            setError('Por favor, insira um preço válido (entre 0.01 e 9999.99)');
            setLoading(false);
            return;
        }

        // Validar título
        const titulo = formData.Titulo?.trim();
        if (!titulo || titulo.length > 100) {
            setError('Por favor, insira um título válido (máximo 100 caracteres)');
            setLoading(false);
            return;
        }

        // Validar descrição
        const descricao = formData.Descricao?.trim();
        if (!descricao) {
            setError('Por favor, insira uma descrição para o anúncio');
            setLoading(false);
            return;
        }

        // Validar categoria e tipo
        const categoriaId = parseInt(formData.CategoriaID_Categoria);
        const tipoId = parseInt(formData.Tipo_ItemID_Tipo);
        if (isNaN(categoriaId) || isNaN(tipoId)) {
            setError('Por favor, selecione uma categoria e um tipo válidos');
            setLoading(false);
            return;
        }

        try {
            const formDataObj = new FormData();
            
            // Debug: Verificar o ID do Utilizador
            console.log('currentUser:', currentUser);
            console.log('currentUser.ID_User:', currentUser.ID_User);
            console.log('typeof currentUser.ID_User:', typeof currentUser.ID_User);
            
            // Adicionar dados do produto
            formDataObj.append('Titulo', titulo);
            formDataObj.append('Descricao', descricao);
            formDataObj.append('Preco', preco.toFixed(2)); // Enviar como string com 2 casas decimais
            formDataObj.append('CategoriaID_Categoria', categoriaId);
            formDataObj.append('Tipo_ItemID_Tipo', tipoId);
            
            // Garantir que o ID do usuário seja um número
            const userId = parseInt(currentUser.ID_User);
            console.log('userId após parseInt:', userId);
            
            if (isNaN(userId)) {
                throw new Error('ID do usuário inválido');
            }
            
            formDataObj.append('UtilizadorID_User', userId);
            formDataObj.append('Status_AnuncioID_Status_Anuncio', 1); // 1 para status pendente

            // Adicionar imagens
            imagens.forEach((imagem, index) => {
                if (imagem) {
                    formDataObj.append(`imagens[${index}]`, imagem);
                }
            });

            await anuncioService.criarAnuncio(formDataObj);

            setSuccess('Anúncio criado com sucesso! Aguardando aprovação.');
            
            // Limpar formulário
            setFormData({
                Titulo: '',
                Descricao: '',
                Preco: '',
                CategoriaID_Categoria: '',
                Tipo_ItemID_Tipo: '1'
            });
            setImagens([]);
            setImagemPreview([]);
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                navigate('/anuncios');
            }, 2000);
        } catch (err) {
            console.error('Erro ao criar anúncio:', err);
            
            // Mostrar erros específicos do backend
            if (err.response?.data?.errors) {
                let errorMessage = 'Erro ao criar anúncio:\n';
                Object.entries(err.response.data.errors).forEach(([field, messages]) => {
                    errorMessage += `-${field}: ${messages.join(', ')}\n`;
                });
                setError(errorMessage);
            } else {
                setError(err.response?.data?.message || 'Erro ao criar anúncio. Por favor, tente novamente.');
            }
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
                                            <Form.Group className="mb-4">
                                                <Form.Label>Categoria</Form.Label>
                                                <Form.Select 
                                                    name="CategoriaID_Categoria" 
                                                    value={formData.CategoriaID_Categoria}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Selecione uma categoria</option>
                                                    {categorias.map(categoria => (
                                                        <option key={categoria.ID_Categoria} value={categoria.ID_Categoria}>
                                                            {categoria.Descricao_Categoria}
                                                        </option>
                                                    ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-4">
                                                <Form.Label>Tipo</Form.Label>
                                                <Form.Select 
                                                    name="Tipo_ItemID_Tipo" 
                                                    value={formData.Tipo_ItemID_Tipo}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Selecione um tipo</option>
                                                    {tiposItem.map(tipo => (
                                                        <option key={tipo.ID_Tipo} value={tipo.ID_Tipo}>
                                                            {tipo.Descricao_TipoItem}
                                                        </option>
                                                    ))}
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
                                                    max="9999.99"
                                                    name="Preco"
                                                    value={formData.Preco}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="0.00"
                                                />
                                                <Form.Text className="text-muted">
                                                    Valor máximo permitido: 9999.99€
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
        
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
                                            className="mb-3"
                                        />
                                        <Form.Text className="text-muted mb-3 d-block">
                                            Pode selecionar múltiplas imagens (opcional). A primeira será a imagem principal.
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
        </>
    );
};

export default CriarProduto;
