# NeighborTrade - Sistema de Negócios e Trocas

Plataforma para compra, venda e troca de produtos/serviços com sistema de aprovação entre vizinhos.

## Guia de Instalação e Configuração

### Pré-requisitos

- **PHP**: Versão 8.2 ou superior
- **Composer**: Última versão
- **MySQL**: Versão 5.7 ou superior
- **Node.js**: Versão 16.x ou superior
- **npm**: Versão 8.x ou superior
- **XAMPP**: Para ambiente de desenvolvimento local (opcional, mas recomendado)
- **Git**: Para clonar o repositório

### Instalação do Projeto

#### 1. Clonar o Repositório Principal

```bash
git clone https://github.com/ipca-pedro/NeighborTrade.git
cd NeighborTrade
```

#### 2. Configurar o Frontend

O diretório `frontend` contém a aplicação React.js e está totalmente integrado ao repositório principal. Para configurá-lo:

```bash
# Navegue até o diretório frontend
cd frontend

# Instale as dependências
npm install
```

#### 2. Configurar o Backend (Laravel)

1. **Instalar Dependências PHP**:
   ```bash
   composer install
   ```

2. **Configurar Variáveis de Ambiente**:
   - Copie o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - Abra o arquivo `.env` e configure as seguintes variáveis:
     ```
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=neighbortrade
     DB_USERNAME=seu_usuario
     DB_PASSWORD=sua_senha
     ```

3. **Gerar Chave da Aplicação**:
   ```bash
   php artisan key:generate
   ```

4. **Criar o Banco de Dados**:
   - Crie um banco de dados MySQL chamado `neighbortrade`
   - Ou importe o arquivo `ER.sql` que contém a estrutura completa do banco de dados

5. **Executar Migrations** (se não importou o ER.sql):
   ```bash
   php artisan migrate
   ```

6. **Criar Link Simbólico para Storage**:
   ```bash
   php artisan storage:link
   ```

#### 3. Configurar o Frontend (React)

1. **Navegar até a pasta do frontend**:
   ```bash
   cd frontend
   ```

2. **Instalar Dependências JavaScript**:
   ```bash
   npm install
   ```

### Executando o Projeto

#### 1. Iniciar o Servidor Backend

```bash
# Na pasta raiz do projeto
php artisan serve
```
O servidor estará disponível em `http://localhost:8000`

#### 2. Iniciar o Frontend

```bash
# Na pasta frontend
npm start
```
O frontend estará disponível em `http://localhost:3000`

### Configurações Adicionais

#### CORS (Cross-Origin Resource Sharing)

O projeto já possui um arquivo de configuração CORS em `config/cors.php`. Se estiver enfrentando problemas de CORS, verifique se este arquivo está configurado corretamente:

