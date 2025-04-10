<?php
// Configurações do banco de dados
$host = 'localhost';
$dbname = 'db_nt';
$username = 'root';
$password = '';

try {
    // Conectar ao banco de dados
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Conectado ao banco de dados com sucesso!\n";
    
    // Desativar verificação de chaves estrangeiras
    $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
    
    // Verificar a estrutura da tabela Utilizador
    $stmt = $pdo->query("DESCRIBE Utilizador");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Estrutura da tabela Utilizador:\n";
    foreach ($columns as $column) {
        echo "- " . $column['Field'] . " (" . $column['Type'] . ") " . 
             ($column['Null'] === 'NO' ? 'NOT NULL' : 'NULL') . 
             (isset($column['Default']) ? " DEFAULT '" . $column['Default'] . "'" : "") . "\n";
    }
    
    // Verificar se o campo AprovacaoID_aprovacao é obrigatório
    $aprovacaoRequired = false;
    foreach ($columns as $column) {
        if ($column['Field'] === 'AprovacaoID_aprovacao' && $column['Null'] === 'NO') {
            $aprovacaoRequired = true;
            break;
        }
    }
    
    echo "\nO campo AprovacaoID_aprovacao é " . ($aprovacaoRequired ? "obrigatório" : "opcional") . ".\n";
    
    // Verificar a estrutura da tabela Aprovacao
    $stmt = $pdo->query("DESCRIBE Aprovacao");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "\nEstrutura da tabela Aprovacao:\n";
    foreach ($columns as $column) {
        echo "- " . $column['Field'] . " (" . $column['Type'] . ") " . 
             ($column['Null'] === 'NO' ? 'NOT NULL' : 'NULL') . 
             (isset($column['Default']) ? " DEFAULT '" . $column['Default'] . "'" : "") . "\n";
    }
    
    // Inserir dados de teste
    echo "\nInserindo dados de teste...\n";
    
    // Verificar se já existe uma imagem com ID 1
    $stmt = $pdo->query("SELECT COUNT(*) FROM Imagem WHERE ID_Imagem = 1");
    if ($stmt->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO Imagem (ID_Imagem, Caminho) VALUES (1, 'public/perfil/default.png')");
        echo "Imagem padrão criada.\n";
    } else {
        echo "Imagem padrão já existe.\n";
    }
    
    // Verificar se já existe uma morada com ID 1
    $stmt = $pdo->query("SELECT COUNT(*) FROM Morada WHERE ID_Morada = 1");
    if ($stmt->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO Morada (ID_Morada, Rua) VALUES (1, 'Rua do Administrador, 123')");
        echo "Morada do administrador criada.\n";
    } else {
        echo "Morada do administrador já existe.\n";
    }
    
    // Verificar se já existe uma morada com ID 2
    $stmt = $pdo->query("SELECT COUNT(*) FROM Morada WHERE ID_Morada = 2");
    if ($stmt->fetchColumn() == 0) {
        $pdo->exec("INSERT INTO Morada (ID_Morada, Rua) VALUES (2, 'Rua do Usuário, 456')");
        echo "Morada do usuário normal criada.\n";
    } else {
        echo "Morada do usuário normal já existe.\n";
    }
    
    // Verificar se já existe um aprovação com ID 1
    $stmt = $pdo->query("SELECT COUNT(*) FROM Aprovacao WHERE ID_aprovacao = 1");
    if ($stmt->fetchColumn() == 0) {
        // Criar aprovação para o administrador (sem UtilizadorID_Admin por enquanto)
        $sql = "INSERT INTO Aprovacao (ID_aprovacao, Comentario, Data_Submissao, Data_Aprovacao, Status_AprovacaoID_Status_Aprovacao) 
                VALUES (1, 'Administrador do sistema', NOW(), NOW(), 1)";
        $pdo->exec($sql);
        echo "Aprovação do administrador criada.\n";
    } else {
        echo "Aprovação do administrador já existe.\n";
    }
    
    // Verificar se já existe um usuário com ID 1
    $stmt = $pdo->query("SELECT COUNT(*) FROM Utilizador WHERE ID_User = 1");
    if ($stmt->fetchColumn() == 0) {
        // Criar o administrador
        $sql = "INSERT INTO Utilizador (ID_User, User_Name, Name, Data_Nascimento, Password, CC, Email, MoradaID_Morada, AprovacaoID_aprovacao, TipoUserID_TipoUser, ImagemID_Imagem, Status_UtilizadorID_status_utilizador) 
                VALUES (1, 'admin', 'Administrador', '1990-01-01', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '12345678', 'admin@example.com', 1, 1, 1, 1, 1)";
        $pdo->exec($sql);
        echo "Administrador criado com sucesso!\n";
    } else {
        echo "Administrador já existe.\n";
    }
    
    // Atualizar o UtilizadorID_Admin na aprovação
    $pdo->exec("UPDATE Aprovacao SET UtilizadorID_Admin = 1 WHERE ID_aprovacao = 1");
    echo "UtilizadorID_Admin atualizado na aprovação do administrador.\n";
    
    // Verificar se já existe uma aprovação com ID 2
    $stmt = $pdo->query("SELECT COUNT(*) FROM Aprovacao WHERE ID_aprovacao = 2");
    if ($stmt->fetchColumn() == 0) {
        // Criar aprovação para o usuário normal
        $sql = "INSERT INTO Aprovacao (ID_aprovacao, Comentario, Data_Submissao, Data_Aprovacao, UtilizadorID_Admin, Status_AprovacaoID_Status_Aprovacao) 
                VALUES (2, 'Usuário de teste', NOW(), NOW(), 1, 1)";
        $pdo->exec($sql);
        echo "Aprovação do usuário normal criada.\n";
    } else {
        echo "Aprovação do usuário normal já existe.\n";
    }
    
    // Verificar se já existe um usuário com ID 2
    $stmt = $pdo->query("SELECT COUNT(*) FROM Utilizador WHERE ID_User = 2");
    if ($stmt->fetchColumn() == 0) {
        // Criar o usuário normal
        $sql = "INSERT INTO Utilizador (ID_User, User_Name, Name, Data_Nascimento, Password, CC, Email, MoradaID_Morada, AprovacaoID_aprovacao, TipoUserID_TipoUser, ImagemID_Imagem, Status_UtilizadorID_status_utilizador) 
                VALUES (2, 'user', 'Usuário Normal', '1995-05-05', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '87654321', 'user@example.com', 2, 2, 2, 1, 1)";
        $pdo->exec($sql);
        echo "Usuário normal criado com sucesso!\n";
    } else {
        echo "Usuário normal já existe.\n";
    }
    
    // Reativar verificação de chaves estrangeiras
    $pdo->exec("SET FOREIGN_KEY_CHECKS=1");
    
    echo "\nProcesso concluído com sucesso!\n";
    
} catch (PDOException $e) {
    echo "Erro: " . $e->getMessage() . "\n";
} finally {
    // Fechar a conexão
    $pdo = null;
}
