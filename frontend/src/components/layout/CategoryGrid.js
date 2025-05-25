import React from 'react';
import { Card, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';

const categories = [
  { id: 1, name: 'Informática', icon: 'fas fa-laptop' },
  { id: 2, name: 'Móveis', icon: 'fas fa-couch' },
  { id: 3, name: 'Roupas', icon: 'fas fa-tshirt' },
  { id: 4, name: 'Livros', icon: 'fas fa-book' },
  { id: 5, name: 'Brinquedos', icon: 'fas fa-gamepad' },
  { id: 6, name: 'Ferramentas', icon: 'fas fa-tools' },
  { id: 7, name: 'Veículos', icon: 'fas fa-car' },
  { id: 8, name: 'Imóveis', icon: 'fas fa-home' }
];

const CategoryGrid = () => (
  <Container className="py-4">
    <div className="d-flex flex-wrap justify-content-center gap-4">
      {categories.map(category => (
        <div key={category.id} className="category-card-wrapper">
          <Card as={Link} to={`/anuncios/categoria/${category.id}`} className="category-card">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
              <i className={`${category.icon} category-icon`}></i>
              <div className="category-name mt-2">{category.name}</div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  </Container>
);

export default CategoryGrid;
