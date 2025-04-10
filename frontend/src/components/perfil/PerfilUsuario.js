import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Nav, Tab, Image } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/api';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

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
            
            // Adicionar campos básicos
            Object.keys(formData).forEach(key => {
                if (key !== 'Morada') {
                    data.append(key, formData[key]);
                }
            });
            
            // Adicionar campos de morada
            Object.keys(formData.Morada).forEach(key => {
                data.append(`Morada[${key}]`, formData.Morada[key]);
            });
            
            // Adicionar imagem de perfil se existir
            if (profileImage) {
                data.append('Imagem', profileImage);
            }

            await authService.updateUserProfile(data);
            setMessage('Perfil atualizado com sucesso!');
        } catch (err) {
            setError('Erro ao atualizar perfil. Verifique os dados e tente novamente.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <Container className="my-5">
                <Row>
                    <Col md={3}>
                        <Card className="mb-4">
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
                                <div className="d-flex justify-content-center mb-2">
                                    <Button variant="primary" size="sm" className="me-2">
                                        Meus Anúncios
                                    </Button>
                                    <Button variant="outline-primary" size="sm">
                                        Mensagens
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Body>
                                <Nav variant="pills" className="flex-column" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                                    <Nav.Item>
                                        <Nav.Link eventKey="perfil">Perfil</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="anuncios">Meus Anúncios</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="favoritos">Favoritos</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="mensagens">Mensagens</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="notificacoes">Notificações</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="seguranca">Segurança</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={9}>
                        <Tab.Content>
                            <Tab.Pane active={activeTab === 'perfil'}>
                                <Card>
                                    <Card.Header as="h5">Informações do Perfil</Card.Header>
                                    <Card.Body>
                                        {message && <Alert variant="success">{message}</Alert>}
                                        {error && <Alert variant="danger">{error}</Alert>}

                                        <Form onSubmit={handleSubmit}>
                                            <Row className="mb-3">
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Nome Completo</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="Name"
                                                            value={formData.Name}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Nome de Utilizador</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="User_Name"
                                                            value={formData.User_Name}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row className="mb-3">
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            name="Email"
                                                            value={formData.Email}
                                                            onChange={handleChange}
                                                            required
                                                            readOnly
                                                        />
                                                        <Form.Text className="text-muted">
                                                            O email não pode ser alterado.
                                                        </Form.Text>
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
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row className="mb-3">
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>CC</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="CC"
                                                            value={formData.CC}
                                                            onChange={handleChange}
                                                            required
                                                            readOnly
                                                        />
                                                        <Form.Text className="text-muted">
                                                            O número de CC não pode ser alterado.
                                                        </Form.Text>
                                                    </Form.Group>
                                                </Col>
                                                <Col md={6}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Imagem de Perfil</Form.Label>
                                                        <Form.Control
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleProfileImageChange}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <h5 className="mt-4 mb-3">Morada</h5>
                                            <Row className="mb-3">
                                                <Col md={8}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Rua</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="Morada.Rua"
                                                            value={formData.Morada.Rua}
                                                            onChange={handleChange}
                                                            required
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
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <Row className="mb-3">
                                                <Col md={4}>
                                                    <Form.Group className="mb-3">
                                                        <Form.Label>Código Postal</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="Morada.CodigoPostal"
                                                            value={formData.Morada.CodigoPostal}
                                                            onChange={handleChange}
                                                            required
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
                                                            required
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
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                            <div className="text-end mt-4">
                                                <Button 
                                                    variant="primary" 
                                                    type="submit" 
                                                    disabled={loading}
                                                >
                                                    {loading ? 'A guardar...' : 'Guardar Alterações'}
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            <Tab.Pane active={activeTab === 'anuncios'}>
                                <Card>
                                    <Card.Header as="h5">Meus Anúncios</Card.Header>
                                    <Card.Body>
                                        <p className="text-center py-5">
                                            Funcionalidade em desenvolvimento. Em breve poderá ver todos os seus anúncios aqui.
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            <Tab.Pane active={activeTab === 'favoritos'}>
                                <Card>
                                    <Card.Header as="h5">Favoritos</Card.Header>
                                    <Card.Body>
                                        <p className="text-center py-5">
                                            Funcionalidade em desenvolvimento. Em breve poderá ver todos os seus anúncios favoritos aqui.
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            <Tab.Pane active={activeTab === 'mensagens'}>
                                <Card>
                                    <Card.Header as="h5">Mensagens</Card.Header>
                                    <Card.Body>
                                        <p className="text-center py-5">
                                            Funcionalidade em desenvolvimento. Em breve poderá ver todas as suas mensagens aqui.
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            <Tab.Pane active={activeTab === 'notificacoes'}>
                                <Card>
                                    <Card.Header as="h5">Notificações</Card.Header>
                                    <Card.Body>
                                        <p className="text-center py-5">
                                            Funcionalidade em desenvolvimento. Em breve poderá ver todas as suas notificações aqui.
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>

                            <Tab.Pane active={activeTab === 'seguranca'}>
                                <Card>
                                    <Card.Header as="h5">Segurança</Card.Header>
                                    <Card.Body>
                                        <h6 className="mb-3">Alterar Palavra-passe</h6>
                                        <Form>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Palavra-passe Atual</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Nova Palavra-passe</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Confirmar Nova Palavra-passe</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    required
                                                />
                                            </Form.Group>

                                            <div className="text-end">
                                                <Button variant="primary">
                                                    Alterar Palavra-passe
                                                </Button>
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Container>
            <Footer />
        </>
    );
};

export default PerfilUtilizador;
