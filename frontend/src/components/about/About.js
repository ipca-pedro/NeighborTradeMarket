import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './About.css';

const About = () => {
    return (
        <Container className="about-page py-5">
            <Row>
                <Col>
                    <h1 className="text-center mb-4">Sobre o NegócioTrocas</h1>
                    <div className="about-content">
                        <p>
                            O NegócioTrocas é uma plataforma online que conecta pessoas interessadas em comprar, 
                            vender ou trocar produtos e serviços. Nossa missão é criar um ambiente seguro e 
                            confiável para transações entre usuários.
                        </p>
                        
                        <h3>Nossa História</h3>
                        <p>
                            Fundado em 2025, o NegócioTrocas surgiu da necessidade de criar um espaço 
                            dedicado para transações e trocas na comunidade local. Desde então, temos 
                            crescido e evoluído para melhor atender às necessidades dos nossos usuários.
                        </p>

                        <h3>Nossa Missão</h3>
                        <p>
                            Facilitar o processo de compra, venda e troca de produtos e serviços, 
                            promovendo uma economia colaborativa e sustentável.
                        </p>

                        <h3>Nossos Valores</h3>
                        <ul>
                            <li>Transparência nas transações</li>
                            <li>Segurança para os usuários</li>
                            <li>Compromisso com a comunidade</li>
                            <li>Sustentabilidade</li>
                        </ul>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default About;
