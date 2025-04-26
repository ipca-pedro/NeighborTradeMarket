import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { anuncioService } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const CriarProduto = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Obter o ID do anúncio se estiver editando
    const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [tiposItem, setTiposItem] = useState([]);
    
    const [formData, setFormData] = useState({
        Titulo: '',
        Descricao: '',
        Preco: '',
        CategoriaID_Categoria: '',
        Tipo_ItemID_Tipo: '1'
    });
    
    const [imagens, setImagens] = useState([]);
    const [imagemPreview, setImagemPreview] = useState([]);
    const [imagensExistentes, setImagensExistentes] = useState([]);
    const [imagensRemovidas, setImagensRemovidas] = useState([]);

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            try {
                // Carregar categorias e tipos de item
                const categoriasData = await anuncioService.getCategorias();
                const tiposItemData = await anuncioService.getTiposItem();
                
                setCategorias(categoriasData);
                setTiposItem(tiposItemData);
                
                // Verificar se está em modo de edição
                if (id) {
                    setIsEditMode(true);
                    
                    // Carregar dados do anúncio
                    const anuncio = await anuncioService.getAnuncio(id);
                    console.log("Anúncio carregado:", anuncio);
                    
                    // Preencher o formulário com os dados do anúncio
                    setFormData({
                        Titulo: anuncio.Titulo || '',
                        Descricao: anuncio.Descricao || '',
                        Preco: anuncio.Preco || '',
                        CategoriaID_Categoria: anuncio.CategoriaID_Categoria || '',
                        Tipo_ItemID_Tipo: anuncio.Tipo_ItemID_Tipo || '1'
                    });
                    
                    // Carregar imagens existentes
                    if (anuncio.imagens && anuncio.imagens.length > 0) {
                        setImagensExistentes(anuncio.imagens);
                    } else if (anuncio.item_imagems && anuncio.item_imagems.length > 0) {
                        // Lidar com o caso onde as imagens estão em item_imagems
                        setImagensExistentes(anuncio.item_imagems.map(item => item.imagem));
                    }
                }
            } catch (err) {
                console.error('Erro ao carregar dados:', err);
                setError('Erro ao carregar dados. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        };
        
        carregarDados();
    }, [id]);
    
    // Redirecionar para a página de login se o usuário não estiver autenticado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { 
                replace: true, 
                state: { 
                    from: '/criar-anuncio', 
                    message: 'É necessário fazer login para criar um anúncio' 
                } 
            });
        }
    }, [isAuthenticated, navigate]);
    
    // Se está redirecionando, mostrar um spinner
    if (!isAuthenticated) {
        return <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Redirecionando para login...</span>
            </div>
        </div>;
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

    const handleRemoveImage = (index, isExistingImage = false) => {
        if (isExistingImage) {
            // Remover imagem existente
            const imagemRemovida = imagensExistentes[index];
            console.log("Tentando remover imagem existente:", imagemRemovida);
            
            if (imagemRemovida && imagemRemovida.ID_Imagem) {
                // Guardar o ID da imagem para remover no servidor
                setImagensRemovidas(prev => [...prev, imagemRemovida.ID_Imagem]);
                console.log("ID da imagem removida:", imagemRemovida.ID_Imagem);
            } else {
                console.warn("Imagem sem ID válido:", imagemRemovida);
            }
            
            // Atualizar lista de imagens existentes
            const novasImagens = [...imagensExistentes];
            novasImagens.splice(index, 1);
            console.log("Novas imagens após remoção:", novasImagens);
            setImagensExistentes(novasImagens);
        } else {
            // Remover imagem nova (não enviada ainda)
            const novasImagens = [...imagens];
            novasImagens.splice(index, 1);
            setImagens(novasImagens);
            
            // Remover preview
            const novosPreviews = [...imagemPreview];
            URL.revokeObjectURL(novosPreviews[index]); // Liberar URL do objeto
            novosPreviews.splice(index, 1);
            setImagemPreview(novosPreviews);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setSubmitting(true);
            setError('');
            
            // Validar campos
            if (!formData.Titulo || formData.Titulo.trim() === '') {
                throw new Error('O título é obrigatório');
            }
            
            if (!formData.Descricao || formData.Descricao.trim() === '') {
                throw new Error('A descrição é obrigatória');
            }
            
            if (!formData.Preco || formData.Preco <= 0) {
                throw new Error('O preço deve ser maior que zero');
            }
            
            if (!formData.CategoriaID_Categoria) {
                throw new Error('A categoria é obrigatória');
            }
            
            if (!formData.Tipo_ItemID_Tipo) {
                throw new Error('O tipo de item é obrigatório');
            }
            
            const formDataObj = new FormData();
            
            // Adicionar dados do formulário ao FormData
            for (const key in formData) {
                formDataObj.append(key, formData[key]);
            }
            
            // Obter ID do usuário do localStorage
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                throw new Error('Usuário não autenticado');
            }
            
            const user = JSON.parse(userStr);
            const userId = user.ID_User;
            
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
            
            // Identificar quais imagens existentes devem ser mantidas
            if (isEditMode && imagensExistentes.length > 0) {
                const imagensIds = imagensExistentes
                    .filter(img => img && img.ID_Imagem)
                    .map(img => img.ID_Imagem);
                
                console.log("IDs das imagens a manter:", imagensIds);
                console.log("Imagens existentes completas:", imagensExistentes);
                
                if (imagensIds.length > 0) {
                    formDataObj.append('manter_imagens', JSON.stringify(imagensIds));
                } else {
                    // Se não houver imagens para manter, enviar array vazio para remover todas as existentes
                    formDataObj.append('manter_imagens', JSON.stringify([]));
                }
            } else if (isEditMode) {
                // Se estamos em modo de edição mas não temos imagens para manter
                console.log("Nenhuma imagem existente para manter");
                formDataObj.append('manter_imagens', JSON.stringify([]));
            }
            
            // Debug formData completo
            console.log("FormData completo:");
            for (let [key, value] of formDataObj.entries()) {
                if (key === 'imagens') {
                    console.log(`${key}: [Arquivo]`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }
            
            // Debug
            console.log("Formulário a enviar:", {
                isEditMode,
                id: id || 'novo',
                formData: Object.fromEntries(formDataObj.entries()),
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'User-ID': userId
                }
            });
            
            if (isEditMode) {
                const resultado = await anuncioService.atualizarAnuncio(id, formDataObj);
                setSuccess('Anúncio atualizado com sucesso! Aguardando aprovação.');
                
                // Se a atualização foi bem-sucedida e há imagens atualizadas, atualizar o estado
                if (resultado && resultado.anuncio) {
                    const anuncioAtualizado = resultado.anuncio;
                    
                    if (anuncioAtualizado.item_imagems && anuncioAtualizado.item_imagems.length > 0) {
                        // Atualizar o estado de imagens existentes com os dados mais recentes
                        setImagensExistentes(anuncioAtualizado.item_imagems.map(item => item.imagem));
                    } else {
                        // Limpar o estado se não houver mais imagens
                        setImagensExistentes([]);
                    }
                }
            } else {
                await anuncioService.criarAnuncio(formDataObj);
                setSuccess('Anúncio criado com sucesso! Aguardando aprovação.');
                
                // Limpar formulário apenas em modo de criação
                setFormData({
                    Titulo: '',
                    Descricao: '',
                    Preco: '',
                    CategoriaID_Categoria: '',
                    Tipo_ItemID_Tipo: '1'
                });
                setImagens([]);
                setImagemPreview([]);
            }
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                navigate('/meus-anuncios');
            }, 2000);
        } catch (err) {
            console.error('Erro ao processar anúncio:', err);
            
            // Mostrar erros específicos do backend
            if (err.response?.data?.errors) {
                let errorMessage = 'Erro ao processar anúncio:\n';
                Object.entries(err.response.data.errors).forEach(([field, messages]) => {
                    errorMessage += `-${field}: ${messages.join(', ')}\n`;
                });
                setError(errorMessage);
            } else {
                setError(err.response?.data?.message || err.message || 'Erro ao processar anúncio. Por favor, tente novamente.');
            }
        } finally {
            setSubmitting(false);
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
                                <h2 className="mb-0">{isEditMode ? 'Editar Anúncio' : 'Criar Novo Anúncio'}</h2>
                            </Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <div className="text-center py-5">
                                        <Spinner animation="border" role="status" variant="primary">
                                            <span className="visually-hidden">Carregando...</span>
                                        </Spinner>
                                        <p className="mt-3">Carregando dados...</p>
                                    </div>
                                ) : (
                                    <>
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
                                                
                                                {/* Exibir imagens existentes */}
                                                {isEditMode && imagensExistentes.length > 0 && (
                                                    <div className="mb-3">
                                                        <p>Imagens atuais:</p>
                                                        <div className="image-preview-container d-flex flex-wrap">
                                                            {imagensExistentes.map((img, index) => (
                                                                <div key={index} className="image-preview me-2 mb-2 position-relative">
                                                                    <Button 
                                                                        variant="danger" 
                                                                        size="sm" 
                                                                        className="position-absolute" 
                                                                        style={{ 
                                                                            top: '5px', 
                                                                            right: '5px', 
                                                                            borderRadius: '50%',
                                                                            width: '20px',
                                                                            height: '20px',
                                                                            padding: '0',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                        onClick={() => handleRemoveImage(index, true)}
                                                                    >
                                                                        <span>&times;</span>
                                                                    </Button>
                                                                    <img 
                                                                        src={`http://localhost:8000/storage/${img.Caminho.replace(/^public\//, '')}`} 
                                                                        alt={`Imagem ${index}`} 
                                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                        className="rounded"
                                                                        onError={(e) => { 
                                                                            console.log('Erro ao carregar imagem:', img.Caminho); 
                                                                            e.target.onerror = null; 
                                                                            e.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNs8A8AAhUBzOKfZTQAAAAASUVORK5CYII='; 
                                                                        }}
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {/* Exibir previews de novas imagens */}
                                                {imagemPreview.length > 0 && (
                                                    <div className="mb-3">
                                                        {isEditMode && <p>Novas imagens:</p>}
                                                        <div className="image-preview-container d-flex flex-wrap">
                                                            {imagemPreview.map((preview, index) => (
                                                                <div key={index} className="image-preview me-2 mb-2 position-relative">
                                                                    <Button 
                                                                        variant="danger" 
                                                                        size="sm" 
                                                                        className="position-absolute" 
                                                                        style={{ 
                                                                            top: '5px', 
                                                                            right: '5px', 
                                                                            borderRadius: '50%',
                                                                            width: '20px',
                                                                            height: '20px',
                                                                            padding: '0',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center'
                                                                        }}
                                                                        onClick={() => handleRemoveImage(index, false)}
                                                                    >
                                                                        <span>&times;</span>
                                                                    </Button>
                                                                    <img 
                                                                        src={preview} 
                                                                        alt={`Preview ${index}`} 
                                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                        className="rounded"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </Form.Group>
                                            
                                            <div className="d-grid gap-2">
                                                <Button 
                                                    variant="primary" 
                                                    type="submit"
                                                    disabled={submitting}
                                                    size="lg"
                                                    style={{ backgroundColor: '#F97316', borderColor: '#F97316' }}
                                                >
                                                    {submitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            {isEditMode ? 'Atualizando anúncio...' : 'Criando anúncio...'}
                                                        </>
                                                    ) : (
                                                        isEditMode ? 'Atualizar Anúncio' : 'Criar Anúncio'
                                                    )}
                                                </Button>
                                            </div>
                                        </Form>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default CriarProduto;
