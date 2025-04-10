# Testes Postman para a API NT

Este documento contém uma série de testes para validar as funcionalidades da API NT usando o Postman. Organize as requisições em pastas conforme as categorias abaixo.

## Configuração Inicial

1. Crie uma variável de ambiente no Postman chamada `base_url` com o valor `http://localhost/NT/public/api`
2. Crie uma variável de ambiente `token` que será preenchida automaticamente após o login

## 1. Autenticação e Gestão de Utilizadores

### 1.1 Login (Admin)
- **Método**: POST
- **URL**: `{{base_url}}/auth/login`
- **Body** (JSON):
```json
{
    "email": "admin@example.com",
    "password": "password"
}
Testes (JavaScript):
javascript
CopyInsert
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

var jsonData = pm.response.json();
pm.test("Token is present", function () {
    pm.expect(jsonData.token).to.be.a('string');
    pm.environment.set("token", jsonData.token);
});
1.2 Login (Utilizador Normal)
Método: POST
URL: {{base_url}}/auth/login
Body (JSON):
json
CopyInsert
{
    "email": "user@example.com",
    "password": "password"
}
Testes (JavaScript):
javascript
CopyInsert
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

var jsonData = pm.response.json();
pm.test("Token is present", function () {
    pm.expect(jsonData.token).to.be.a('string');
    pm.environment.set("token", jsonData.token);
});
1.3 Registro de Novo Utilizador
Método: POST
URL: {{base_url}}/auth/register
Body (form-data):
User_Name: "novousuario"
Name: "Novo Usuário"
Email: "novo@example.com"
Password: "password"
Password_confirmation: "password"
Data_Nascimento: "1990-01-01"
CC: "12345678"
MoradaID_Morada: "1"
comprovativo_morada: [arquivo PDF ou imagem]
1.4 Obter Perfil do Utilizador
Método: GET
URL: {{base_url}}/perfil
Headers:
Authorization: Bearer {{token}}
1.5 Atualizar Perfil do Utilizador
Método: POST
URL: {{base_url}}/perfil
Headers:
Authorization: Bearer {{token}}
Body (form-data):
Name: "Nome Atualizado"
Email: "atual@example.com"
MoradaID_Morada: "2"
foto_perfil: [arquivo de imagem] (opcional)
1.6 Logout
Método: POST
URL: {{base_url}}/auth/logout
Headers:
Authorization: Bearer {{token}}
2. Funcionalidades de Administrador
2.1 Listar Utilizadores Pendentes
Método: GET
URL: {{base_url}}/admin/users/pending
Headers:
Authorization: Bearer {{token}} (usar token de admin)
2.2 Listar Todos os Utilizadores
Método: GET
URL: {{base_url}}/admin/users
Headers:
Authorization: Bearer {{token}} (usar token de admin)
2.3 Aprovar Utilizador
Método: POST
URL: {{base_url}}/admin/users/{userId}/approve
Headers:
Authorization: Bearer {{token}} (usar token de admin)
Body (JSON):
json
CopyInsert
{
    "comentario": "Aprovado pelo administrador"
}
2.4 Rejeitar Utilizador
Método: POST
URL: {{base_url}}/admin/users/{userId}/reject
Headers:
Authorization: Bearer {{token}} (usar token de admin)
Body (JSON):
json
CopyInsert
{
    "comentario": "Documentação inválida"
}
3. Gestão de Anúncios
3.1 Listar Categorias
Método: GET
URL: {{base_url}}/categorias
Headers:
Authorization: Bearer {{token}}
3.2 Listar Tipos de Item
Método: GET
URL: {{base_url}}/tipos-item
Headers:
Authorization: Bearer {{token}}
3.3 Criar Anúncio
Método: POST
URL: {{base_url}}/anuncios
Headers:
Authorization: Bearer {{token}}
Body (form-data):
Titulo: "iPhone 12 Pro Max"
Descricao: "iPhone 12 Pro Max em excelente estado"
Preco: "800.00"
Tipo_ItemID_Tipo: "1" (Produto)
CategoriaID_Categoria: "1" (Eletrônicos)
imagens[]: [arquivo de imagem 1]
imagens[]: [arquivo de imagem 2] (opcional)
3.4 Listar Todos os Anúncios
Método: GET
URL: {{base_url}}/anuncios
Headers:
Authorization: Bearer {{token}}
3.5 Listar Meus Anúncios
Método: GET
URL: {{base_url}}/meus-anuncios
Headers:
Authorization: Bearer {{token}}
3.6 Ver Detalhes de um Anúncio
Método: GET
URL: {{base_url}}/anuncios/{id}
Headers:
Authorization: Bearer {{token}}
3.7 Atualizar Anúncio
Método: PUT
URL: {{base_url}}/anuncios/{id}
Headers:
Authorization: Bearer {{token}}
Body (form-data):
Titulo: "iPhone 12 Pro Max - Atualizado"
Descricao: "iPhone 12 Pro Max em excelente estado, com garantia"
Preco: "750.00"
3.8 Marcar Anúncio como Vendido
Método: POST
URL: {{base_url}}/anuncios/{id}/sold
Headers:
Authorization: Bearer {{token}}
3.9 Excluir Anúncio
Método: DELETE
URL: {{base_url}}/anuncios/{id}
Headers:
Authorization: Bearer {{token}}
4. Sistema de Mensagens
4.1 Listar Conversas
Método: GET
URL: {{base_url}}/conversas
Headers:
Authorization: Bearer {{token}}
4.2 Ver Mensagens de um Anúncio
Método: GET
URL: {{base_url}}/mensagens/{anuncioId}
Headers:
Authorization: Bearer {{token}}
4.3 Enviar Mensagem
Método: POST
URL: {{base_url}}/mensagens
Headers:
Authorization: Bearer {{token}}
Body (JSON):
json
CopyInsert
{
    "ItemID_Item": 1,
    "Conteudo": "Olá, este produto ainda está disponível?"
}
4.4 Responder Mensagem
Método: POST
URL: {{base_url}}/mensagens/{anuncioId}/responder
Headers:
Authorization: Bearer {{token}}
Body (JSON):
json
CopyInsert
{
    "Conteudo": "Sim, ainda está disponível.",
    "UtilizadorID_Destinatario": 2
}
4.5 Marcar Mensagens como Lidas
Método: POST
URL: {{base_url}}/mensagens/{anuncioId}/lidas
Headers:
Authorization: Bearer {{token}}
Body (JSON):
json
CopyInsert
{
    "UtilizadorID_Remetente": 2
}
4.6 Contar Mensagens Não Lidas
Método: GET
URL: {{base_url}}/mensagens/nao-lidas/contar
Headers:
Authorization: Bearer {{token}}
5. Sistema de Trocas
5.1 Listar Trocas
Método: GET
URL: {{base_url}}/trocas
Headers:
Authorization: Bearer {{token}}
5.2 Ver Detalhes de uma Troca
Método: GET
URL: {{base_url}}/trocas/{id}
Headers:
Authorization: Bearer {{token}}
5.3 Propor Troca
Método: POST
URL: {{base_url}}/trocas
Headers:
Authorization: Bearer {{token}}
Body (JSON):
json
CopyInsert
{
    "ItemID_ItemOferecido": 2,
    "ItemID_Solicitado": 1,
    "Mensagem": "Gostaria de trocar meu produto pelo seu."
}
5.4 Aceitar Troca
Método: POST
URL: {{base_url}}/trocas/{id}/aceitar
Headers:
Authorization: Bearer {{token}}
5.5 Rejeitar Troca
Método: POST
URL: {{base_url}}/trocas/{id}/rejeitar
Headers:
Authorization: Bearer {{token}}
5.6 Cancelar Troca
Método: POST
URL: {{base_url}}/trocas/{id}/cancelar
Headers:
Authorization: Bearer {{token}}
5.7 Listar Trocas Recebidas Pendentes
Método: GET
URL: {{base_url}}/trocas/recebidas/pendentes
Headers:
Authorization: Bearer {{token}}
5.8 Listar Trocas Enviadas Pendentes
Método: GET
URL: {{base_url}}/trocas/enviadas/pendentes
Headers:
Authorization: Bearer {{token}}
6. Sistema de Avaliações
6.1 Listar Notas Disponíveis
Método: GET
URL: {{base_url}}/avaliacoes/notas
Headers:
Authorization: Bearer {{token}}
6.2 Listar Avaliações Recebidas
Método: GET
URL: {{base_url}}/avaliacoes/recebidas
Headers:
Authorization: Bearer {{token}}
6.3 Listar Avaliações Enviadas
Método: GET
URL: {{base_url}}/avaliacoes/enviadas
Headers:
Authorization: Bearer {{token}}
6.4 Ver Detalhes de uma Avaliação
Método: GET
URL: {{base_url}}/avaliacoes/{id}
Headers:
Authorization: Bearer {{token}}
6.5 Avaliar uma Compra
Método: POST
URL: {{base_url}}/avaliacoes/compra
Headers:
Authorization: Bearer {{token}}
Body (JSON):
json
CopyInsert
{
    "OrdemID_Produto": 1,
    "NotaID_Nota": 5,
    "Comentario": "Ótimo produto, entrega rápida!"
}
6.6 Responder a uma Avaliação
Método: POST
URL: {{base_url}}/avaliacoes/{id}/responder
Headers:
Authorization: Bearer {{token}}
Body (JSON):
json
CopyInsert
{
    "Resposta": "Obrigado pelo feedback positivo!"
}
6.7 Listar Avaliações Pendentes
Método: GET
URL: {{base_url}}/avaliacoes/pendentes
Headers:
Authorization: Bearer {{token}}
6.8 Ver Estatísticas de Avaliações
Método: GET
URL: {{base_url}}/avaliacoes/estatisticas
Headers:
Authorization: Bearer {{token}}
7. Sistema de Notificações
7.1 Listar Todas as Notificações
Método: GET
URL: {{base_url}}/notificacoes
Headers:
Authorization: Bearer {{token}}
7.2 Listar Notificações Não Lidas
Método: GET
URL: {{base_url}}/notificacoes/nao-lidas
Headers:
Authorization: Bearer {{token}}
7.3 Ver Detalhes de uma Notificação
Método: GET
URL: {{base_url}}/notificacoes/{id}
Headers:
Authorization: Bearer {{token}}
7.4 Marcar Notificação como Lida
Método: POST
URL: {{base_url}}/notificacoes/{id}/lida
Headers:
Authorization: Bearer {{token}}
7.5 Marcar Todas as Notificações como Lidas
Método: POST
URL: {{base_url}}/notificacoes/todas-lidas
Headers:
Authorization: Bearer {{token}}
7.6 Excluir Notificação
Método: DELETE
URL: {{base_url}}/notificacoes/{id}
Headers:
Authorization: Bearer {{token}}
7.7 Excluir Todas as Notificações Lidas
Método: DELETE
URL: {{base_url}}/notificacoes/lidas
Headers:
Authorization: Bearer {{token}}
7.8 Contar Notificações Não Lidas
Método: GET
URL: {{base_url}}/notificacoes/nao-lidas/contar
Headers:
Authorization: Bearer {{token}}
8. Sistema de Compras
8.1 Listar Compras
Método: GET
URL: {{base_url}}/compras
Headers:
Authorization: Bearer {{token}}
8.2 Listar Vendas
Método: GET
URL: {{base_url}}/vendas
Headers:
Authorization: Bearer {{token}}
8.3 Ver Detalhes de uma Compra
Método: GET
URL: {{base_url}}/compras/{id}
Headers:
Authorization: Bearer {{token}}
8.4 Realizar uma Compra
Método: POST
URL: {{base_url}}/compras
Headers:
Authorization: Bearer {{token}}
Body (JSON):
json
CopyInsert
{
    "AnuncioID_Anuncio": 1,
    "Quantidade": 1,
    "Endereco_entrega": "Rua do Comprador, 123",
    "Metodo_pagamento": "Cartão de Crédito"
}
8.5 Atualizar Status de uma Compra
Método: PUT
URL: {{base_url}}/compras/{id}/status
Headers:
Authorization: Bearer {{token}}
Body (JSON):
json
CopyInsert
{
    "Status_CompraID_Status_Compra": 2
}
8.6 Cancelar uma Compra
Método: POST
URL: {{base_url}}/compras/{id}/cancelar
Headers:
Authorization: Bearer {{token}}
8.7 Confirmar Recebimento
Método: POST
URL: {{base_url}}/compras/{id}/confirmar-recebimento
Headers:
Authorization: Bearer {{token}}
8.8 Listar Opções de Status de Compra
Método: GET
URL: {{base_url}}/compras/status/opcoes
Headers:
Authorization: Bearer {{token}}
8.9 Listar Vendas Pendentes
Método: GET
URL: {{base_url}}/vendas/pendentes
Headers:
Authorization: Bearer {{token}}
Fluxos de Teste Completos
Fluxo 1: Registro e Login
Registrar novo utilizador
Login com o novo utilizador
Ver perfil do utilizador
Atualizar perfil do utilizador
Logout
Fluxo 2: Administração de Utilizadores
Login como administrador
Listar utilizadores pendentes
Aprovar um utilizador pendente
Listar todos os utilizadores
Logout
Fluxo 3: Criação e Gestão de Anúncios
Login como utilizador normal
Listar categorias e tipos de item
Criar um anúncio
Listar meus anúncios
Ver detalhes do anúncio criado
Atualizar o anúncio
Marcar anúncio como vendido ou excluir anúncio
Logout
Fluxo 4: Sistema de Mensagens
Login como utilizador 1
Criar um anúncio
Logout
Login como utilizador 2
Ver detalhes do anúncio do utilizador 1
Enviar mensagem sobre o anúncio
Logout
Login como utilizador 1
Ver conversas
Ver mensagens do anúncio
Responder à mensagem
Logout
Fluxo 5: Sistema de Trocas
Login como utilizador 1
Criar um anúncio A
Logout
Login como utilizador 2
Criar um anúncio B
Ver detalhes do anúncio A
Propor troca do anúncio B pelo anúncio A
Logout
Login como utilizador 1
Ver trocas recebidas pendentes
Ver detalhes da troca
Aceitar ou rejeitar a troca
Logout
Fluxo 6: Sistema de Compras e Avaliações
Login como utilizador 1
Criar um anúncio
Logout
Login como utilizador 2
Ver detalhes do anúncio
Realizar uma compra
Logout
Login como utilizador 1
Ver vendas pendentes
Atualizar status da compra para "Enviado"
Logout
Login como utilizador 2
Ver compras
Confirmar recebimento
Avaliar a compra
Logout
Login como utilizador 1
Ver avaliações recebidas
Responder à avaliação
Logout