```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],  // Em produção, especifique os domínios permitidos
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

#### Armazenamento de Imagens

O projeto utiliza o sistema de armazenamento do Laravel para salvar imagens de perfil e produtos:

1. Certifique-se de que as pastas `storage/app/public/perfil` e `storage/app/public/produtos` existam e tenham permissões de escrita
2. Se estiver usando Windows/XAMPP, verifique se o usuário do servidor web tem permissões de escrita nessas pastas

#### Banco de Dados

O arquivo `ER.sql` na raiz do projeto contém toda a estrutura do banco de dados, incluindo tabelas para:
- Utilizadores
- Moradas
- Anúncios
- Notificações
- Imagens
- Tokens de autenticação

### Solução de Problemas Comuns

1. **Erro de conexão com o banco de dados**:
   - Verifique se o serviço MySQL está em execução
   - Confirme as credenciais no arquivo `.env`
   - Certifique-se de que o banco de dados `neighbortrade` existe

2. **Erro ao carregar moradas no frontend**:
   - Verifique se o servidor backend está em execução
   - Confirme se a configuração CORS está correta
   - Verifique se existem moradas cadastradas no banco de dados

3. **Erro ao fazer upload de imagens**:
   - Verifique as permissões das pastas de armazenamento
   - Confirme se o link simbólico foi criado corretamente
   - Verifique os limites de tamanho de upload no PHP (`php.ini`)

4. **Problemas com o diretório frontend**:
   - Se o `npm install` falhar, verifique se o Node.js está instalado e atualizado
   - Se houver erros de dependências, tente executar `npm install --legacy-peer-deps`
   - Lembre-se que o frontend agora faz parte do repositório principal, então todas as alterações devem ser commitadas no repositório principal

### Estrutura do Projeto
- **Backend**: Laravel (PHP)
- **Frontend**: React.js
- **Banco de Dados**: MySQL

### Endpoints Disponíveis

#### Autenticação
1. **Registo de Utilizador**
   - Método: POST
   - URL: `/api/auth/register`
   - Descrição: Regista um novo utilizador no sistema

2. **Login**
   - Método: POST
   - URL: `/api/auth/login`
   - Descrição: Autentica um utilizador e retorna um token

3. **Logout**
   - Método: POST
   - URL: `/api/auth/logout`
   - Descrição: Termina a sessão do utilizador

#### Moradas
1. **Listar Moradas**
   - Método: GET
   - URL: `/api/moradas`
   - Descrição: Retorna todas as moradas disponíveis para registo

2. **Criar Morada**
   - Método: POST
   - URL: `/api/moradas`
   - Descrição: Adiciona uma nova morada ao sistema

#### Anúncios
1. **Listar Anúncios**
   - Método: GET
   - URL: `/api/anuncios`
   - Descrição: Retorna lista de anúncios em destaque

2. **Procurar Anúncios**
   - Método: GET
   - URL: `/api/anuncios/procurar?termo=termo`
   - Descrição: Busca anúncios por título ou descrição

3. **Anúncios por Tipo**
   - Método: GET
   - URL: `/api/anuncios/tipo/{tipoId}`
   - Descrição: Lista anúncios por tipo (1: Produto, 2: Serviço)

4. **Anúncios por Categoria**
   - Método: GET
   - URL: `/api/anuncios/categoria/{categoriaId}`
   - Descrição: Lista anúncios de uma categoria específica

5. **Detalhes do Anúncio**
   - Método: GET
   - URL: `/api/anuncios/{id}`
   - Descrição: Retorna detalhes de um anúncio específico

### Como Testar

1. **Usando o Arquivo de Testes JSON**
   - Um arquivo `testes_api.json` foi criado na raiz do projeto com exemplos de requisições para todos os endpoints
   - Importe este arquivo no Postman para testar rapidamente a API
   - Crie uma nova requisição
   - Selecione o método (GET, POST, etc)
   - Digite a URL (ex: `http://localhost:8000/api/anuncios`)
   - Clique em Send

2. **Usando cURL**
   ```bash
   # Listar anúncios
   curl http://localhost:8000/api/anuncios

   # Buscar anúncios
   curl http://localhost:8000/api/anuncios/buscar?q=computador

   # Anúncios por tipo
   curl http://localhost:8000/api/anuncios/tipo/1
   ```

3. **Usando o Navegador**
   - Para endpoints GET, você pode simplesmente acessar a URL no navegador
   - Ex: `http://localhost:8000/api/anuncios`

### Respostas da API

- **Sucesso**: Status 200 com JSON dos dados
- **Erro de Validação**: Status 400 com mensagem de erro
- **Não Encontrado**: Status 404 com mensagem
- **Erro do Servidor**: Status 500 com mensagem

### Exemplos de Resposta

```json
// GET /api/anuncios
{
    "data": [
        {
            "ID_Item": 1,
            "Titulo": "Notebook Dell",
            "Descricao": "Notebook em ótimo estado",
            "Preco": 2500.00,
            "vendedor": {
                "Name": "João Silva"
            },
            "imagens": [
                {
                    "Caminho": "produtos/notebook.jpg"
                }
            ]
        }
    ]
}

// GET /api/anuncios/buscar?q=notebook
{
    "termo": "notebook",
    "resultados": [...],
    "total": 5
}
```

### Dicas de Teste

1. **Teste diferentes cenários**:
   - Busca com termo vazio
   - Busca com termo inválido
   - Categoria inexistente
   - ID de anúncio inválido

2. **Verifique os headers**:
   - Content-Type deve ser application/json
   - Verifique códigos de status HTTP

3. **Teste paginação e limites**:
   - Grande volume de resultados
   - Diferentes ordenações

4. **Teste campos obrigatórios**:
   - Envio de dados incompletos
   - Formatos inválidos

## Controllers e Endpoints

### 1. AuthController - Autenticação

#### `POST /auth/register`
- Registro de usuário com foto de perfil
- Validações: email único, senha forte, CC único
- Cria morada e salva foto de perfil
- Status inicial: Pendente de aprovação

