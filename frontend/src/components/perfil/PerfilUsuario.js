import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Nav, Image } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';
import { FaUser, FaTags, FaStore, FaShoppingBag, FaCreditCard, FaEnvelope, FaExclamationCircle, FaExchangeAlt } from 'react-icons/fa';
import Header from '../layout/Header';
import MeusAnuncios from './MeusAnuncios';
import MinhasVendas from './MinhasVendas';
import MinhasCompras from './MinhasCompras';
import Cartoes from './Cartoes';
import Mensagens from '../Mensagens/Mensagens';
import MinhasReclamacoes from './MinhasReclamacoes';
import PropostasTroca from './PropostasTroca';
import './PerfilUsuario.css';

// Fallback image as base64 - light gray placeholder with user icon
const fallbackImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN88R8AAtUB6S/lhm4AAAAASUVORK5CYII=';

const PerfilUtilizador = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('perfil');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        Name: '',
        User_Name: '',
        Email: '',
        Data_Nascimento: '',
        Morada: {
            Rua: ''
        }
    });
    const [profileImage, setProfileImage] = useState(currentUser?.imagem?.Caminho ? `http://localhost:8000/storage/${currentUser.imagem.Caminho}` : fallbackImage);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                Name: currentUser.Name || '',
                User_Name: currentUser.User_Name || '',
                Email: currentUser.Email || '',
                Data_Nascimento: currentUser.Data_Nascimento ? new Date(currentUser.Data_Nascimento).toISOString().split('T')[0] : '',
                Morada: {
                    Rua: currentUser.morada?.Rua || ''
                }
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const data = new FormData();
            
            // Apenas enviar os campos editáveis
            const editableFields = ['Name', 'User_Name', 'Email', 'Data_Nascimento'];
            editableFields.forEach(key => {
                    data.append(key, formData[key]);
            });

            await authService.updateUserProfile(data);
            setMessage('Perfil atualizado com sucesso!');
            setIsEditing(false);
        } catch (err) {
            setError('Erro ao atualizar perfil. Verifique os dados e tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderProfileContent = () => {
        if (activeTab === 'perfil') {
            return (
                <div className="profile-content">
                    {message && <Alert variant="success">{message}</Alert>}
                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome Completo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="Name"
                                        value={formData.Name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nome de Usuário</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="User_Name"
                                        value={formData.User_Name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Data de Nascimento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="Data_Nascimento"
                                        value={formData.Data_Nascimento}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <h5 className="mt-4 mb-3">Endereço <small className="text-muted">(Verificado)</small></h5>
                        <div className="address-info bg-light p-3 rounded mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <span className="text-muted small">
                                    <i className="fas fa-info-circle me-2"></i>
                                    O endereço só pode ser alterado mediante apresentação de comprovativo de morada
                                </span>
                            </div>
                            <Form.Group className="mb-3">
                                <Form.Label>Endereço Completo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="Morada.Rua"
                                    value={formData.Morada.Rua || 'Endereço não registrado'}
                                    disabled={true}
                                    readOnly
                                    className="bg-white"
                                />
                            </Form.Group>
                        </div>

                        <div className="text-end mt-4">
                            {!isEditing ? (
                                <Button variant="primary" onClick={() => setIsEditing(true)}>
                                    Editar Perfil
                                </Button>
                            ) : (
                                <>
                                    <Button variant="secondary" className="me-2" onClick={() => setIsEditing(false)}>
                                        Cancelar
                                    </Button>
                                    <Button variant="primary" type="submit" disabled={loading}>
                                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                                    </Button>
                                </>
                            )}
                        </div>
                    </Form>
                </div>
            );
        }

        switch (activeTab) {
            case 'anuncios':
                return <MeusAnuncios />;
            case 'vendas':
                return <MinhasVendas />;
            case 'compras':
                return <MinhasCompras />;
            case 'cartoes':
                return <Cartoes />;
            case 'mensagens':
                return <Mensagens />;
            case 'propostas':
                return <PropostasTroca />;
            case 'reclamacoes':
                return <MinhasReclamacoes />;
            default:
                return null;
        }
    };

    return (
        <>
            <Header />
            <Container className="py-4">
                <Row>
                    <Col md={3}>
                        <Card className="mb-4">
                            <Card.Body className="text-center">
                                <Image 
                                    src={profileImage}
                                    roundedCircle 
                                    className="profile-image mb-3"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = fallbackImage;
                                    }}
                                    alt={`Foto de perfil de ${currentUser?.Name || 'usuário'}`}
                                />
                                <h5 className="mb-1">{currentUser?.Name}</h5>
                                <p className="text-muted">@{currentUser?.User_Name}</p>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Body className="p-0">
                                <Nav className="flex-column">
                                    <Nav.Link 
                                        className={`d-flex align-items-center p-3 ${activeTab === 'perfil' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('perfil')}
                                    >
                                        <FaUser className="me-2" /> Perfil
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`d-flex align-items-center p-3 ${activeTab === 'anuncios' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('anuncios')}
                                    >
                                        <FaTags className="me-2" /> Meus Anúncios
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`d-flex align-items-center p-3 ${activeTab === 'vendas' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('vendas')}
                                    >
                                        <FaStore className="me-2" /> Minhas Vendas
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`d-flex align-items-center p-3 ${activeTab === 'compras' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('compras')}
                                    >
                                        <FaShoppingBag className="me-2" /> Minhas Compras
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`d-flex align-items-center p-3 ${activeTab === 'cartoes' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('cartoes')}
                                    >
                                        <FaCreditCard className="me-2" /> Cartões
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`d-flex align-items-center p-3 ${activeTab === 'mensagens' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('mensagens')}
                                    >
                                        <FaEnvelope className="me-2" /> Mensagens
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`d-flex align-items-center p-3 ${activeTab === 'propostas' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('propostas')}
                                    >
                                        <FaExchangeAlt className="me-2" /> Minhas Propostas
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={`d-flex align-items-center p-3 ${activeTab === 'reclamacoes' ? 'active' : ''}`}
                                        onClick={() => setActiveTab('reclamacoes')}
                                    >
                                        <FaExclamationCircle className="me-2" /> Reclamações
                                    </Nav.Link>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={9}>
                        <Card>
                            <Card.Body>
                                {renderProfileContent()}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default PerfilUtilizador;
