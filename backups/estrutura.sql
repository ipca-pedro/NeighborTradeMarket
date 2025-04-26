-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 26-Abr-2025 às 18:58
-- Versão do servidor: 10.4.32-MariaDB-log
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `db_nt`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `anuncio`
--

CREATE TABLE `anuncio` (
  `ID_Anuncio` int(10) NOT NULL,
  `Titulo` varchar(255) DEFAULT NULL,
  `Descricao` varchar(255) DEFAULT NULL,
  `Preco` decimal(6,2) DEFAULT NULL,
  `UtilizadorID_User` int(10) NOT NULL,
  `AprovacaoID_aprovacao` int(10) NOT NULL,
  `Tipo_ItemID_Tipo` int(10) NOT NULL,
  `CategoriaID_Categoria` int(11) NOT NULL,
  `Status_AnuncioID_Status_Anuncio` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
--
-- Estrutura da tabela `aprovacao`
--

CREATE TABLE `aprovacao` (
  `ID_aprovacao` int(10) NOT NULL,
  `Comentario` varchar(255) DEFAULT NULL,
  `Data_Submissao` timestamp NULL DEFAULT NULL,
  `Data_Aprovacao` timestamp NULL DEFAULT NULL,
  `UtilizadorID_Admin` int(10) NOT NULL,
  `Status_AprovacaoID_Status_Aprovacao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Estrutura da tabela `avaliacao`
--

CREATE TABLE `avaliacao` (
  `Id_Avaliacao` int(10) NOT NULL,
  `Comentario` varchar(255) DEFAULT NULL,
  `Data_Avaliacao` timestamp NULL DEFAULT NULL,
  `NotaID_Nota` int(10) NOT NULL,
  `OrdemID_Produto` int(10) NOT NULL,
  `AprovacaoID_aprovacao` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `cartao`
--

CREATE TABLE `cartao` (
  `ID_Cartao` int(10) NOT NULL,
  `Numero` varchar(16) NOT NULL,
  `CVC` int(11) NOT NULL,
  `Data` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Estrutura da tabela `categoria`
--

CREATE TABLE `categoria` (
  `ID_Categoria` int(11) NOT NULL,
  `Descricao_Categoria` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `compra`
--

CREATE TABLE `compra` (
  `ID_Compra` int(10) NOT NULL,
  `Data` timestamp NULL DEFAULT NULL,
  `UtilizadorID_User` int(10) NOT NULL,
  `AnuncioID_Anuncio` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `compra_reclamacao`
--

CREATE TABLE `compra_reclamacao` (
  `CompraID_Compra` int(10) NOT NULL,
  `ReclamacaoID_Reclamacao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `estado_notificacao`
--

CREATE TABLE `estado_notificacao` (
  `ID_estado_notificacao` int(11) NOT NULL,
  `Descricao` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Estrutura da tabela `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `imagem`
--

CREATE TABLE `imagem` (
  `ID_Imagem` int(11) NOT NULL,
  `Caminho` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `item_imagem`
--

CREATE TABLE `item_imagem` (
  `ItemID_Item` int(10) NOT NULL,
  `ImagemID_Imagem` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Estrutura da tabela `mensagem`
--

CREATE TABLE `mensagem` (
  `ID_Mensagem` int(10) NOT NULL,
  `Conteudo` varchar(255) DEFAULT NULL,
  `Data_mensagem` timestamp NULL DEFAULT NULL,
  `ItemID_Item` int(10) NOT NULL,
  `Status_MensagemID_Status_Mensagem` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `mensagem_utilizador`
--

CREATE TABLE `mensagem_utilizador` (
  `MensagemID_Mensagem` int(10) NOT NULL,
  `UtilizadorID_User` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `morada`
--

CREATE TABLE `morada` (
  `ID_Morada` int(10) NOT NULL,
  `Rua` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `nota`
--

CREATE TABLE `nota` (
  `ID_Nota` int(10) NOT NULL,
  `Descricao_nota` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `notificacao`
--

CREATE TABLE `notificacao` (
  `ID_Notificacao` int(11) NOT NULL,
  `Mensagem` varchar(255) DEFAULT NULL,
  `DataNotificacao` timestamp NULL DEFAULT NULL,
  `ReferenciaID` int(11) DEFAULT NULL,
  `UtilizadorID_User` int(10) NOT NULL,
  `ReferenciaTipoID_ReferenciaTipo` int(11) NOT NULL,
  `TIpo_notificacaoID_TipoNotificacao` int(11) NOT NULL,
  `Estado_notificacaoID_estado_notificacao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `pagamento`
--

CREATE TABLE `pagamento` (
  `ID_Pagamento` int(11) NOT NULL,
  `Valor` int(11) DEFAULT NULL,
  `Data` date DEFAULT NULL,
  `CompraID_Compra` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `reclamacao`
--

CREATE TABLE `reclamacao` (
  `ID_Reclamacao` int(11) NOT NULL,
  `Descricao` varchar(255) DEFAULT NULL,
  `DataReclamacao` timestamp NULL DEFAULT NULL,
  `AprovacaoID_aprovacao` int(10) NOT NULL,
  `Status_ReclamacaoID_Status_Reclamacao` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `referenciatipo`
--

CREATE TABLE `referenciatipo` (
  `ID_ReferenciaTipo` int(11) NOT NULL,
  `Descricao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` text NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Estrutura da tabela `status_anuncio`
--

CREATE TABLE `status_anuncio` (
  `ID_Status_Anuncio` int(11) NOT NULL,
  `Descricao_status_anuncio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `status_aprovacao`
--

CREATE TABLE `status_aprovacao` (
  `ID_Status_Aprovacao` int(11) NOT NULL,
  `Descricao_Status_aprovacao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
- --------------------------------------------------------

--
-- Estrutura da tabela `status_mensagem`
--

CREATE TABLE `status_mensagem` (
  `ID_Status_Mensagem` int(10) NOT NULL,
  `Descricao_status_mensagem` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
- --------------------------------------------------------

--
-- Estrutura da tabela `status_reclamacao`
--

CREATE TABLE `status_reclamacao` (
  `ID_Status_Reclamacao` int(11) NOT NULL,
  `Descricao_status_reclamacao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `status_troca`
--

CREATE TABLE `status_troca` (
  `ID_Status_Troca` int(11) NOT NULL,
  `Descricao_status_troca` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `status_utilizador`
--

CREATE TABLE `status_utilizador` (
  `ID_status_utilizador` int(10) NOT NULL,
  `Descricao_status_utilizador` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `tipouser`
--

CREATE TABLE `tipouser` (
  `ID_TipoUser` int(11) NOT NULL,
  `Descrição_TipoUtilizador` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `tipo_item`
--

CREATE TABLE `tipo_item` (
  `ID_Tipo` int(10) NOT NULL,
  `Descricao_TipoItem` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `tipo_notificacao`
--

CREATE TABLE `tipo_notificacao` (
  `ID_TipoNotificacao` int(11) NOT NULL,
  `Descricao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `troca`
--

CREATE TABLE `troca` (
  `ID_Troca` int(11) NOT NULL,
  `DataTroca` timestamp NULL DEFAULT NULL,
  `ItemID_ItemOferecido` int(10) NOT NULL,
  `ItemID_Solicitado` int(10) NOT NULL,
  `Status_TrocaID_Status_Troca` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Estrutura da tabela `utilizador`
--

CREATE TABLE `utilizador` (
  `ID_User` int(10) NOT NULL,
  `User_Name` varchar(255) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Data_Nascimento` date NOT NULL,
  `Password` varchar(255) NOT NULL,
  `CC` int(10) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `MoradaID_Morada` int(10) NOT NULL,
  `AprovacaoID_aprovacao` int(10) DEFAULT NULL,
  `cartaoID_Cartao` int(10) DEFAULT NULL,
  `TipoUserID_TipoUser` int(11) NOT NULL,
  `ImagemID_Imagem` int(11) NOT NULL,
  `Status_UtilizadorID_status_utilizador` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabela `anuncio`
--
ALTER TABLE `anuncio`
  ADD PRIMARY KEY (`ID_Anuncio`),
  ADD KEY `FKAnuncio623345` (`UtilizadorID_User`),
  ADD KEY `FKAnuncio107882` (`AprovacaoID_aprovacao`),
  ADD KEY `FKAnuncio47220` (`Tipo_ItemID_Tipo`),
  ADD KEY `FKAnuncio617781` (`CategoriaID_Categoria`),
  ADD KEY `FKAnuncio546000` (`Status_AnuncioID_Status_Anuncio`);

--
-- Índices para tabela `aprovacao`
--
ALTER TABLE `aprovacao`
  ADD PRIMARY KEY (`ID_aprovacao`),
  ADD KEY `FKAprovacao495119` (`UtilizadorID_Admin`),
  ADD KEY `FKAprovacao52084` (`Status_AprovacaoID_Status_Aprovacao`);

--
-- Índices para tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD PRIMARY KEY (`Id_Avaliacao`),
  ADD KEY `FKAvaliacao214094` (`NotaID_Nota`),
  ADD KEY `FKAvaliacao460566` (`AprovacaoID_aprovacao`),
  ADD KEY `FKAvaliacao286296` (`OrdemID_Produto`);

--
-- Índices para tabela `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Índices para tabela `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Índices para tabela `cartao`
--
ALTER TABLE `cartao`
  ADD PRIMARY KEY (`ID_Cartao`);

--
-- Índices para tabela `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`ID_Categoria`);

--
-- Índices para tabela `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`ID_Compra`),
  ADD KEY `FKCompra155813` (`UtilizadorID_User`),
  ADD KEY `FKCompra629584` (`AnuncioID_Anuncio`);

--
-- Índices para tabela `compra_reclamacao`
--
ALTER TABLE `compra_reclamacao`
  ADD PRIMARY KEY (`CompraID_Compra`,`ReclamacaoID_Reclamacao`),
  ADD KEY `FKCompra_Rec211866` (`ReclamacaoID_Reclamacao`);

--
-- Índices para tabela `estado_notificacao`
--
ALTER TABLE `estado_notificacao`
  ADD PRIMARY KEY (`ID_estado_notificacao`),
  ADD UNIQUE KEY `UQ_EstadoNotificacao_Descricao` (`Descricao`);

--
-- Índices para tabela `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Índices para tabela `imagem`
--
ALTER TABLE `imagem`
  ADD PRIMARY KEY (`ID_Imagem`);

--
-- Índices para tabela `item_imagem`
--
ALTER TABLE `item_imagem`
  ADD PRIMARY KEY (`ItemID_Item`,`ImagemID_Imagem`),
  ADD KEY `FKItem_Image648731` (`ImagemID_Imagem`);

--
-- Índices para tabela `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Índices para tabela `mensagem`
--
ALTER TABLE `mensagem`
  ADD PRIMARY KEY (`ID_Mensagem`),
  ADD KEY `FKMensagem481071` (`Status_MensagemID_Status_Mensagem`),
  ADD KEY `FKMensagem252913` (`ItemID_Item`);

--
-- Índices para tabela `mensagem_utilizador`
--
ALTER TABLE `mensagem_utilizador`
  ADD PRIMARY KEY (`MensagemID_Mensagem`,`UtilizadorID_User`),
  ADD KEY `FKMensagem_U307261` (`UtilizadorID_User`);

--
-- Índices para tabela `morada`
--
ALTER TABLE `morada`
  ADD PRIMARY KEY (`ID_Morada`);

--
-- Índices para tabela `nota`
--
ALTER TABLE `nota`
  ADD PRIMARY KEY (`ID_Nota`);

--
-- Índices para tabela `notificacao`
--
ALTER TABLE `notificacao`
  ADD PRIMARY KEY (`ID_Notificacao`),
  ADD KEY `FKNotificaca913403` (`UtilizadorID_User`),
  ADD KEY `FKNotificaca154395` (`ReferenciaTipoID_ReferenciaTipo`),
  ADD KEY `FKNotificaca714377` (`TIpo_notificacaoID_TipoNotificacao`),
  ADD KEY `FKNotificaca560186` (`Estado_notificacaoID_estado_notificacao`);

--
-- Índices para tabela `pagamento`
--
ALTER TABLE `pagamento`
  ADD PRIMARY KEY (`ID_Pagamento`),
  ADD KEY `FKPagamento115243` (`CompraID_Compra`);

--
-- Índices para tabela `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Índices para tabela `reclamacao`
--
ALTER TABLE `reclamacao`
  ADD PRIMARY KEY (`ID_Reclamacao`),
  ADD KEY `FKReclamacao876623` (`AprovacaoID_aprovacao`),
  ADD KEY `FKReclamacao606601` (`Status_ReclamacaoID_Status_Reclamacao`);

--
-- Índices para tabela `referenciatipo`
--
ALTER TABLE `referenciatipo`
  ADD PRIMARY KEY (`ID_ReferenciaTipo`);

--
-- Índices para tabela `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Índices para tabela `status_anuncio`
--
ALTER TABLE `status_anuncio`
  ADD PRIMARY KEY (`ID_Status_Anuncio`);

--
-- Índices para tabela `status_aprovacao`
--
ALTER TABLE `status_aprovacao`
  ADD PRIMARY KEY (`ID_Status_Aprovacao`);

--
-- Índices para tabela `status_mensagem`
--
ALTER TABLE `status_mensagem`
  ADD PRIMARY KEY (`ID_Status_Mensagem`);

--
-- Índices para tabela `status_reclamacao`
--
ALTER TABLE `status_reclamacao`
  ADD PRIMARY KEY (`ID_Status_Reclamacao`);

--
-- Índices para tabela `status_troca`
--
ALTER TABLE `status_troca`
  ADD PRIMARY KEY (`ID_Status_Troca`);

--
-- Índices para tabela `status_utilizador`
--
ALTER TABLE `status_utilizador`
  ADD PRIMARY KEY (`ID_status_utilizador`);

--
-- Índices para tabela `tipouser`
--
ALTER TABLE `tipouser`
  ADD PRIMARY KEY (`ID_TipoUser`);

--
-- Índices para tabela `tipo_item`
--
ALTER TABLE `tipo_item`
  ADD PRIMARY KEY (`ID_Tipo`);

--
-- Índices para tabela `tipo_notificacao`
--
ALTER TABLE `tipo_notificacao`
  ADD PRIMARY KEY (`ID_TipoNotificacao`);

--
-- Índices para tabela `troca`
--
ALTER TABLE `troca`
  ADD PRIMARY KEY (`ID_Troca`),
  ADD KEY `FKTroca415305` (`Status_TrocaID_Status_Troca`),
  ADD KEY `FKTroca249283` (`ItemID_ItemOferecido`),
  ADD KEY `FKTroca815193` (`ItemID_Solicitado`);

--
-- Índices para tabela `utilizador`
--
ALTER TABLE `utilizador`
  ADD PRIMARY KEY (`ID_User`),
  ADD KEY `FKUtilizador680017` (`MoradaID_Morada`),
  ADD KEY `FKUtilizador462334` (`AprovacaoID_aprovacao`),
  ADD KEY `FKUtilizador373700` (`cartaoID_Cartao`),
  ADD KEY `FKUtilizador979318` (`TipoUserID_TipoUser`),
  ADD KEY `FKUtilizador772568` (`ImagemID_Imagem`),
  ADD KEY `FKUtilizador244028` (`Status_UtilizadorID_status_utilizador`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `anuncio`
--
ALTER TABLE `anuncio`
  MODIFY `ID_Anuncio` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `aprovacao`
--
ALTER TABLE `aprovacao`
  MODIFY `ID_aprovacao` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  MODIFY `Id_Avaliacao` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `cartao`
--
ALTER TABLE `cartao`
  MODIFY `ID_Cartao` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `categoria`
--
ALTER TABLE `categoria`
  MODIFY `ID_Categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `compra`
--
ALTER TABLE `compra`
  MODIFY `ID_Compra` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `estado_notificacao`
--
ALTER TABLE `estado_notificacao`
  MODIFY `ID_estado_notificacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `imagem`
--
ALTER TABLE `imagem`
  MODIFY `ID_Imagem` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de tabela `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `mensagem`
--
ALTER TABLE `mensagem`
  MODIFY `ID_Mensagem` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `morada`
--
ALTER TABLE `morada`
  MODIFY `ID_Morada` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de tabela `nota`
--
ALTER TABLE `nota`
  MODIFY `ID_Nota` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `notificacao`
--
ALTER TABLE `notificacao`
  MODIFY `ID_Notificacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `pagamento`
--
ALTER TABLE `pagamento`
  MODIFY `ID_Pagamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT de tabela `reclamacao`
--
ALTER TABLE `reclamacao`
  MODIFY `ID_Reclamacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `referenciatipo`
--
ALTER TABLE `referenciatipo`
  MODIFY `ID_ReferenciaTipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `status_anuncio`
--
ALTER TABLE `status_anuncio`
  MODIFY `ID_Status_Anuncio` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `status_aprovacao`
--
ALTER TABLE `status_aprovacao`
  MODIFY `ID_Status_Aprovacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `status_mensagem`
--
ALTER TABLE `status_mensagem`
  MODIFY `ID_Status_Mensagem` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `status_reclamacao`
--
ALTER TABLE `status_reclamacao`
  MODIFY `ID_Status_Reclamacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `status_troca`
--
ALTER TABLE `status_troca`
  MODIFY `ID_Status_Troca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `status_utilizador`
--
ALTER TABLE `status_utilizador`
  MODIFY `ID_status_utilizador` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `tipouser`
--
ALTER TABLE `tipouser`
  MODIFY `ID_TipoUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `tipo_item`
--
ALTER TABLE `tipo_item`
  MODIFY `ID_Tipo` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `tipo_notificacao`
--
ALTER TABLE `tipo_notificacao`
  MODIFY `ID_TipoNotificacao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de tabela `troca`
--
ALTER TABLE `troca`
  MODIFY `ID_Troca` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `utilizador`
--
ALTER TABLE `utilizador`
  MODIFY `ID_User` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `anuncio`
--
ALTER TABLE `anuncio`
  ADD CONSTRAINT `FKAnuncio107882` FOREIGN KEY (`AprovacaoID_aprovacao`) REFERENCES `aprovacao` (`ID_aprovacao`),
  ADD CONSTRAINT `FKAnuncio47220` FOREIGN KEY (`Tipo_ItemID_Tipo`) REFERENCES `tipo_item` (`ID_Tipo`),
  ADD CONSTRAINT `FKAnuncio546000` FOREIGN KEY (`Status_AnuncioID_Status_Anuncio`) REFERENCES `status_anuncio` (`ID_Status_Anuncio`),
  ADD CONSTRAINT `FKAnuncio617781` FOREIGN KEY (`CategoriaID_Categoria`) REFERENCES `categoria` (`ID_Categoria`),
  ADD CONSTRAINT `FKAnuncio623345` FOREIGN KEY (`UtilizadorID_User`) REFERENCES `utilizador` (`ID_User`);

--
-- Limitadores para a tabela `aprovacao`
--
ALTER TABLE `aprovacao`
  ADD CONSTRAINT `FKAprovacao495119` FOREIGN KEY (`UtilizadorID_Admin`) REFERENCES `utilizador` (`ID_User`),
  ADD CONSTRAINT `FKAprovacao52084` FOREIGN KEY (`Status_AprovacaoID_Status_Aprovacao`) REFERENCES `status_aprovacao` (`ID_Status_Aprovacao`);

--
-- Limitadores para a tabela `avaliacao`
--
ALTER TABLE `avaliacao`
  ADD CONSTRAINT `FKAvaliacao214094` FOREIGN KEY (`NotaID_Nota`) REFERENCES `nota` (`ID_Nota`),
  ADD CONSTRAINT `FKAvaliacao286296` FOREIGN KEY (`OrdemID_Produto`) REFERENCES `compra` (`ID_Compra`),
  ADD CONSTRAINT `FKAvaliacao460566` FOREIGN KEY (`AprovacaoID_aprovacao`) REFERENCES `aprovacao` (`ID_aprovacao`);

--
-- Limitadores para a tabela `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `FKCompra155813` FOREIGN KEY (`UtilizadorID_User`) REFERENCES `utilizador` (`ID_User`),
  ADD CONSTRAINT `FKCompra629584` FOREIGN KEY (`AnuncioID_Anuncio`) REFERENCES `anuncio` (`ID_Anuncio`);

--
-- Limitadores para a tabela `compra_reclamacao`
--
ALTER TABLE `compra_reclamacao`
  ADD CONSTRAINT `FKCompra_Rec211866` FOREIGN KEY (`ReclamacaoID_Reclamacao`) REFERENCES `reclamacao` (`ID_Reclamacao`),
  ADD CONSTRAINT `FKCompra_Rec509146` FOREIGN KEY (`CompraID_Compra`) REFERENCES `compra` (`ID_Compra`);

--
-- Limitadores para a tabela `item_imagem`
--
ALTER TABLE `item_imagem`
  ADD CONSTRAINT `FKItem_Image234733` FOREIGN KEY (`ItemID_Item`) REFERENCES `anuncio` (`ID_Anuncio`),
  ADD CONSTRAINT `FKItem_Image648731` FOREIGN KEY (`ImagemID_Imagem`) REFERENCES `imagem` (`ID_Imagem`);

--
-- Limitadores para a tabela `mensagem`
--
ALTER TABLE `mensagem`
  ADD CONSTRAINT `FKMensagem252913` FOREIGN KEY (`ItemID_Item`) REFERENCES `anuncio` (`ID_Anuncio`),
  ADD CONSTRAINT `FKMensagem481071` FOREIGN KEY (`Status_MensagemID_Status_Mensagem`) REFERENCES `status_mensagem` (`ID_Status_Mensagem`);

--
-- Limitadores para a tabela `mensagem_utilizador`
--
ALTER TABLE `mensagem_utilizador`
  ADD CONSTRAINT `FKMensagem_U307261` FOREIGN KEY (`UtilizadorID_User`) REFERENCES `utilizador` (`ID_User`),
  ADD CONSTRAINT `FKMensagem_U481429` FOREIGN KEY (`MensagemID_Mensagem`) REFERENCES `mensagem` (`ID_Mensagem`);

--
-- Limitadores para a tabela `notificacao`
--
ALTER TABLE `notificacao`
  ADD CONSTRAINT `FKNotificaca154395` FOREIGN KEY (`ReferenciaTipoID_ReferenciaTipo`) REFERENCES `referenciatipo` (`ID_ReferenciaTipo`),
  ADD CONSTRAINT `FKNotificaca560186` FOREIGN KEY (`Estado_notificacaoID_estado_notificacao`) REFERENCES `estado_notificacao` (`ID_estado_notificacao`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FKNotificaca714377` FOREIGN KEY (`TIpo_notificacaoID_TipoNotificacao`) REFERENCES `tipo_notificacao` (`ID_TipoNotificacao`),
  ADD CONSTRAINT `FKNotificaca913403` FOREIGN KEY (`UtilizadorID_User`) REFERENCES `utilizador` (`ID_User`);

--
-- Limitadores para a tabela `pagamento`
--
ALTER TABLE `pagamento`
  ADD CONSTRAINT `FKPagamento115243` FOREIGN KEY (`CompraID_Compra`) REFERENCES `compra` (`ID_Compra`);

--
-- Limitadores para a tabela `reclamacao`
--
ALTER TABLE `reclamacao`
  ADD CONSTRAINT `FKReclamacao606601` FOREIGN KEY (`Status_ReclamacaoID_Status_Reclamacao`) REFERENCES `status_reclamacao` (`ID_Status_Reclamacao`),
  ADD CONSTRAINT `FKReclamacao876623` FOREIGN KEY (`AprovacaoID_aprovacao`) REFERENCES `aprovacao` (`ID_aprovacao`);

--
-- Limitadores para a tabela `troca`
--
ALTER TABLE `troca`
  ADD CONSTRAINT `FKTroca249283` FOREIGN KEY (`ItemID_ItemOferecido`) REFERENCES `anuncio` (`ID_Anuncio`),
  ADD CONSTRAINT `FKTroca415305` FOREIGN KEY (`Status_TrocaID_Status_Troca`) REFERENCES `status_troca` (`ID_Status_Troca`),
  ADD CONSTRAINT `FKTroca815193` FOREIGN KEY (`ItemID_Solicitado`) REFERENCES `anuncio` (`ID_Anuncio`);

--
-- Limitadores para a tabela `utilizador`
--
ALTER TABLE `utilizador`
  ADD CONSTRAINT `FKUtilizador244028` FOREIGN KEY (`Status_UtilizadorID_status_utilizador`) REFERENCES `status_utilizador` (`ID_status_utilizador`),
  ADD CONSTRAINT `FKUtilizador373700` FOREIGN KEY (`cartaoID_Cartao`) REFERENCES `cartao` (`ID_Cartao`),
  ADD CONSTRAINT `FKUtilizador462334` FOREIGN KEY (`AprovacaoID_aprovacao`) REFERENCES `aprovacao` (`ID_aprovacao`),
  ADD CONSTRAINT `FKUtilizador680017` FOREIGN KEY (`MoradaID_Morada`) REFERENCES `morada` (`ID_Morada`),
  ADD CONSTRAINT `FKUtilizador772568` FOREIGN KEY (`ImagemID_Imagem`) REFERENCES `imagem` (`ID_Imagem`),
  ADD CONSTRAINT `FKUtilizador979318` FOREIGN KEY (`TipoUserID_TipoUser`) REFERENCES `tipouser` (`ID_TipoUser`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