#### `POST /auth/login`
- Login com email/senha
- Verifica status do usuário
- Retorna token JWT e tipo de usuário

#### `GET /auth/profile`
- Retorna perfil do usuário logado
- Inclui: morada, imagem, tipo, status
- Lista anúncios ativos do usuário

### 2. AnuncioController - Anúncios

#### `GET /anuncios`
- Lista todos anúncios ativos
- Inclui: vendedor, imagens, categoria
- Ordenado por mais recentes

#### `GET /anuncios/{id}`
- Detalhes de um anúncio específico
- Inclui: vendedor, categoria, todas as imagens

#### `POST /anuncios`
- Cria novo anúncio com múltiplas imagens
- Validações: título, descrição, preço
- Status inicial: Pendente de aprovação

#### `GET /anuncios/categoria/{id}`
- Lista anúncios por categoria
- Apenas ativos e aprovados
- Inclui imagem principal

#### `GET /anuncios/vendedor/{id}`
- Lista anúncios de um vendedor
- Apenas ativos e aprovados
- Inclui imagem principal

#### `DELETE /anuncios/{id}`
- Soft delete do anúncio
- Apenas o dono pode deletar
- Muda status para "Eliminado"

### 3. AdminController - Administração

#### `GET /admin/usuarios/pendentes`
- Lista usuários aguardando aprovação
- Inclui: morada, foto, dados pessoais

#### `POST /admin/usuarios/{id}/aprovar`
- Aprova/rejeita usuário
- Requer motivo se rejeitado
- Cria registro de aprovação

#### `GET /admin/anuncios/pendentes`
- Lista anúncios aguardando aprovação
- Inclui: vendedor, imagens, categoria

#### `POST /admin/anuncios/{id}/aprovar`
- Aprova/rejeita anúncio
- Requer motivo se rejeitado
- Cria registro de aprovação

#### `GET /admin/dashboard`
- Estatísticas gerais
- Total de usuários e anúncios
- Itens pendentes de aprovação

### 4. PasswordResetController - Reset de Senha

#### `POST /password/forgot`
- Solicita reset de senha
- Gera token único
- Validade: 24 horas

#### `POST /password/reset`
- Valida token
- Atualiza senha
- Remove token usado

## Estrutura do Banco de Dados

### Tabelas Principais
- `utilizador`: Usuários do sistema
- `anuncio`: Anúncios de produtos/serviços
- `imagem`: Fotos de perfil e anúncios
- `morada`: Endereços dos usuários
- `aprovacao`: Registros de aprovações

### Tabelas de Suporte
- `categoria`: Tipos de anúncios
- `tipo_item`: Classificação dos itens
- `status_anuncio`: Estados do anúncio
- `status_utilizador`: Estados do usuário

### Tabelas de Relacionamento
- `item_imagem`: Relaciona anúncios com imagens
- `password_resets`: Tokens de reset de senha

## Próximas Funcionalidades

1. **Chat**
   - Mensagens entre usuários
   - Notificações em tempo real

2. **Pagamentos**
   - Integração com gateway
   - Histórico de transações

3. **Trocas**
   - Proposta de troca
   - Negociação
   - Avaliações

## Como Usar

1. Clone o repositório
2. Configure o `.env`
3. Instale dependências:
   ```bash
   composer install
   ```
4. Inicie o servidor:
   ```bash
   php artisan serve
   ```

## Documentação da API

A documentação completa da API está disponível em `/api/documentation`.

## Extensões VS Code Recomendadas

### PHP
- `bmewburn.vscode-intelephense-client`: Intelephense - Suporte completo para PHP
- `xdebug.php-debug`: PHP Debug - Para debugging com Xdebug
- `MehediDracula.php-namespace-resolver`: PHP Namespace Resolver - Auto-importação de classes
- `neilbrayfield.php-docblocker`: PHP DocBlocker - Gera documentação PHPDoc
- `onecentlin.laravel-blade`: Laravel Blade Snippets - Suporte para templates Blade

### JavaScript/React (Frontend)
- `dbaeumer.vscode-eslint`: ESLint - Linting para JavaScript
- `esbenp.prettier-vscode`: Prettier - Formatação de código
- `dsznajder.es7-react-js-snippets`: ES7+ React/Redux/React-Native snippets

### Git
- `eamodio.gitlens`: GitLens - Histórico e blame do Git
- `mhutchie.git-graph`: Git Graph - Visualização do histórico Git

