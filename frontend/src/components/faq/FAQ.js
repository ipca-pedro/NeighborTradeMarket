import React from 'react';
import { Container, Accordion } from 'react-bootstrap';
import './FAQ.css';

const FAQ = () => {
    return (
        <Container className="faq-page py-5">
            <h1 className="text-center mb-4">Perguntas Frequentes</h1>
            
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Como criar uma conta?</Accordion.Header>
                    <Accordion.Body>
                        Para criar uma conta, clique no botão "Registrar" no topo da página. 
                        Preencha seus dados pessoais e aguarde a confirmação por email.
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                    <Accordion.Header>Como publicar um anúncio?</Accordion.Header>
                    <Accordion.Body>
                        Após fazer login, clique em "Criar Anúncio" e preencha todas as informações 
                        necessárias, incluindo título, descrição, preço e fotos do item.
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                    <Accordion.Header>Como funciona o sistema de trocas?</Accordion.Header>
                    <Accordion.Body>
                        Ao visualizar um anúncio, você pode propor uma troca clicando no botão 
                        "Propor Troca" e selecionando um dos seus itens para oferecer em troca.
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                    <Accordion.Header>Como entro em contato com o vendedor?</Accordion.Header>
                    <Accordion.Body>
                        Em cada anúncio, há um botão de "Contatar Vendedor" que permite iniciar 
                        uma conversa através do nosso sistema de mensagens interno.
                    </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                    <Accordion.Header>Como funciona a moderação de anúncios?</Accordion.Header>
                    <Accordion.Body>
                        Todos os anúncios passam por uma revisão antes de serem publicados para 
                        garantir que seguem nossas diretrizes de comunidade.
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default FAQ;
