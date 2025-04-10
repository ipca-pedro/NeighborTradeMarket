import React from 'react';
import { Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';

const CategoryMenu = ({ onSelectCategory }) => {
    // Estas categorias devem ser carregadas da API em produção
    const categories = [
        { id: 1, name: 'Computador & Portátil', icon: 'fas fa-laptop', hasSubcategories: true },
        { id: 2, name: 'Acessórios de Computador', icon: 'fas fa-keyboard' },
        { id: 3, name: 'Smartphone', icon: 'fas fa-mobile-alt', hasSubcategories: true },
        { id: 4, name: 'Auscultadores', icon: 'fas fa-headphones' },
        { id: 5, name: 'Acessórios Móveis', icon: 'fas fa-tablet-alt' },
        { id: 6, name: 'Consola de Jogos', icon: 'fas fa-gamepad' },
        { id: 7, name: 'Câmara & Foto', icon: 'fas fa-camera' },
        { id: 8, name: 'TV & Eletrodomésticos', icon: 'fas fa-tv' },
        { id: 9, name: 'Relógios & Acessórios', icon: 'fas fa-clock' },
        { id: 10, name: 'GPS & Navegação', icon: 'fas fa-map-marker-alt' },
        { id: 11, name: 'Tecnologia Vestível', icon: 'fas fa-tshirt' }
    ];

    return (
        <ListGroup className="shadow-sm border">
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
                to="/anuncios/categorias"
                className="text-center fw-bold"
                onClick={onSelectCategory}
            >
                Ver Todas as Categorias
            </ListGroup.Item>
        </ListGroup>
    );
};

export default CategoryMenu;
