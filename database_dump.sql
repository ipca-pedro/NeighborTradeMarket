-- NeighborTrade Database Dump
-- Gerado em: 2025-04-14 23:28:18

SET FOREIGN_KEY_CHECKS=0;

-- Dados da tabela `anuncio`
TRUNCATE TABLE `anuncio`;
INSERT INTO `anuncio` (`ID_Anuncio`, `Titulo`, `Descricao`, `Preco`, `UtilizadorID_User`, `AprovacaoID_aprovacao`, `Tipo_ItemID_Tipo`, `CategoriaID_Categoria`, `Status_AnuncioID_Status_Anuncio`) VALUES ('1', 'teste', 'teste', '100.99', '2', '19', '1', '1', '2');
INSERT INTO `anuncio` (`ID_Anuncio`, `Titulo`, `Descricao`, `Preco`, `UtilizadorID_User`, `AprovacaoID_aprovacao`, `Tipo_ItemID_Tipo`, `CategoriaID_Categoria`, `Status_AnuncioID_Status_Anuncio`) VALUES ('2', 'teste2', 'teste', '100.00', '2', '20', '2', '2', '2');
INSERT INTO `anuncio` (`ID_Anuncio`, `Titulo`, `Descricao`, `Preco`, `UtilizadorID_User`, `AprovacaoID_aprovacao`, `Tipo_ItemID_Tipo`, `CategoriaID_Categoria`, `Status_AnuncioID_Status_Anuncio`) VALUES ('3', 'portatil', 'portátil como novo', '250.00', '2', '21', '1', '1', '2');

-- Dados da tabela `aprovacao`
TRUNCATE TABLE `aprovacao`;
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES ('1', 'Administrador do sistema', '2025-04-10 17:49:36', '2025-04-14 20:35:20', '1', '2');
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES ('2', 'Usuário de teste', '2025-04-10 17:49:36', '2025-04-14 20:35:24', '1', '2');
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES ('19', '', '2025-04-10 23:49:54', '2025-04-11 00:06:35', '1', '2');
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES ('20', '', '2025-04-11 00:19:45', '2025-04-11 00:20:51', '1', '2');
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES ('21', '', '2025-04-11 00:24:39', '2025-04-11 00:26:27', '1', '2');
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES ('22', NULL, NULL, '2025-04-14 20:35:27', '1', '2');
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES ('23', NULL, NULL, NULL, '1', '1');
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES ('24', 'Nao quero fêmeas aqui.', '2025-04-14 20:53:56', '2025-04-14 20:53:56', '1', '3');
INSERT INTO `aprovacao` (`ID_aprovacao`, `Comentario`, `Data_Submissao`, `Data_Aprovacao`, `UtilizadorID_Admin`, `Status_AprovacaoID_Status_Aprovacao`) VALUES ('25', NULL, NULL, '2025-04-14 21:16:03', '1', '2');

-- Dados da tabela `cache`
TRUNCATE TABLE `cache`;
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES ('laravel_cache_d189a3df25facd3522214377f5876bcb', 'i:1;', '1744320443');
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES ('laravel_cache_d189a3df25facd3522214377f5876bcb:timer', 'i:1744320443;', '1744320443');

-- Dados da tabela `categoria`
TRUNCATE TABLE `categoria`;
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES ('1', 'Informática');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES ('2', 'Móveis');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES ('3', 'Roupas');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES ('4', 'Livros');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES ('5', 'Brinquedos');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES ('6', 'Ferramentas');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES ('7', 'Veículos');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES ('8', 'Imóveis');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES ('9', 'Desporto');
INSERT INTO `categoria` (`ID_Categoria`, `Descricao_Categoria`) VALUES ('10', 'Outros');

