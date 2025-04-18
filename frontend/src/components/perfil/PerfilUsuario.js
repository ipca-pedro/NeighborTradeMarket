import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Nav, Tab, Image, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import MeusAnuncios from './MeusAnuncios';
import Cartoes from './Cartoes';
import Mensagens from '../Mensagens/Mensagens';
import MinhasCompras from './MinhasCompras';
import MinhasVendas from './MinhasVendas';
import { FaUser, FaTags, FaStore, FaShoppingBag, FaHeart, FaCreditCard, FaEnvelope, FaCamera } from 'react-icons/fa';

const PerfilUtilizador = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('perfil');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        Name: '',
        User_Name: '',
        Email: '',
        Data_Nascimento: '',
        CC: '',
        Morada: {
            Rua: '',
            Numero: '',
            CodigoPostal: '',
            Localidade: '',
            Distrito: ''
        }
    });
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setFormData({
                Name: currentUser.Name || '',
                User_Name: currentUser.User_Name || '',
                Email: currentUser.Email || '',
                Data_Nascimento: currentUser.Data_Nascimento ? new Date(currentUser.Data_Nascimento).toISOString().split('T')[0] : '',
                CC: currentUser.CC || '',
                Morada: {
                    Rua: currentUser.morada?.Rua || '',
                    Numero: currentUser.morada?.Numero || '',
                    CodigoPostal: currentUser.morada?.CodigoPostal || '',
                    Localidade: currentUser.morada?.Localidade || '',
                    Distrito: currentUser.morada?.Distrito || ''
                }
            });

            if (currentUser.imagem?.Caminho) {
                setProfileImagePreview(`http://localhost/NT/public/${currentUser.imagem.Caminho}`);
            }
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const data = new FormData();
            
            Object.keys(formData).forEach(key => {
                if (key !== 'Morada') {
                    data.append(key, formData[key]);
                }
            });
            
            Object.keys(formData.Morada).forEach(key => {
                data.append(`Morada[${key}]`, formData.Morada[key]);
            });
            
            if (profileImage) {
                data.append('Imagem', profileImage);
            }

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
                <Card className="shadow-sm">
                    <Card.Body>
                        {message && <Alert variant="success">{message}</Alert>}
                        {error && <Alert variant="danger">{error}</Alert>}
                        
                        <div className="text-center mb-4">
                            <div className="position-relative d-inline-block">
                                {profileImagePreview ? (
                                    <Image 
                                        src={profileImagePreview} 
                                        roundedCircle 
                                        style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                                    />
                                ) : (
                                    <div 
                                        className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                                        style={{ width: '150px', height: '150px' }}
                                    >
                                        <span style={{ fontSize: '3rem' }}>{currentUser?.Name?.charAt(0) || 'U'}</span>
                                    </div>
                                )}
                                <label 
                                    className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2 cursor-pointer"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <FaCamera />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImageChange}
                                        className="d-none"
                                    />
                                </label>
                            </div>
                            <h4 className="mt-3">{currentUser?.Name}</h4>
                            <p className="text-muted">@{currentUser?.User_Name}</p>
                        </div>

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

                            <h5 className="mt-4 mb-3">Endereço</h5>
                            <Row>
                                <Col md={8}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Rua</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Morada.Rua"
                                            value={formData.Morada.Rua}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Número</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Morada.Numero"
                                            value={formData.Morada.Numero}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Código Postal</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Morada.CodigoPostal"
                                            value={formData.Morada.CodigoPostal}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Localidade</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Morada.Localidade"
                                            value={formData.Morada.Localidade}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Distrito</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="Morada.Distrito"
                                            value={formData.Morada.Distrito}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

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
                                            {loading ? (
                                                <>
                                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                                    <span className="ms-2">Salvando...</span>
                                                </>
                                            ) : (
                                                'Salvar Alterações'
                                            )}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
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
            default:
                return null;
        }
    };

    return (
        <>
            <Header />
            <Container className="my-5">
                <Row>
                    <Col md={3}>
                        <Card className="mb-4 shadow-sm">
                            <Card.Body className="text-center">
                                <div className="mb-3">
                                    {profileImagePreview ? (
                                        <Image 
                                            src={profileImagePreview} 
                                            roundedCircle 
                                            style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
                                        />
                                    ) : (
                                        <div 
                                            className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto" 
                                            style={{ width: '120px', height: '120px' }}
                                        >
                                            <span style={{ fontSize: '3rem' }}>{currentUser?.Name?.charAt(0) || 'U'}</span>
                                        </div>
                                    )}
                                </div>
                                <h5 className="mb-1">{currentUser?.Name}</h5>
                                <p className="text-muted mb-3">@{currentUser?.User_Name}</p>
                            </Card.Body>
                        </Card>

                        <Card className="shadow-sm">
                            <Card.Body>
                                <Nav variant="pills" className="flex-column" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                                    <Nav.Item>
                                        <Nav.Link eventKey="perfil" className="d-flex align-items-center">
                                            <FaUser className="me-2" />
                                            Perfil
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="anuncios" className="d-flex align-items-center">
                                            <FaTags className="me-2" />
                                            Meus Anúncios
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="vendas" className="d-flex align-items-center">
                                            <FaStore className="me-2" />
                                            Minhas Vendas
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="compras" className="d-flex align-items-center">
                                            <FaShoppingBag className="me-2" />
                                            Minhas Compras
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="cartoes" className="d-flex align-items-center">
                                            <FaCreditCard className="me-2" />
                                            Cartões
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="mensagens" className="d-flex align-items-center">
                                            <FaEnvelope className="me-2" />
                                            Mensagens
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={9}>
                        {renderProfileContent()}
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default PerfilUtilizador;
