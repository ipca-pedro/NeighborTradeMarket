import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import './CategoryMenu.css';

const CategoryMenu = ({ onSelectCategory }) => {
    // Categorias atualizadas para corresponder ao banco de dados
    const categories = [
        { id: 1, name: 'Informática', icon: 'fas fa-laptop', hasSubcategories: true },
        { id: 2, name: 'Móveis', icon: 'fas fa-couch' },
        { id: 3, name: 'Roupas', icon: 'fas fa-tshirt' },
        { id: 4, name: 'Livros', icon: 'fas fa-book' },
        { id: 5, name: 'Brinquedos', icon: 'fas fa-gamepad' },
        { id: 6, name: 'Ferramentas', icon: 'fas fa-tools' },
        { id: 7, name: 'Veículos', icon: 'fas fa-car' },
        { id: 8, name: 'Imóveis', icon: 'fas fa-home' },
        { id: 9, name: 'Desporto', icon: 'fas fa-running' },
        { id: 10, name: 'Outros', icon: 'fas fa-tag' }
    ];

    return (
        <ListGroup className="shadow-sm border category-menu-narrow">
            {categories.map(category => (
                <ListGroup.Item 
                    key={category.id} 
                    action 
                    as={Link} 
                    to={`/anuncios/categoria/${category.id}`}
                    className="d-flex justify-content-between align-items-center py-2"
                    onClick={onSelectCategory}
                >
                    <div>
                        <i className={`${category.icon} me-2`}></i>
                        {category.name}
                    </div>
                    {category.hasSubcategories && (
                        <i className="fas fa-chevron-right"></i>
                    )}
                </ListGroup.Item>
            ))}
            <ListGroup.Item 
                action 
                as={Link} 
                to="/categorias"
                className="text-center fw-bold"
                onClick={onSelectCategory}
            >
                Ver Todas as Categorias
            </ListGroup.Item>
        </ListGroup>
    );
};

export default CategoryMenu;
