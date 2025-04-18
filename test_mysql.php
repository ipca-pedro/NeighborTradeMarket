<?php
$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = '';
$dbName = 'db_nt';

try {
    // Tentar conectar ao MySQL
    $mysqli = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

    if ($mysqli->connect_error) {
        die("Erro de conexão: " . $mysqli->connect_error);
    }

    // Verificar se o banco existe
    $result = $mysqli->query("SELECT DATABASE()");
    $row = $result->fetch_row();
    echo "Banco de dados conectado: " . $row[0] . "\n";

    // Verificar permissões do usuário
    $result = $mysqli->query("SHOW GRANTS");
    echo "\nPermissões do usuário:\n";
    while ($row = $result->fetch_row()) {
        echo $row[0] . "\n";
    }

    // Verificar se o mysqldump está acessível
    $mysqldump = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
    if (file_exists($mysqldump)) {
        echo "\nmysqldump encontrado em: " . $mysqldump . "\n";
    } else {
        echo "\nERRO: mysqldump não encontrado em: " . $mysqldump . "\n";
    }

    $mysqli->close();

} catch (Exception $e) {
    die("Erro: " . $e->getMessage());
} 