import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, Dropdown } from 'react-bootstrap';
import ChatBot from '../chat/ChatBot';
import { useAuth } from '../../contexts/AuthContext';
import LoginPopup from '../auth/LoginPopup';
import CategoryMenu from './CategoryMenu';
import HelpModal from '../help/HelpModal';
import NotificationDropdown from '../notifications/NotificationDropdown';

const Header = () => {
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
    const [messages, setMessages] = useState([]);
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    
    // Buscar notificações do servidor
    useEffect(() => {
        const fetchNotifications = async () => {
            if (currentUser && currentUser.ID_User) {
                try {
                    // Aqui você deve fazer uma chamada API para buscar notificações
                    // Por exemplo: const response = await api.get('/notificacoes');
                    // Simulando notificações para teste
                    const mockNotifications = [];
                    
                    // Se o usuário for admin, adicionar notificações de registro de usuário
                    if (currentUser.TipoUserID_TipoUser === 1) {
                        // Buscar notificações de pendentes
                        try {
                            const response = await fetch('http://127.0.0.1:8000/api/admin/pending-users-count', {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                    'Content-Type': 'application/json'
                                }
                            });
                            
                            if (response.ok) {
                                const data = await response.json();
                                if (data.count > 0) {
                                    mockNotifications.push({
                                        id: 'user-reg-1',
                                        type: 'USER_REGISTRATION',
                                        userName: 'Novos utilizadores',
                                        message: `${data.count} novos pedidos de registo pendentes`,
                                        read: false,
                                        createdAt: new Date().toISOString()
                                    });
                                }
                            }
                        } catch (error) {
                            console.error('Erro ao buscar contagem de usuários pendentes:', error);
                        }
                    }
                    
                    setNotifications(mockNotifications);
                } catch (error) {
                    console.error('Erro ao buscar notificações:', error);
                }
            }
        };
        
        fetchNotifications();
        
        // Configurar um intervalo para buscar notificações periodicamente
        const interval = setInterval(fetchNotifications, 60000); // A cada minuto
        
        return () => clearInterval(interval);
    }, [currentUser]);

    // Atualizar o contador de notificações não lidas
    useEffect(() => {
        setUnreadCount(notifications.filter(n => !n.read).length);
    }, [notifications]);

    const handleReadNotifications = (notificationIds) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notificationIds.includes(notification.id)
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };
    // Moved to above the useEffect hook

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/anuncios?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Falha ao terminar sessão', error);
        } finally {
            window.location.href = '/login';
        }
    };

    const toggleLoginPopup = () => {
        setShowLoginPopup(!showLoginPopup);
    };

    const toggleCategoryMenu = () => {
        setShowCategoryMenu(!showCategoryMenu);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showLoginPopup && !event.target.closest('.user-dropdown')) {
                setShowLoginPopup(false);
            }
            if (showCategoryMenu && !event.target.closest('.category-dropdown') && 
                !event.target.closest('.category-menu')) {
                setShowCategoryMenu(false);
            }
            if (showMessagesDropdown && !event.target.closest('.messages-dropdown')) {
                setShowMessagesDropdown(false);
            }
            if (showNotificationsDropdown && !event.target.closest('.notifications-dropdown')) {
                setShowNotificationsDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLoginPopup, showCategoryMenu, showMessagesDropdown, showNotificationsDropdown]);

    return (
        <header>
            <Navbar bg="primary" variant="dark" expand="lg" className="py-3">
                <Container>
                    <Navbar.Brand as={Link} to="/" className="me-4">
                        <img 
                            src="/images/logo.png" 
                            alt="NeighborTrade" 
                            height="40" 
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>

                    <div className="search-bar mx-auto flex-grow-1 px-4">
                        <Form onSubmit={handleSearch} className="d-flex">
                            <Form.Control
                                ref={searchRef}
                                type="search"
                                placeholder={searchFocused ? '' : 'Pesquisar por qualquer produto'}
                                className="me-2 text-center"
                                aria-label="Pesquisar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            <Button variant="light" type="submit">
                                <i className="fas fa-search"></i>
                            </Button>
                        </Form>
                    </div>

                    <div className="d-flex align-items-center">
                        {currentUser && (
                            currentUser.TipoUserID_TipoUser === 1 ? (
                                <Button 
                                    as={Link} 
                                    to="/admin" 
                                    variant="outline-light" 
                                    className="me-3"
                                >
                                    <i className="fas fa-tachometer-alt me-1"></i> Painel de Administrador
                                </Button>
                            ) : (
                                <Button 
                                    as={Link} 
                                    to="/anuncios/novo" 
                                    variant="outline-light" 
                                    className="me-3"
                                >
                                    <i className="fas fa-plus me-1"></i> Criar Anúncio
                                </Button>
                            )
                        )}
                        
                        <div className="position-relative me-3 notifications-dropdown">
                            <Nav.Link 
                                href="#" 
                                className="text-white position-relative" 
                                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                            >
                                <i className="fas fa-bell"></i>
                                {unreadCount > 0 && (
                                    <span 
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        style={{ fontSize: '0.65rem', marginTop: '-3px' }}
                                    >
                                        {unreadCount}
                                    </span>
                                )}
                            </Nav.Link>
                            {showNotificationsDropdown && (
                                <NotificationDropdown 
                                    notifications={notifications}
                                    onRead={handleReadNotifications}
                                />
                            )}
                        </div>
                        <div className="position-relative me-3 messages-dropdown">
                            <Nav.Link 
                                href="#" 
                                className="text-white" 
                                onClick={() => setShowMessagesDropdown(!showMessagesDropdown)}
                            >
                                <i className="far fa-comment-alt text-white"></i>
                            </Nav.Link>
                            {showMessagesDropdown && (
                                <div 
                                    className="position-absolute bg-white shadow rounded" 
                                    style={{ 
                                        top: '100%', 
                                        right: 0, 
                                        width: '300px', 
                                        zIndex: 1000 
                                    }}
                                >
                                    <div className="p-3 border-bottom">
                                        <h6 className="mb-0">Mensagens</h6>
                                    </div>
                                    <div className="messages-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                        {messages.length === 0 ? (
                                            <div className="p-4 text-center text-muted">
                                                <i className="far fa-comment-alt fa-2x mb-2"></i>
                                                <p className="mb-0">Você ainda não tem mensagens</p>
                                                <small>Quando iniciar uma conversa, ela aparecerá aqui</small>
                                            </div>
                                        ) : (
                                            messages.map(message => (
                                                <div key={message.id} className="p-3 border-bottom hover-bg-light">
                                                    {/* Aqui vai o conteúdo de cada mensagem quando implementado */}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="user-dropdown position-relative">
                            {currentUser ? (
                                <Dropdown>
                                    <Dropdown.Toggle variant="link" className="text-white p-0">
                                        <i className="far fa-user"></i>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align="end">
                                        <div className="dropdown-header text-primary fw-bold text-center" style={{fontSize: '1rem'}}>
                                            {currentUser && currentUser.Name ? currentUser.Name : 'Utilizador'}
                                        </div>
                                        <Dropdown.Divider />
                                        <Dropdown.Item as={Link} to="/perfil">Meu Perfil</Dropdown.Item>
                                        {(!currentUser || currentUser.TipoUserID_TipoUser !== 1) && (
                                            <Dropdown.Item as={Link} to="/meus-anuncios">Meus Anúncios</Dropdown.Item>
                                        )}
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout}>Terminar Sessão</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            ) : (
                                <>
                                    <Nav.Link 
                                        href="#" 
                                        className="text-white" 
                                        onClick={toggleLoginPopup}
                                    >
                                        <i className="far fa-user"></i>
                                    </Nav.Link>
                                    {showLoginPopup && (
                                        <div className="position-absolute end-0 mt-2" style={{ zIndex: 1000, width: '300px' }}>
                                            <LoginPopup onClose={() => { setShowLoginPopup(false); window.location.href = '/'; }} />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </Navbar>

            <Navbar bg="light" variant="light" className="py-2 border-bottom">
                <Container>
                    <div className="category-dropdown position-relative">
                        <Button 
                            variant="light" 
                            className="d-flex align-items-center"
                            onClick={toggleCategoryMenu}
                        >
                            <span>Todas as Categorias</span>
                            <i className={`fas fa-chevron-${showCategoryMenu ? 'up' : 'down'} ms-2`}></i>
                        </Button>
                        {showCategoryMenu && (
                            <div className="position-absolute start-0 mt-2 category-menu" style={{ zIndex: 1000, width: '250px' }}>
                                <CategoryMenu onSelectCategory={() => setShowCategoryMenu(false)} />
                            </div>
                        )}
                    </div>

                    <Nav className="ms-4">
                        <Nav.Link 
                            onClick={() => document.querySelector('.chat-toggle-button').click()} 
                            className="d-flex align-items-center"
                            style={{ cursor: 'pointer' }}
                        >
                            <i className="fas fa-headset me-2"></i>
                            <span>Apoio ao Cliente</span>
                        </Nav.Link>
                        <Nav.Link 
                            onClick={() => setShowHelpModal(true)} 
                            className="d-flex align-items-center ms-3"
                            style={{ cursor: 'pointer' }}
                        >
                            <i className="fas fa-question-circle me-2"></i>
                            <span>Precisa de Ajuda</span>
                        </Nav.Link>

                        <HelpModal 
                            show={showHelpModal} 
                            onHide={() => setShowHelpModal(false)} 
                        />

                        <ChatBot />
                    </Nav>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