### Database
- `mtxr.sqltools`: SQLTools - Gerenciamento de banco de dados
- `mtxr.sqltools-driver-mysql`: SQLTools MySQL/MariaDB - Driver para MySQL

### Utilidades
- `mikestead.dotenv`: DotENV - Suporte para arquivos .env
- `christian-kohler.path-intellisense`: Path Intellisense - Autocompletar caminhos
- `formulahendry.auto-rename-tag`: Auto Rename Tag - Renomeia tags HTML/XML
- `rangav.vscode-thunder-client`: Thunder Client - Cliente REST API

### Temas e Ícones
- `PKief.material-icon-theme`: Material Icon Theme - Ícones bonitos
- `zhuangtongfa.material-theme`: One Dark Pro - Tema escuro popular

### Como Instalar
1. Abra o VS Code
2. Pressione `Ctrl+P`
3. Cole: `ext install` seguido do ID da extensão
4. Ou pesquise pelo nome na aba de extensões (`Ctrl+Shift+X`)

Plataforma comunitária para compra, venda e troca de produtos e serviços.

## Estrutura do Projeto

### Backend (Laravel)

#### Controllers
- `AuthController`: Gerencia autenticação, registro e perfil de usuários
- `AnuncioController`: CRUD de anúncios e gerenciamento de imagens
- `AdminController`: Aprovação de usuários e anúncios

#### Models
Modelos principais:
- `Utilizador`: Usuários do sistema
- `Anuncio`: Anúncios de produtos/serviços
- `Imagem`: Gerenciamento de imagens
- `Morada`: Endereços

Modelos de suporte:
- `Categoria`: Tipos de anúncios (produtos, serviços)
- `TipoItem`: Classificação do item (físico, digital, serviço)
- `StatusAnuncio`: Estados do anúncio (ativo, pendente, vendido)
- `StatusUtilizador`: Estados do usuário (ativo, pendente, bloqueado)

### Frontend (React)

#### Páginas
- `HomePage`: Landing page com categorias e produtos em destaque
- `Login/Register`: Formulários de autenticação
- `AnuncioForm`: Criação/edição de anúncios
- `AnuncioDetails`: Detalhes do anúncio com imagens

## Funcionalidades Implementadas

1. **Autenticação**
   - Registro com validação de dados
   - Upload de foto de perfil
   - Login com verificação de status
   - Aprovação de usuários por admin

2. **Anúncios**
   - Criação com múltiplas imagens
   - Categorização (produto/serviço)
   - Listagem com filtros
   - Aprovação por admin

3. **Landing Page**
   - Banner principal
   - Categorias em destaque
   - Produtos recentes
   - Busca avançada

## Próximos Passos

1. **Chat**
   - Implementar sistema de mensagens entre usuários
   - Notificações em tempo real

2. **Transações**
   - Sistema de pagamento
   - Histórico de compras/vendas
   - Avaliações

3. **Sistema de Trocas**
   - Proposta de troca
   - Negociação
   - Avaliação pós-troca

## Configuração

1. Clone o repositório
2. Configure o arquivo `.env` com suas credenciais de banco de dados
3. Instale as dependências:
   ```bash
   composer install    # Backend
   cd frontend && npm install  # Frontend
   ```
4. Inicie os servidores:
   ```bash
   php artisan serve         # Backend
   cd frontend && npm start  # Frontend
   ```

## Contribuição

Para contribuir:
1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Faça commit das alterações
4. Faça push para a branch
5. Abra um Pull Request

## Configuração do Ambiente de Desenvolvimento

### Requisitos Prévios

