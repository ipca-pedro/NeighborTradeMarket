<?php
$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = '';
$dbName = 'db_nt';

try {
    $mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

    if ($mysqli->connect_error) {
        die("Erro de conexão: " . $mysqli->connect_error);
    }

    // Drop table if exists (para evitar conflitos)
    $mysqli->query("DROP TABLE IF EXISTS `Notificacao`");
    echo "Tabela antiga removida (se existia)\n";

    // Criar a tabela Notificacao com a estrutura correta
    $sql = "CREATE TABLE `Notificacao` (
        `ID_Notificacao` int(11) NOT NULL AUTO_INCREMENT,
        `Mensagem` varchar(255) DEFAULT NULL,
        `DataNotificacao` timestamp NULL DEFAULT NULL,
        `ReferenciaID` int(11) DEFAULT NULL,
        `UtilizadorID_User` int(10) NOT NULL,
        `ReferenciaTipoID_ReferenciaTipo` int(11) NOT NULL,
        `TIpo_notificacaoID_TipoNotificacao` int(11) NOT NULL,
        PRIMARY KEY (`ID_Notificacao`),
        KEY `FKNotificaca913403` (`UtilizadorID_User`),
        KEY `FKNotificaca154395` (`ReferenciaTipoID_ReferenciaTipo`),
        KEY `FKNotificaca714377` (`TIpo_notificacaoID_TipoNotificacao`),
        CONSTRAINT `FKNotificaca154395` FOREIGN KEY (`ReferenciaTipoID_ReferenciaTipo`) REFERENCES `ReferenciaTipo` (`ID_ReferenciaTipo`),
        CONSTRAINT `FKNotificaca714377` FOREIGN KEY (`TIpo_notificacaoID_TipoNotificacao`) REFERENCES `TIpo_notificacao` (`ID_TipoNotificacao`),
        CONSTRAINT `FKNotificaca913403` FOREIGN KEY (`UtilizadorID_User`) REFERENCES `Utilizador` (`ID_User`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

    if ($mysqli->query($sql)) {
        echo "Tabela Notificacao criada com sucesso!\n";
    } else {
        echo "Erro ao criar tabela: " . $mysqli->error . "\n";
    }

    $mysqli->close();

} catch (Exception $e) {
    die("Erro: " . $e->getMessage());
} 