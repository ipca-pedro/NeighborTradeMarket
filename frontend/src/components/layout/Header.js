import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, Dropdown } from 'react-bootstrap';
import ChatBot from '../chat/ChatBot';
import { useAuth } from '../../contexts/AuthContext';
import LoginPopup from '../auth/LoginPopup';
import CategoryMenu from './CategoryMenu';
import HelpModal from '../help/HelpModal';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { notificacaoService } from '../../services/notificacaoService';
import { getUnreadMessagesCount } from '../../services/api';

const Header = () => {
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showMessagesDropdown, setShowMessagesDropdown] = useState(false);
    const [messages, setMessages] = useState([]);
    const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
    const [messageNotifications, setMessageNotifications] = useState([]);
    const [generalNotifications, setGeneralNotifications] = useState([]);

    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchFocused, setSearchFocused] = useState(false);
    
    // Buscar notificações do servidor
    const fetchNotifications = async () => {
        try {
            const response = await notificacaoService.buscarNotificacoes();
            const formattedNotifications = response.map(notif => ({
                id: notif.ID_Notificacao,
                message: notif.Mensagem,
                date: new Date(notif.DataNotificacao),
                read: notif.Lida === 1,
                referenceId: notif.ReferenciaID,
                referenceType: notif.ReferenciaTipoID_ReferenciaTipo,
                type: notif.TIpo_notificacaoID_TipoNotificacao
            }));
            // Agora, notificações de mensagem são as que tem referenceType === 2
            const msgNotifs = formattedNotifications.filter(n => n.referenceType === 2);
            const generalNotifs = formattedNotifications.filter(n => n.referenceType !== 2);
            setMessageNotifications(msgNotifs);
            setGeneralNotifications(generalNotifs);
            setNotifications(formattedNotifications); // mantém todas para uso geral
            setUnreadCount(generalNotifs.filter(n => !n.read).length);
            setMessages(msgNotifs);
        } catch (error) {
            console.error('Erro ao buscar notificações:', error);
        }
    };

    useEffect(() => {
        if (currentUser && currentUser.ID_User) {
            fetchNotifications();
            const interval = setInterval(() => {
                fetchNotifications();
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser && currentUser.ID_User) {
            const fetchUnreadMessages = async () => {
                const count = await getUnreadMessagesCount();
                setUnreadMessagesCount(count);
            };
            fetchUnreadMessages();
            const interval = setInterval(fetchUnreadMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [currentUser]);

    useEffect(() => {
        // Badge de mensagens não lidas deve ser a contagem de messageNotifications não lidas
        setUnreadMessagesCount(messageNotifications.filter(n => !n.read).length);
    }, [messageNotifications]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificacaoService.marcarComoLida(notificationId);
            setNotifications(notifications.map(notif => 
                notif.id === notificationId 
                    ? { ...notif, read: true }
                    : notif
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Erro ao marcar notificação como lida:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificacaoService.marcarTodasComoLidas();
            setNotifications(notifications.map(notif => ({ ...notif, read: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Erro ao marcar todas notificações como lidas:', error);
        }
    };

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
                                className="text-white position-relative d-flex align-items-center"
                                onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                                style={{
                                    cursor: 'pointer',
                                    width: '40px',
                                    height: '40px',
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <i className="fas fa-bell" style={{ fontSize: '20px', width: '20px', height: '20px', lineHeight: '20px' }}></i>
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
                                <div
                                    className="position-absolute bg-white shadow rounded"
                                    style={{ top: '100%', right: 0, width: '320px', zIndex: 1000 }}
                                >
                                    <NotificationDropdown
                                        notifications={generalNotifications}
                                        onRead={handleMarkAsRead}
                                        onMarkAllAsRead={handleMarkAllAsRead}
                                    />
                                    <div className="text-center p-2 border-top">
                                        <Link
                                            to="/perfil?tab=notificacoes"
                                            className="text-decoration-none small"
                                            onClick={() => setShowNotificationsDropdown(false)}
                                        >
                                            Ver todas as notificações
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="position-relative me-3 messages-dropdown">
                            <Nav.Link 
                                href="#" 
                                className="text-white position-relative" 
                                onClick={() => setShowMessagesDropdown(!showMessagesDropdown)}
                            >
                                <i className="far fa-comment-alt text-white"></i>
                                {messageNotifications.filter(n => !n.read).length > 0 && (
                                    <span
                                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                        style={{ fontSize: '0.65rem', marginTop: '-3px' }}
                                    >
                                        {messageNotifications.filter(n => !n.read).length}
                                    </span>
                                )}
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
                                        {messageNotifications.length === 0 ? (
                                            <div className="p-4 text-center text-muted">
                                                <i className="far fa-comment-alt fa-2x mb-2"></i>
                                                <p className="mb-0">Você ainda não tem mensagens</p>
                                                <small>Quando iniciar uma conversa, ela aparecerá aqui</small>
                                            </div>
                                        ) : (
                                            messageNotifications.map(message => (
                                                <div key={message.id} className="p-3 border-bottom hover-bg-light">
                                                    <div className="fw-bold mb-1">{message.message}</div>
                                                    <div className="text-muted small">{message.date.toLocaleString()}</div>
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
