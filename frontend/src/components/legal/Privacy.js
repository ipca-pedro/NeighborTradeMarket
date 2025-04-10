import React from 'react';
import { Container } from 'react-bootstrap';
import './Legal.css';

const Privacy = () => {
    return (
        <Container className="legal-page py-5">
            <h1 className="text-center mb-4">Política de Privacidade</h1>
            
            <div className="legal-content">
                <section>
                    <h3>1. Informações que Coletamos</h3>
                    <p>
                        Coletamos apenas as informações necessárias para o funcionamento da plataforma:
                    </p>
                    <ul>
                        <li>Nome e email para identificação</li>
                        <li>Dados de contato para comunicação</li>
                        <li>Informações dos anúncios publicados</li>
                        <li>Histórico de transações</li>
                    </ul>
                </section>

                <section>
                    <h3>2. Como Usamos suas Informações</h3>
                    <p>
                        Suas informações são utilizadas para:
                    </p>
                    <ul>
                        <li>Manter sua conta ativa e segura</li>
                        <li>Facilitar comunicação entre usuários</li>
                        <li>Melhorar nossos serviços</li>
                        <li>Prevenir fraudes e abusos</li>
                    </ul>
                </section>

                <section>
                    <h3>3. Proteção de Dados</h3>
                    <p>
                        Utilizamos medidas de segurança técnicas e organizacionais para proteger 
                        suas informações pessoais contra acesso não autorizado, alteração, 
                        divulgação ou destruição.
                    </p>
                </section>

                <section>
                    <h3>4. Seus Direitos</h3>
                    <p>
                        Você tem direito a:
                    </p>
                    <ul>
                        <li>Acessar seus dados pessoais</li>
                        <li>Corrigir dados incorretos</li>
                        <li>Solicitar exclusão de dados</li>
                        <li>Revogar consentimento</li>
                    </ul>
                </section>
            </div>
        </Container>
    );
};

export default Privacy;
