import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, Dropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import LoginPopup from '../auth/LoginPopup';
import CategoryMenu from './CategoryMenu';

const Header = () => {
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const searchRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/anuncios/procurar?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Falha ao terminar sessão', error);
        }
    };

    const toggleLoginPopup = () => {
        setShowLoginPopup(!showLoginPopup);
    };

    const toggleCategoryMenu = () => {
        setShowCategoryMenu(!showCategoryMenu);
    };

    // Fechar popups ao clicar fora deles
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showLoginPopup && !event.target.closest('.user-dropdown')) {
                setShowLoginPopup(false);
            }
            if (showCategoryMenu && !event.target.closest('.category-dropdown') && 
                !event.target.closest('.category-menu')) {
                setShowCategoryMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLoginPopup, showCategoryMenu]);

    return (
        <header>
            {/* Removido a seção de links para redes sociais */}

            <Navbar bg="primary" variant="dark" expand="lg" className="py-3">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img 
                            src="/images/logo.png" 
                            alt="NeighborTrade" 
                            height="40" 
                            className="d-inline-block align-top"
                        />
                        <span className="ms-2">NeighborTrade</span>
                    </Navbar.Brand>

                    <div className="search-bar mx-auto">
                        <Form onSubmit={handleSearch} className="d-flex">
                            <Form.Control
                                ref={searchRef}
                                type="search"
                                placeholder="Pesquisar por qualquer coisa..."
                                className="me-2"
                                aria-label="Pesquisar"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Button variant="light" type="submit">
                                <i className="fas fa-search"></i>
                            </Button>
                        </Form>
                    </div>

                    <div className="d-flex align-items-center">
                        <Nav.Link href="#" className="text-white me-3">
                            <i className="far fa-comment-alt"></i>
                        </Nav.Link>
                        <div className="user-dropdown position-relative">
                            <Nav.Link 
                                href="#" 
                                className="text-white" 
                                onClick={toggleLoginPopup}
                            >
                                <i className="far fa-user"></i>
                            </Nav.Link>
                            {showLoginPopup && (
                                <div className="position-absolute end-0 mt-2" style={{ zIndex: 1000, width: '300px' }}>
                                    <LoginPopup onClose={() => setShowLoginPopup(false)} />
                                </div>
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
                        <Nav.Link href="#" className="d-flex align-items-center">
                            <i className="fas fa-headset me-2"></i>
                            <span>Apoio ao Cliente</span>
                        </Nav.Link>
                        <Nav.Link href="#" className="d-flex align-items-center ms-3">
                            <i className="fas fa-question-circle me-2"></i>
                            <span>Precisa de Ajuda</span>
                        </Nav.Link>
                    </Nav>

                    <div className="ms-auto">
                        <span>+351 202-555-0104</span>
                    </div>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
