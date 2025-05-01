import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
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
  <div className="category-grid-container">
    <Row xs={2} sm={3} md={4} lg={4} className="g-3">
      {categories.map(category => (
        <Col key={category.id}>
          <Card as={Link} to={`/anuncios/categoria/${category.id}`} className="category-card text-center h-100 shadow-sm border-0">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
              <i className={`${category.icon} category-icon mb-2`}></i>
              <div className="fw-semibold small mb-1">{category.name}</div>
            </Card.Body>
          </Card>
        </Col>
      ))}
      <Col>
        <Card as={Link} to="/categorias" className="category-card text-center h-100 shadow border-primary border-2">
          <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
            <span className="fw-bold text-primary">Ver Todas as Categorias</span>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

export default CategoryGrid;
