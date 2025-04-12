// Respostas pré-definidas para o chatbot
const chatResponses = {
    criarAnuncio: {
        text: 'Para criar um anúncio, siga estes passos:\n1. Faça login na sua conta\n2. Clique no botão "Criar Anúncio"\n3. Preencha os detalhes do produto\n4. Adicione fotos\n5. Clique em "Publicar"',
        options: ['Como fazer login?', 'Tipos de anúncios permitidos', 'Voltar ao início']
    },
    comoComprar: {
        text: 'O processo de compra é simples:\n1. Encontre o produto desejado\n2. Clique em "Ver Detalhes"\n3. Entre em contato com o vendedor\n4. Combine o pagamento e a entrega',
        options: ['Métodos de pagamento', 'Segurança na compra', 'Voltar ao início']
    },
    devolucao: {
        text: 'Nossa política de devolução:\n- 7 dias para desistência da compra\n- Produto deve estar nas condições originais\n- Entre em contato com o vendedor primeiro',
        options: ['Como solicitar devolução', 'Prazos de devolução', 'Voltar ao início']
    },
    inicio: {
        text: 'Como posso ajudar?',
        options: [
            'Como criar um anúncio?',
            'Como funciona a compra?',
            'Políticas de devolução',
            'Outro assunto'
        ]
    },
    outro: {
        text: 'Para esse assunto, recomendo entrar em contato com nossa equipe por email: info@neighbortrade.com',
        options: ['Voltar ao início']
    }
};

export default chatResponses;