-- Dados da tabela `imagem`
TRUNCATE TABLE `imagem`;
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES ('1', 'public/perfil/default.png');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES ('2', 'anuncios/1744330785_0_transferir.jpeg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES ('3', 'anuncios/1744331079_0_transferir.jpeg');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES ('4', 'comprovativos/pdfs/user_3_20250414201839.pdf');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES ('5', 'comprovativos/pdfs/user_4_20250414203244.pdf');
INSERT INTO `imagem` (`ID_Imagem`, `Caminho`) VALUES ('6', 'comprovativos/pdfs/user_5_20250414205617.pdf');

-- Dados da tabela `item_imagem`
TRUNCATE TABLE `item_imagem`;
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES ('2', '2');
INSERT INTO `item_imagem` (`ItemID_Item`, `ImagemID_Imagem`) VALUES ('3', '3');

-- Dados da tabela `morada`
TRUNCATE TABLE `morada`;
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('1', 'Rua de Exemplo, 123');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('2', 'Rua das Flores, nº 123');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('3', 'Avenida Central, nº 456');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('4', 'Travessa do Comércio, nº 789');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('5', 'Rua do Sol, nº 101');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('6', 'Avenida dos Pioneiros, nº 55');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('7', 'Rua da Esperança, nº 99');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('8', 'Rua do Mercado, nº 12');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('9', 'Rua Bela Vista, nº 222');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('10', 'Avenida das Amoreiras, nº 80');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('11', 'Rua do Pinhal, nº 35');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('12', 'Rua São Jorge, nº 61');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('13', 'Travessa da Liberdade, nº 7');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('14', 'Avenida das Laranjeiras, nº 300');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('15', 'Rua da Juventude, nº 44');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('16', 'Rua das Oliveiras, nº 88');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('17', 'Rua Padre António Vieira, nº 19');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('18', 'Rua do Carmo, nº 250');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('19', 'Avenida Atlântica, nº 321');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('20', 'Travessa dos Navegantes, nº 5');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('21', 'Rua João XXI, nº 65');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('22', 'Rua Nova da Estação, nº 110');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('23', 'Rua da Paz, nº 18');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('24', 'Avenida Beira-Mar, nº 70');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('25', 'Rua das Pedras, nº 140');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('26', 'Travessa São Francisco, nº 30');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('27', 'Rua do Ferro Velho, nº 3');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('28', 'Rua dos Lavradores, nº 20');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('29', 'Avenida dos Descobrimentos, nº 400');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('30', 'Rua Dom Afonso Henriques, nº 77');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('31', 'Rua 1º de Maio, nº 88');
INSERT INTO `morada` (`ID_Morada`, `Rua`) VALUES ('32', 'Rua do Campo Alegre, nº 212');

-- Dados da tabela `nota`
TRUNCATE TABLE `nota`;
INSERT INTO `nota` (`ID_Nota`, `Descricao_nota`) VALUES ('1', '1 Estrela');
INSERT INTO `nota` (`ID_Nota`, `Descricao_nota`) VALUES ('2', '2 Estrelas');
INSERT INTO `nota` (`ID_Nota`, `Descricao_nota`) VALUES ('3', '3 Estrelas');
INSERT INTO `nota` (`ID_Nota`, `Descricao_nota`) VALUES ('4', '4 Estrelas');
INSERT INTO `nota` (`ID_Nota`, `Descricao_nota`) VALUES ('5', '5 Estrelas');

-- Dados da tabela `personal_access_tokens`
TRUNCATE TABLE `personal_access_tokens`;
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('1', 'App\\Models\\Utilizador', '1', 'auth-token', 'bbb9f12a54845688425b8f4eb67643b5e2565abf776ef169761b06c1da0b711d', '[\"*\"]', NULL, NULL, '2025-04-10 21:32:11', '2025-04-10 21:32:11');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('2', 'App\\Models\\Utilizador', '1', 'auth-token', '27c1cf58ca49c8486b3fe57912bdd75910a5a342b71bd85212b6f6d3a9764fce', '[\"*\"]', NULL, NULL, '2025-04-10 21:33:37', '2025-04-10 21:33:37');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('3', 'App\\Models\\Utilizador', '1', 'auth-token', '333db854dacc9c78c41462688b9d5e9edc4d575499b7d654616338cea1878b23', '[\"*\"]', NULL, NULL, '2025-04-10 21:57:56', '2025-04-10 21:57:56');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('4', 'App\\Models\\Utilizador', '1', 'auth-token', '7844cfc8e411b74b4b8996c112d631a1a7693ecd48b57d299cf2096ce9045486', '[\"*\"]', NULL, NULL, '2025-04-10 22:00:32', '2025-04-10 22:00:32');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('5', 'App\\Models\\Utilizador', '1', 'auth-token', '44f61d8822445e7799a8b57c77f278bcc3da9e6e9403275543f0c2abbd487395', '[\"*\"]', '2025-04-10 22:01:04', NULL, '2025-04-10 22:01:03', '2025-04-10 22:01:04');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('6', 'App\\Models\\Utilizador', '2', 'auth-token', '8859078cd6c1cca5831cac22254ed94b061c9c4427c70241d0519c19d1e158b4', '[\"*\"]', '2025-04-10 22:45:21', NULL, '2025-04-10 22:02:07', '2025-04-10 22:45:21');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('7', 'App\\Models\\Utilizador', '2', 'auth-token', 'cfbf794a551068d4f414a921aa39ab471724ea13fb1b0fae7693f5f52b9b9db7', '[\"*\"]', '2025-04-10 23:40:52', NULL, '2025-04-10 22:46:03', '2025-04-10 23:40:52');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('8', 'App\\Models\\Utilizador', '1', 'auth-token', '470f296d346f253d94e2ecfdac158105f33aa1a00c5a36be80d0e15c83f9a630', '[\"*\"]', '2025-04-10 23:44:33', NULL, '2025-04-10 23:41:27', '2025-04-10 23:44:33');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('9', 'App\\Models\\Utilizador', '2', 'auth-token', 'e138998f036a27c953091f54211676df0d43dc2385588ded735e5fb7bdbfc9c3', '[\"*\"]', NULL, NULL, '2025-04-10 23:44:54', '2025-04-10 23:44:54');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('10', 'App\\Models\\Utilizador', '2', 'auth-token', '23bd49bb402bc457c7d4354a75ad5765abf52105629207afdb22ffdb07dc1415', '[\"*\"]', '2025-04-10 23:57:33', NULL, '2025-04-10 23:46:08', '2025-04-10 23:57:33');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('11', 'App\\Models\\Utilizador', '2', 'auth-token', 'a3f8235edffc969bba8b6c439d8bb609e06139e24be5d9f78860112e67dd0a97', '[\"*\"]', '2025-04-11 00:01:08', NULL, '2025-04-10 23:49:36', '2025-04-11 00:01:08');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('12', 'App\\Models\\Utilizador', '1', 'auth-token', '38950e289e767cb57fd4969682ae6a9f9f20dd9ab7365ef5cf0b5cf7eb330730', '[\"*\"]', NULL, NULL, '2025-04-10 23:58:13', '2025-04-10 23:58:13');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('13', 'App\\Models\\Utilizador', '1', 'auth-token', '6856533b2109c38f26ffbb9316ace3a8d9bb75a1360c29587183ff2d385a72fb', '[\"*\"]', '2025-04-11 00:05:40', NULL, '2025-04-10 23:58:32', '2025-04-11 00:05:40');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('14', 'App\\Models\\Utilizador', '1', 'auth-token', '12c89d458b7cace497cad8a781237cec3232fdd619efec656ed54ca6645ca1fd', '[\"*\"]', '2025-04-11 00:01:24', NULL, '2025-04-11 00:01:23', '2025-04-11 00:01:24');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('15', 'App\\Models\\Utilizador', '1', 'auth-token', '8e660e64e7b55cb3effeb8d61fa08cdbe1ca32365cd151436664c90b712c9673', '[\"*\"]', '2025-04-11 00:06:35', NULL, '2025-04-11 00:05:58', '2025-04-11 00:06:35');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('16', 'App\\Models\\Utilizador', '2', 'auth-token', '78b7ec6497f10f1600c8c5b50729b5b82b19c6e99408540acb0066ca140fbd8d', '[\"*\"]', '2025-04-11 00:06:55', NULL, '2025-04-11 00:06:54', '2025-04-11 00:06:55');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('17', 'App\\Models\\Utilizador', '1', 'auth-token', 'd934ebee24b10966af3be27efc2c3a48999b8898f95d71c8c6682ef8e3b719c2', '[\"*\"]', NULL, NULL, '2025-04-11 00:07:49', '2025-04-11 00:07:49');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('18', 'App\\Models\\Utilizador', '2', 'auth-token', 'df0a5c3336d0a755a6281ed2d14729122befe2bb022379f809840c537ea8c040', '[\"*\"]', '2025-04-11 00:19:51', NULL, '2025-04-11 00:16:14', '2025-04-11 00:19:51');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('19', 'App\\Models\\Utilizador', '1', 'auth-token', '85ba7a01dc29332dfeb0eb56cf34db4cd8fe15836dad651cd749055bfe2eac64', '[\"*\"]', '2025-04-11 00:20:51', NULL, '2025-04-11 00:20:08', '2025-04-11 00:20:51');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('20', 'App\\Models\\Utilizador', '2', 'auth-token', '7c84ca4ee8fa99e8e832b274d77b23600fa1b46ee526deda51d5b807e258d499', '[\"*\"]', '2025-04-11 00:21:18', NULL, '2025-04-11 00:21:03', '2025-04-11 00:21:18');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('21', 'App\\Models\\Utilizador', '2', 'auth-token', 'a88cac8cbae18fc5855ff0403785baf08f38465a8cb8c5041bce7904ff329ff9', '[\"*\"]', '2025-04-11 00:22:22', NULL, '2025-04-11 00:22:21', '2025-04-11 00:22:22');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('22', 'App\\Models\\Utilizador', '2', 'auth-token', '3d1894582146f7f0628a7d0a05988384d63429d02128e57888a318187cfda5cd', '[\"*\"]', NULL, NULL, '2025-04-11 00:23:42', '2025-04-11 00:23:42');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('23', 'App\\Models\\Utilizador', '2', 'auth-token', '7ebc2e287cefa7b1d7e416ad467e59ab4756757a21c7ed4b61ff2a1abed0b830', '[\"*\"]', '2025-04-11 00:24:39', NULL, '2025-04-11 00:23:57', '2025-04-11 00:24:39');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('24', 'App\\Models\\Utilizador', '1', 'auth-token', 'deff5ad86deb124abcb725f8b8d79d250be789a129233c4a89c517d336f831d1', '[\"*\"]', '2025-04-11 00:26:27', NULL, '2025-04-11 00:25:19', '2025-04-11 00:26:27');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('25', 'App\\Models\\Utilizador', '2', 'auth-token', '304c2db781914b5f925b6222e92633977af1eec2dc9ab9d016c115d8c98a0168', '[\"*\"]', '2025-04-11 00:44:22', NULL, '2025-04-11 00:26:37', '2025-04-11 00:44:22');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('26', 'App\\Models\\Utilizador', '2', 'auth-token', 'a61e12774ecad1d00c5ef7893ce759e2b11bcc3bd2e951c9e8b28e17eef3fc5d', '[\"*\"]', '2025-04-11 00:32:59', NULL, '2025-04-11 00:32:14', '2025-04-11 00:32:59');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('27', 'App\\Models\\Utilizador', '2', 'auth-token', '2ea02497f98290f7b663b1e45c51a1eaf839cf978368af4214d62f6e75ebc10b', '[\"*\"]', NULL, NULL, '2025-04-11 00:44:41', '2025-04-11 00:44:41');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('28', 'App\\Models\\Utilizador', '2', 'auth-token', 'cc3e37b4f8089ebaf4e8b1d83e499f908841ada36978617886d5609b35e4cbb5', '[\"*\"]', '2025-04-11 00:44:54', NULL, '2025-04-11 00:44:53', '2025-04-11 00:44:54');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('29', 'App\\Models\\Utilizador', '2', 'auth-token', '8a219b18867d4605bbe5eafa4ac26d0d86208472fb842ec4c613f3934ec75b1b', '[\"*\"]', NULL, NULL, '2025-04-11 00:47:30', '2025-04-11 00:47:30');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('30', 'App\\Models\\Utilizador', '2', 'auth-token', '9275d79d49d6e5c7f39e99b5a0a2735abedea4d0db754b4107480309117fc11f', '[\"*\"]', NULL, NULL, '2025-04-11 00:47:41', '2025-04-11 00:47:41');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('31', 'App\\Models\\Utilizador', '2', 'auth-token', 'a96ccca96afeb9accd78ed87ef74f52b3fb1973e86a5b4bc6eadb24f349ffaed', '[\"*\"]', NULL, NULL, '2025-04-11 00:47:54', '2025-04-11 00:47:54');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('32', 'App\\Models\\Utilizador', '2', 'auth-token', 'd7177affb6355d4feb4e8ea3f1d1ea70c02e0a2d25cdeb89e961d00bec6d9e38', '[\"*\"]', '2025-04-14 18:51:51', NULL, '2025-04-13 13:41:14', '2025-04-14 18:51:51');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('33', 'App\\Models\\Utilizador', '1', 'auth-token', '3c1d9d0f26f4094934388a14613e6ed6c4b0a8c79416ad3bcbe8b4c21c56b2c6', '[\"*\"]', '2025-04-14 18:54:00', NULL, '2025-04-14 18:53:57', '2025-04-14 18:54:00');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('34', 'App\\Models\\Utilizador', '1', 'auth-token', '05c9c3aeebb66ac3a61c66a943d51e5b0b364fa6e3e80622278a5dbdd5f5d6e6', '[\"*\"]', NULL, NULL, '2025-04-14 18:54:21', '2025-04-14 18:54:21');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('35', 'App\\Models\\Utilizador', '1', 'auth-token', 'b7a57d630b6b997f21e415449177ffd2e7e3cef48a6d728d138f8e35841d63a1', '[\"*\"]', '2025-04-14 18:56:34', NULL, '2025-04-14 18:56:29', '2025-04-14 18:56:34');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('36', 'App\\Models\\Utilizador', '1', 'auth-token', '732621ff764a5389d664784135dc42158976442576805e514aa74a6549d43e90', '[\"*\"]', NULL, NULL, '2025-04-14 18:57:04', '2025-04-14 18:57:04');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('37', 'App\\Models\\Utilizador', '2', 'auth-token', '38e1ac044731a04307bdb56afa416c55d5db4dc4b42fa3d30ac74258f075ca1f', '[\"*\"]', '2025-04-14 18:57:35', NULL, '2025-04-14 18:57:30', '2025-04-14 18:57:35');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('38', 'App\\Models\\Utilizador', '2', 'auth-token', 'ac4ec0701d3a1c88601d58c3c7c77b08df0ff48fcd75fd39f48e1cc82f3bd0f2', '[\"*\"]', NULL, NULL, '2025-04-14 18:58:34', '2025-04-14 18:58:34');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('39', 'App\\Models\\Utilizador', '2', 'auth-token', '8f4edd1e993d97838a74dc96b2373ab483d921512c169476e71116a96f7b1fc8', '[\"*\"]', NULL, NULL, '2025-04-14 18:58:48', '2025-04-14 18:58:48');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('40', 'App\\Models\\Utilizador', '1', 'auth-token', 'b2885e41af1cc7ffb4683dd7154ee947c932a1d23d3e35456f07580b66cdfeb0', '[\"*\"]', '2025-04-14 19:04:51', NULL, '2025-04-14 18:59:38', '2025-04-14 19:04:51');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('41', 'App\\Models\\Utilizador', '1', 'auth-token', 'b0a7bcd224d291865f9087567172416b24eceacb87694a03f3b9a1d7ecc8e673', '[\"*\"]', '2025-04-14 19:12:31', NULL, '2025-04-14 19:08:19', '2025-04-14 19:12:31');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('42', 'App\\Models\\Utilizador', '1', 'auth-token', 'c94eac40137e98e04972ec70e1fd0f8b840d24b6cafaa3ef406239b4fce3c176', '[\"*\"]', NULL, NULL, '2025-04-14 19:12:49', '2025-04-14 19:12:49');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('43', 'App\\Models\\Utilizador', '2', 'auth-token', '960bb2a8518197c4476e6511d707a0023446e300c32e041345bedf813b0f03ec', '[\"*\"]', '2025-04-14 20:15:28', NULL, '2025-04-14 19:13:15', '2025-04-14 20:15:28');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('44', 'App\\Models\\Utilizador', '1', 'auth-token', 'be7f31aa55e586783cd6d94969a980d75060de5f35674f28e02c7ae1c774de8e', '[\"*\"]', '2025-04-14 20:16:10', NULL, '2025-04-14 20:16:02', '2025-04-14 20:16:10');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('45', 'App\\Models\\Utilizador', '2', 'auth-token', '792060ae4151ecaba8ab409a2a39da9aa1b431a0f23645db9c57834cc9a82e40', '[\"*\"]', '2025-04-14 20:17:04', NULL, '2025-04-14 20:16:44', '2025-04-14 20:17:04');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('46', 'App\\Models\\Utilizador', '3', 'auth-token', 'cb99bb81d46af9216eef23019f44e169baebcc9bb01c888954c5567da7923119', '[\"*\"]', '2025-04-14 20:19:16', NULL, '2025-04-14 20:19:12', '2025-04-14 20:19:16');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('47', 'App\\Models\\Utilizador', '3', 'auth-token', '37e2b56a43c0928bcc589b4d2255c7468fad357202e7e5d9c848558368dd10b8', '[\"*\"]', '2025-04-14 20:20:09', NULL, '2025-04-14 20:19:56', '2025-04-14 20:20:09');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('48', 'App\\Models\\Utilizador', '1', 'auth-token', '8500f461a36cae9b56faed9d5fbfafde581f3d08132bc1a0fc9c34575bc11527', '[\"*\"]', '2025-04-14 20:27:43', NULL, '2025-04-14 20:27:37', '2025-04-14 20:27:43');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('49', 'App\\Models\\Utilizador', '1', 'auth-token', '5b67f76c7f727a3d59c284f58c0fb7dcdd6563438f5a191401684ae5f571fa0e', '[\"*\"]', '2025-04-14 20:33:48', NULL, '2025-04-14 20:33:25', '2025-04-14 20:33:48');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('50', 'App\\Models\\Utilizador', '1', 'auth-token', '5e6b6366e5a87ec54601e9d3f01768f50fcca31909ef8896fe638ce209cdfebe', '[\"*\"]', '2025-04-14 20:35:37', NULL, '2025-04-14 20:34:08', '2025-04-14 20:35:37');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('51', 'App\\Models\\Utilizador', '1', 'auth-token', 'fe250efbf6aa81e1adaef1e504def934d7312d78588cbc2d23cf3192f95f39fc', '[\"*\"]', '2025-04-14 20:36:29', NULL, '2025-04-14 20:36:03', '2025-04-14 20:36:29');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('52', 'App\\Models\\Utilizador', '1', 'auth-token', 'e273761a70c976d2cd13c6cb187c871a7444a7dd35ffd43396c4100a44aedb92', '[\"*\"]', '2025-04-14 20:55:19', NULL, '2025-04-14 20:37:08', '2025-04-14 20:55:19');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('53', 'App\\Models\\Utilizador', '1', 'auth-token', '72a1cd84f22c04aa382193fa3b775192f1c173c9eecd703b69ba3e08eb2c5310', '[\"*\"]', '2025-04-14 21:08:53', NULL, '2025-04-14 20:56:54', '2025-04-14 21:08:53');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('54', 'App\\Models\\Utilizador', '5', 'auth-token', '525be813c9b57ced2efc5e08f2f88509fbf4a565d457ab1a67148192eb7829b6', '[\"*\"]', '2025-04-14 21:09:24', NULL, '2025-04-14 21:09:23', '2025-04-14 21:09:24');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('55', 'App\\Models\\Utilizador', '1', 'auth-token', '7066694a519efa7d15739bc708c2699359e25cbf103b99290afd87f705a8917c', '[\"*\"]', '2025-04-14 21:15:04', NULL, '2025-04-14 21:09:59', '2025-04-14 21:15:04');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('56', 'App\\Models\\Utilizador', '3', 'auth-token', 'f71a93897dd209389826239cd61002431dce7927d3885c1f1f4256efea4391f9', '[\"*\"]', '2025-04-14 21:15:41', NULL, '2025-04-14 21:15:40', '2025-04-14 21:15:41');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('57', 'App\\Models\\Utilizador', '1', 'auth-token', '58165d4a872dbc37a3130691c02d47936101c1c5590647b3f72e91eecdfd2b3e', '[\"*\"]', '2025-04-14 21:16:03', NULL, '2025-04-14 21:15:57', '2025-04-14 21:16:03');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('58', 'App\\Models\\Utilizador', '5', 'auth-token', 'fc08568a8527c71ce91c9646d5dfd1211844ddde9544494deaff64f958d7ef86', '[\"*\"]', '2025-04-14 21:18:19', NULL, '2025-04-14 21:16:17', '2025-04-14 21:18:19');
INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES ('59', 'App\\Models\\Utilizador', '1', 'auth-token', 'a1495454f494d50c14d00f3d643fa4770693b6e95a88a8e25ce69b8a2c2b213c', '[\"*\"]', '2025-04-14 21:19:02', NULL, '2025-04-14 21:18:45', '2025-04-14 21:19:02');

-- Dados da tabela `referenciatipo`
TRUNCATE TABLE `referenciatipo`;
INSERT INTO `referenciatipo` (`ID_ReferenciaTipo`, `Descricao`) VALUES ('1', 'Utilizador');

-- Dados da tabela `sessions`
TRUNCATE TABLE `sessions`;
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('7gswsucQ0opzgkzANlKZarKn15QWlCaTKpQwweCQ', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Windsurf/1.97.0 Chrome/128.0.6613.186 Electron/32.2.7 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoidFNBMTJZcG1sVXk5N2Q0ejJ3amR1UFdjRktxbExvMjJyS0NUakRHaSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTU6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC8/dnNjb2RlQnJvd3NlclJlcUlkPTE3NDQzMTUwNTgxMzciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', '1744315069');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('9eixJiXaXF6RApTne3yFYvKE0CxhiyAsi5P3DFbf', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Windsurf/1.97.0 Chrome/128.0.6613.186 Electron/32.2.7 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiV1F6T0k5cWI3UHNpYzFGWWZhbzdBTXJmUG91ejRNenN5dGV6QnlJcSI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTU6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC8/dnNjb2RlQnJvd3NlclJlcUlkPTE3NDQzMTU1NDAxMDYiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', '1744315547');
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('SMd3en6bjCleb8eUI5L1hsQJEka0NX5UhlKJcxUa', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Windsurf/1.97.0 Chrome/128.0.6613.186 Electron/32.2.7 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiMnJqdWF5M1VXOWNiQ0gzYjd6aGE3WHlLNTNKV21uSEp2TkdvYnZyMCI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NTU6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC8/dnNjb2RlQnJvd3NlclJlcUlkPTE3NDQzMTUzMTY0NjEiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', '1744315317');

-- Dados da tabela `status_anuncio`
TRUNCATE TABLE `status_anuncio`;
INSERT INTO `status_anuncio` (`ID_Status_Anuncio`, `Descricao_status_anuncio`) VALUES ('1', 'Ativo');
INSERT INTO `status_anuncio` (`ID_Status_Anuncio`, `Descricao_status_anuncio`) VALUES ('2', 'Inativo');
INSERT INTO `status_anuncio` (`ID_Status_Anuncio`, `Descricao_status_anuncio`) VALUES ('3', 'Vendido');
INSERT INTO `status_anuncio` (`ID_Status_Anuncio`, `Descricao_status_anuncio`) VALUES ('4', 'Pendente');
INSERT INTO `status_anuncio` (`ID_Status_Anuncio`, `Descricao_status_anuncio`) VALUES ('7', 'Rejeitado');

-- Dados da tabela `status_aprovacao`
TRUNCATE TABLE `status_aprovacao`;
INSERT INTO `status_aprovacao` (`ID_Status_Aprovacao`, `Descricao_Status_aprovacao`) VALUES ('1', 'Pendente');
INSERT INTO `status_aprovacao` (`ID_Status_Aprovacao`, `Descricao_Status_aprovacao`) VALUES ('2', 'Aprovado');
INSERT INTO `status_aprovacao` (`ID_Status_Aprovacao`, `Descricao_Status_aprovacao`) VALUES ('3', 'Rejeitado');

-- Dados da tabela `status_mensagem`
TRUNCATE TABLE `status_mensagem`;
INSERT INTO `status_mensagem` (`ID_Status_Mensagem`, `Descricao_status_mensagem`) VALUES ('1', 'Não Lida');
INSERT INTO `status_mensagem` (`ID_Status_Mensagem`, `Descricao_status_mensagem`) VALUES ('2', 'Lida');
INSERT INTO `status_mensagem` (`ID_Status_Mensagem`, `Descricao_status_mensagem`) VALUES ('3', 'Enviada');
INSERT INTO `status_mensagem` (`ID_Status_Mensagem`, `Descricao_status_mensagem`) VALUES ('5', 'Arquivada');

-- Dados da tabela `status_reclamacao`
TRUNCATE TABLE `status_reclamacao`;
INSERT INTO `status_reclamacao` (`ID_Status_Reclamacao`, `Descricao_status_reclamacao`) VALUES ('1', 'Pendente');
INSERT INTO `status_reclamacao` (`ID_Status_Reclamacao`, `Descricao_status_reclamacao`) VALUES ('3', 'Resolvida');
INSERT INTO `status_reclamacao` (`ID_Status_Reclamacao`, `Descricao_status_reclamacao`) VALUES ('4', 'Rejeitada');
INSERT INTO `status_reclamacao` (`ID_Status_Reclamacao`, `Descricao_status_reclamacao`) VALUES ('5', 'Recebida');

-- Dados da tabela `status_troca`
TRUNCATE TABLE `status_troca`;
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES ('1', 'Pendente');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES ('2', 'Aceita');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES ('3', 'Rejeitada');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES ('4', 'Cancelada');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES ('5', 'Solicitada');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES ('6', 'Aceita');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES ('7', 'Recusada');
INSERT INTO `status_troca` (`ID_Status_Troca`, `Descricao_status_troca`) VALUES ('8', 'Concluída');

-- Dados da tabela `status_utilizador`
TRUNCATE TABLE `status_utilizador`;
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES ('1', 'Pendente');
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES ('2', 'Ativo');
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES ('3', 'Inativo');
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES ('4', 'Bloqueado');
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES ('5', 'Banido');
INSERT INTO `status_utilizador` (`ID_status_utilizador`, `Descricao_status_utilizador`) VALUES ('8', 'Rejeitado');

-- Dados da tabela `tipo_item`
TRUNCATE TABLE `tipo_item`;
INSERT INTO `tipo_item` (`ID_Tipo`, `Descricao_TipoItem`) VALUES ('1', 'Produto');
INSERT INTO `tipo_item` (`ID_Tipo`, `Descricao_TipoItem`) VALUES ('2', 'Serviço');
INSERT INTO `tipo_item` (`ID_Tipo`, `Descricao_TipoItem`) VALUES ('3', 'Doação');

-- Dados da tabela `tipo_notificacao`
TRUNCATE TABLE `tipo_notificacao`;
INSERT INTO `tipo_notificacao` (`ID_TipoNotificacao`, `Descricao`) VALUES ('3', 'Redefinição de Senha');

-- Dados da tabela `tipouser`
TRUNCATE TABLE `tipouser`;
INSERT INTO `tipouser` (`ID_TipoUser`, `Descrição_TipoUtilizador`) VALUES ('1', 'Administrador');
INSERT INTO `tipouser` (`ID_TipoUser`, `Descrição_TipoUtilizador`) VALUES ('2', 'Utilizador Normal');

-- Dados da tabela `utilizador`
TRUNCATE TABLE `utilizador`;
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES ('1', 'admin', 'Administrador', '1990-01-01', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '12345678', 'admin@example.com', '1', '1', NULL, '1', '1', '2');
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES ('2', 'user', 'Usuário Normal', '1995-05-05', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '87654321', 'user@example.com', '2', '2', NULL, '2', '1', '2');
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES ('3', 'VitorLeite', 'Vitor', '1999-10-01', '$2y$12$F4RUEOD4RAh4lRjvvhe2GeTHn9Jbfrit29D9nNb4jhDopLOE22heG', '212233333', 'vitor@example.com', '15', '22', NULL, '2', '4', '2');
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES ('4', 'JoanaBabe', 'Joana', '2001-05-29', '$2y$12$qkiovJb2MBGnrlWBPTMti.eiRRZShJwzfuQYUW6roQMbqoSAmZogq', '45345346', 'joana@example.com', '1', '24', NULL, '2', '5', '8');
INSERT INTO `utilizador` (`ID_User`, `User_Name`, `Name`, `Data_Nascimento`, `Password`, `CC`, `Email`, `MoradaID_Morada`, `AprovacaoID_aprovacao`, `cartaoID_Cartao`, `TipoUserID_TipoUser`, `ImagemID_Imagem`, `Status_UtilizadorID_status_utilizador`) VALUES ('5', 'vilastheboy', 'Vilas', '2003-01-07', '$2y$12$O6s6K9ioXISMkN127QNJUeJra1MDyYT4ZW8kBnO9AEb36WnyNKloe', '34354363', 'vilas@example.com', '3', '25', NULL, '2', '6', '1');

SET FOREIGN_KEY_CHECKS=1;
