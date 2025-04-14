import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';

const categories = [
  { id: 1, name: 'Computador & Portátil', icon: 'fas fa-laptop' },
  { id: 2, name: 'Acessórios de Computador', icon: 'fas fa-keyboard' },
  { id: 3, name: 'Smartphone', icon: 'fas fa-mobile-alt' },
  { id: 4, name: 'Auscultadores', icon: 'fas fa-headphones' },
  { id: 5, name: 'Acessórios Móveis', icon: 'fas fa-tablet-alt' },
  { id: 6, name: 'Consola de Jogos', icon: 'fas fa-gamepad' },
  { id: 7, name: 'Câmara & Foto', icon: 'fas fa-camera' },
  { id: 8, name: 'TV & Eletrodomésticos', icon: 'fas fa-tv' }
];

const CategoryGrid = () => (
  <div className="category-grid-container">
    <Row xs={2} sm={3} md={4} lg={5} className="g-3">
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
        <Card as={Link} to="/anuncios/categorias" className="category-card text-center h-100 shadow border-primary border-2">
          <Card.Body className="d-flex flex-column align-items-center justify-content-center py-4">
            <span className="fw-bold text-primary">Ver Todas as Categorias</span>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </div>
);

export default CategoryGrid;
