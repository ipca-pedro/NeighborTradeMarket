import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { FaLaptop, FaCouch, FaTshirt, FaBook, FaGamepad, FaTools, FaCar, FaHome, FaRunning, FaEllipsisH } from 'react-icons/fa';
import './CategoryMenu.css';

const CategoryMenu = ({ onSelectCategory }) => {
    return (
        <Card className="border-0 shadow">
            <Card.Body className="p-0">
                <div className="list-group list-group-flush">
                    <Link 
                        to="/anuncios/categoria/1" 
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={onSelectCategory}
                    >
                        <FaLaptop className="me-3" /> Informática
                    </Link>
                    <Link 
                        to="/anuncios/categoria/2" 
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={onSelectCategory}
                    >
                        <FaCouch className="me-3" /> Móveis
                    </Link>
                    <Link 
                        to="/anuncios/categoria/3" 
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={onSelectCategory}
                    >
                        <FaTshirt className="me-3" /> Roupas
                    </Link>
                    <Link 
                        to="/anuncios/categoria/4" 
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={onSelectCategory}
                    >
                        <FaBook className="me-3" /> Livros
                    </Link>
                    <Link 
                        to="/anuncios/categoria/5" 
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={onSelectCategory}
                    >
                        <FaGamepad className="me-3" /> Brinquedos
                    </Link>
                    <Link 
                        to="/anuncios/categoria/6" 
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={onSelectCategory}
                    >
                        <FaTools className="me-3" /> Ferramentas
                    </Link>
                    <Link 
                        to="/anuncios/categoria/7" 
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={onSelectCategory}
                    >
                        <FaCar className="me-3" /> Veículos
                    </Link>
                    <Link 
                        to="/anuncios/categoria/8" 
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={onSelectCategory}
                    >
                        <FaHome className="me-3" /> Imóveis
                    </Link>
                    <Link 
                        to="/anuncios/categoria/9" 
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={onSelectCategory}
                    >
                        <FaRunning className="me-3" /> Desporto
                    </Link>
                    <Link 
                        to="/anuncios/categoria/10" 
                        className="list-group-item list-group-item-action d-flex align-items-center"
                        onClick={onSelectCategory}
                    >
                        <FaEllipsisH className="me-3" /> Outros
                    </Link>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CategoryMenu;
