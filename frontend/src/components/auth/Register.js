import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, moradaService } from '../../services/api';
import { Form, Button, Container, Alert, Image, Row, Col, Modal, ListGroup } from 'react-bootstrap';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

function Register() {
    const [formData, setFormData] = useState({
        Name: '',
        User_Name: '',
        Email: '',
        Password: '',
        Password_confirmation: '',
        Data_Nascimento: '',
        MoradaID_Morada: ''
    });
    
    const [moradas, setMoradas] = useState([]);
    const [showMoradaModal, setShowMoradaModal] = useState(false);
    const [selectedMorada, setSelectedMorada] = useState(null);
    const [comprovativoMorada, setComprovativoMorada] = useState(null);
    const [previewMorada, setPreviewMorada] = useState(null);
    const [error, setError] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const navigate = useNavigate();

    // Carregar moradas disponíveis
    useEffect(() => {
        const fetchMoradas = async () => {
            try {
                console.log('Iniciando busca de moradas...');
                const data = await moradaService.getMoradas();
                console.log('Moradas recebidas:', data);
                setMoradas(data);
            } catch (err) {
                console.error('Erro ao carregar moradas:', err);
                setError('Não foi possível carregar as moradas disponíveis.');
            }
        };
        
        fetchMoradas();
    }, []);

    const handleComprovativoMorada = (e) => {
        const file = e.target.files[0];
        setComprovativoMorada(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewMorada(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleMoradaSelect = (morada) => {
        setSelectedMorada(morada);
        setFormData({
            ...formData,
            MoradaID_Morada: morada.ID_Morada
        });
        setShowMoradaModal(false);
    };

    const openMoradaModal = () => {
        setShowMoradaModal(true);
    };

    const handleChange = (e) => {
        if (e.target.type !== 'file') {
            setFormData({
                ...formData,
                [e.target.name]: e.target.value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = new FormData();
            // Adicionar os dados do formulário
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });
            
            // Adicionar os arquivos de comprovativo
            if (comprovativoMorada) {
                data.append('comprovativo_morada', comprovativoMorada);
            }

            console.log('Dados enviados:', Object.fromEntries(data));
            
            const response = await authService.register(data);
            console.log('Resposta do servidor:', response);
            
            setRegistrationSuccess(true);
            navigate('/');
        } catch (err) {
            console.error('Erro ao registar:', err);
            setError('Erro ao registar. Verifique os seus dados.');
        }
    };

    return (
        <>
            <Header />
            <Container className="mt-5">
                <div className="w-100" style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <h2 className="text-center mb-4">Registo</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {registrationSuccess && (
                        <Alert variant="success">
                            Registo efetuado com sucesso! Por favor, verifique o seu email para ativar a sua conta.
                        </Alert>
                    )}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="Name"
                                value={formData.Name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

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

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="Email"
                                value={formData.Email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Palavra-passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="Password"
                                value={formData.Password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirmar Palavra-passe</Form.Label>
                            <Form.Control
                                type="password"
                                name="Password_confirmation"
                                value={formData.Password_confirmation}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

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
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Morada</Form.Label>
                            <div className="d-flex">
                                <Form.Control 
                                    type="text" 
                                    value={selectedMorada ? selectedMorada.Rua : ''}
                                    readOnly
                                    placeholder="Selecione uma morada"
                                    className="me-2"
                                    required
                                />
                                <Button variant="outline-secondary" onClick={openMoradaModal}>
                                    Selecionar
                                </Button>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Comprovativo de Morada</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleComprovativoMorada}
                                required
                                accept=".jpg,.jpeg,.png,.pdf"
                            />
                            {previewMorada && (
                                <Image
                                    src={previewMorada}
                                    alt="Preview do Comprovativo de Morada"
                                    style={{ maxWidth: '200px', marginTop: '10px' }}
                                    thumbnail
                                />
                            )}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Registar
                        </Button>
                    </Form>
                    <div className="mt-3 text-center">
                        <p>Já tem uma conta? <Link to="/login">Iniciar Sessão</Link></p>
                    </div>
                
                    {/* Modal para seleção de morada */}
                    <Modal show={showMoradaModal} onHide={() => setShowMoradaModal(false)} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Selecione uma Morada</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {moradas.length > 0 ? (
                                <ListGroup>
                                    {moradas.map((morada) => (
                                        <ListGroup.Item 
                                            key={morada.ID_Morada} 
                                            action 
                                            onClick={() => handleMoradaSelect(morada)}
                                            className={selectedMorada?.ID_Morada === morada.ID_Morada ? 'active' : ''}
                                        >
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{morada.Rua}</strong>
                                                </div>
                                                {selectedMorada?.ID_Morada === morada.ID_Morada && (
                                                    <i className="fas fa-check text-success"></i>
                                                )}
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p className="text-center">Nenhuma morada disponível</p>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowMoradaModal(false)}>
                                Cancelar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </Container>
            <Footer />
        </>
    );
}

export default Register;