1. [XAMPP](https://www.apachefriends.org/download.html) - Servidor local Apache e MySQL
2. [Composer](https://getcomposer.org/download/) - Gestor de dependências PHP
3. [Node.js](https://nodejs.org/) - Ambiente de execução JavaScript
4. [Git](https://git-scm.com/downloads) - Sistema de controlo de versões

### Configuração Passo a Passo

1. **Clonar o Projeto na pasta C:\xampp\htdocs**
```bash
git clone https://github.com/ipca-pedro/NeighborTrade
cd NT
```

2. **Configurar Base de Dados**
- Iniciar Apache e MySQL no Painel de Controlo do XAMPP
- Aceder ao http://localhost/phpmyadmin
- Criar uma nova base de dados com o nome 'nt'

3. **Configurar Backend (Laravel)**
```bash
# Instalar dependências PHP
composer install

# Copiar e configurar ficheiro de ambiente
cp .env.example .env

# Configurar .env com os dados da base de dados:
DB_DATABASE=nt
DB_USERNAME=root
DB_PASSWORD=

# Gerar chave da aplicação
php artisan key:generate

# Criar ligação simbólica para armazenamento
php artisan storage:link

# Executar migrações da base de dados
php artisan migrate
```

4. **Configurar Frontend (React)**
```bash
# Criar e aceder à pasta do frontend
cd frontend

# Instalar dependências base do React
npm install

# Instalar pacotes necessários:

# react-router-dom - Gestão de rotas
npm install react-router-dom

# react-bootstrap e bootstrap - Interface gráfica
npm install react-bootstrap bootstrap

# axios - Cliente HTTP para chamadas à API
npm install axios
```

5. **Iniciar a Aplicação**

Abrir dois terminais separados e executar:
```bash
# Terminal 1 - Servidor Laravel (Backend)
cd NT
php artisan serve

# Terminal 2 - Servidor React (Frontend)
cd NT/frontend
npm start
```

A aplicação estará disponível em:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

### Estrutura do Projeto

#### Backend (Laravel)
- `app/`
  - `Http/Controllers/` - Controladores da aplicação
  - `Models/` - Modelos da base de dados
  - `storage/app/public/comprovativos/` - Ficheiros de comprovativos de morada

#### Frontend (React)
- `frontend/`
  - `src/`
    - `components/`
      - `auth/` - Componentes de autenticação (Login e Registo)
      - `layout/` - Componentes de estrutura (Navbar, etc)
    - `services/` - Serviços e chamadas à API
    - `App.js` - Componente principal e rotas

### Pacotes e Dependências

#### Backend (Laravel)
- **Laravel Framework** (^10.0)
  - Framework PHP para desenvolvimento web
  - Inclui sistema de rotas, ORM Eloquent, etc

- **Laravel Sanctum** (^3.2)
  - Sistema de autenticação via tokens
  - Proteção de rotas da API

#### Frontend (React)

1. **Pacotes Base**
   - `react` (^18.2.0)
     - Biblioteca principal do React
   - `react-dom` (^18.2.0)
     - Renderização do React no navegador

2. **Gestão de Rotas**
   - `react-router-dom` (^6.0.0)
     - Navegação entre páginas
     - Proteção de rotas
     - Redirecionamentos

3. **Interface Gráfica**
   - `react-bootstrap` (^2.0.0)
     - Componentes Bootstrap para React
     - Formulários, botões, alertas, etc
   - `bootstrap` (^5.0.0)
     - Framework CSS para estilos

4. **Chamadas à API**
   - `axios` (^1.0.0)
     - Cliente HTTP para comunicação com backend
     - Gestão de headers e tokens
     - Upload de ficheiros

### Funcionalidades

#### Sistema de Autenticação
1. **Registo de Utilizador**
   - Formulário completo com validação
   - Upload de comprovativo de morada
   - Pré-visualização de imagens
   - Criação automática de conta

2. **Login**
   - Autenticação segura
   - Gestão de tokens JWT
   - Armazenamento em localStorage

3. **Proteção de Rotas**
   - Frontend: Redirecionamento automático
   - Backend: Middleware de autenticação

#### Armazenamento de Ficheiros
- Suporte para imagens (JPEG, PNG) e PDF
- Validação de tipos e tamanhos
- Armazenamento seguro no servidor
- Nomes únicos para evitar conflitos

### Endpoints da API

#### Autenticação
- `POST /api/auth/login`
  - Login do utilizador
  - Recebe: `{ Email, Password }`
  - Retorna: Token e dados do utilizador

- `POST /api/auth/register`
  - Registo de novo utilizador
  - Recebe: Formulário multipart com dados e ficheiro
  - Retorna: Token e dados do utilizador

- `POST /api/auth/logout`
  - Terminar sessão
  - Requer: Token de autenticação
  - Retorna: Mensagem de sucesso

- `GET /api/auth/me`
  - Dados do utilizador atual
  - Requer: Token de autenticação
  - Retorna: Dados completos do utilizador

### Contribuição

1. Crie uma branch para sua feature
```bash
git checkout -b feature/nome-da-feature
```

2. Faça commit das mudanças
```bash
git add .
git commit -m "Descrição das mudanças"
```

3. Faça push para o repositório
```bash
git push origin feature/nome-da-feature
```

4. Crie um Pull Request
