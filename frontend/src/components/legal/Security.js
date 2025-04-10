import React from 'react';
import { Container } from 'react-bootstrap';
import './Legal.css';

const Security = () => {
    return (
        <Container className="legal-page py-5">
            <h1 className="text-center mb-4">Política de Segurança</h1>
            
            <div className="legal-content">
                <section>
                    <h3>1. Segurança da Conta</h3>
                    <p>
                        Recomendações para manter sua conta segura:
                    </p>
                    <ul>
                        <li>Use senhas fortes e únicas</li>
                        <li>Ative autenticação de dois fatores</li>
                        <li>Nunca compartilhe suas credenciais</li>
                        <li>Mantenha seu email de recuperação atualizado</li>
                    </ul>
                </section>

                <section>
                    <h3>2. Transações Seguras</h3>
                    <p>
                        Para transações seguras:
                    </p>
                    <ul>
                        <li>Use apenas o sistema de mensagens da plataforma</li>
                        <li>Verifique o perfil e avaliações do usuário</li>
                        <li>Encontre-se em locais públicos e seguros</li>
                        <li>Documente todo o processo de troca ou venda</li>
                    </ul>
                </section>

                <section>
                    <h3>3. Proteção de Dados</h3>
                    <p>
                        Nossas medidas de segurança incluem:
                    </p>
                    <ul>
                        <li>Criptografia de ponta a ponta</li>
                        <li>Monitoramento contínuo</li>
                        <li>Backups regulares</li>
                        <li>Atualizações de segurança</li>
                    </ul>
                </section>

                <section>
                    <h3>4. Denúncias</h3>
                    <p>
                        Se encontrar atividade suspeita:
                    </p>
                    <ul>
                        <li>Use o botão de denúncia nos anúncios</li>
                        <li>Reporte usuários suspeitos</li>
                        <li>Informe tentativas de fraude</li>
                        <li>Entre em contato com nossa equipe de segurança</li>
                    </ul>
                </section>
            </div>
        </Container>
    );
};

export default Security;
