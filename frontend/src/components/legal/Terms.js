import React from 'react';
import { Container } from 'react-bootstrap';
import './Legal.css';

const Terms = () => {
    return (
        <Container className="legal-page py-5">
            <h1 className="text-center mb-4">Termos de Uso</h1>
            
            <div className="legal-content">
                <section>
                    <h3>1. Aceitação dos Termos</h3>
                    <p>
                        Ao usar o NegócioTrocas, você concorda com estes termos. Se não concordar,
                        por favor, não use nossa plataforma.
                    </p>
                </section>

                <section>
                    <h3>2. Uso da Plataforma</h3>
                    <p>
                        Ao usar nossa plataforma, você concorda em:
                    </p>
                    <ul>
                        <li>Fornecer informações verdadeiras</li>
                        <li>Não publicar conteúdo ilegal ou inadequado</li>
                        <li>Respeitar outros usuários</li>
                        <li>Não usar a plataforma para spam ou fraude</li>
                    </ul>
                </section>

                <section>
                    <h3>3. Anúncios e Transações</h3>
                    <p>
                        Os usuários são responsáveis por:
                    </p>
                    <ul>
                        <li>Descrições precisas dos itens</li>
                        <li>Preços justos e transparentes</li>
                        <li>Comunicação clara com outros usuários</li>
                        <li>Cumprimento dos acordos de troca ou venda</li>
                    </ul>
                </section>

                <section>
                    <h3>4. Responsabilidades</h3>
                    <p>
                        O NegócioTrocas não é responsável por:
                    </p>
                    <ul>
                        <li>Qualidade dos itens anunciados</li>
                        <li>Disputas entre usuários</li>
                        <li>Perdas ou danos em transações</li>
                        <li>Conteúdo gerado por usuários</li>
                    </ul>
                </section>
            </div>
        </Container>
    );
};

export default Terms;
