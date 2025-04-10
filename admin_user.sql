-- Script para criar apenas o usuário administrador
-- Desabilitar verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS=0;

-- Verificar se já existe uma morada com ID 1
INSERT INTO Morada (ID_Morada, Rua)
SELECT 1, 'Rua do Administrador, 123'
WHERE NOT EXISTS (SELECT 1 FROM Morada WHERE ID_Morada = 1);

-- Verificar se já existe uma imagem com ID 1
INSERT INTO Imagem (ID_Imagem, Caminho)
SELECT 1, 'public/perfil/default.png'
WHERE NOT EXISTS (SELECT 1 FROM Imagem WHERE ID_Imagem = 1);

-- Criar o usuário administrador diretamente
-- Nota: A senha é 'password'
INSERT INTO Utilizador (ID_User, User_Name, Name, Data_Nascimento, Password, CC, Email, MoradaID_Morada, TipoUserID_TipoUser, ImagemID_Imagem, Status_UtilizadorID_status_utilizador)
SELECT 1, 'admin', 'Administrador', '1990-01-01', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '12345678', 'admin@example.com', 1, 1, 1, 1
WHERE NOT EXISTS (SELECT 1 FROM Utilizador WHERE ID_User = 1);

-- Reabilitar verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS=1;
