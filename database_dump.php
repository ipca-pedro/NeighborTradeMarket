<?php
/**
 * Database Dump Utility for NeighborTrade
 * 
 * Este script permite exportar e importar dados do banco de dados
 * para facilitar a sincronização entre ambientes de desenvolvimento.
 * 
 * Uso:
 * - Para exportar: php database_dump.php export
 * - Para importar: php database_dump.php import
 */

// Carregar as configurações do .env
if (file_exists(__DIR__ . '/.env')) {
    $env = parse_ini_file(__DIR__ . '/.env');
} else {
    die("Arquivo .env não encontrado.\n");
}

// Configurações do banco de dados a partir do .env
$db_host = $env['DB_HOST'] ?? 'localhost';
$db_name = $env['DB_DATABASE'] ?? 'neighbortrademarket';
$db_user = $env['DB_USERNAME'] ?? 'root';
$db_pass = $env['DB_PASSWORD'] ?? '';
$db_port = $env['DB_PORT'] ?? '3306';

// Nome do arquivo de dump
$dump_file = __DIR__ . '/database_dump.sql';

// Função para conectar ao banco de dados
function connectToDatabase($host, $user, $pass, $name, $port) {
    try {
        $dsn = "mysql:host=$host;port=$port;dbname=$name;charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        $pdo = new PDO($dsn, $user, $pass, $options);
        return $pdo;
    } catch (PDOException $e) {
        die("Erro de conexão: " . $e->getMessage() . "\n");
    }
}

// Função para exportar os dados
function exportDatabase($pdo, $dump_file) {
    try {
        // Obter todas as tabelas do banco de dados
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (empty($tables)) {
            echo "Nenhuma tabela encontrada no banco de dados.\n";
            return false;
        }
        
        // Iniciar o arquivo de dump
        $dump = "-- NeighborTrade Database Dump\n";
        $dump .= "-- Gerado em: " . date('Y-m-d H:i:s') . "\n\n";
        $dump .= "SET FOREIGN_KEY_CHECKS=0;\n\n";
        
        // Para cada tabela, exportar os dados
        foreach ($tables as $table) {
            echo "Exportando tabela: $table\n";
            
            // Obter estrutura da tabela
            $stmt = $pdo->query("DESCRIBE `$table`");
            $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
            
            // Obter dados da tabela
            $stmt = $pdo->query("SELECT * FROM `$table`");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (!empty($rows)) {
                $dump .= "-- Dados da tabela `$table`\n";
                $dump .= "TRUNCATE TABLE `$table`;\n";
                
                foreach ($rows as $row) {
                    $values = [];
                    foreach ($row as $value) {
                        if ($value === null) {
                            $values[] = "NULL";
                        } else {
                            $values[] = $pdo->quote($value);
                        }
                    }
                    
                    $dump .= "INSERT INTO `$table` (`" . implode("`, `", $columns) . "`) VALUES (" . implode(", ", $values) . ");\n";
                }
                
                $dump .= "\n";
            }
        }
        
        $dump .= "SET FOREIGN_KEY_CHECKS=1;\n";
        
        // Salvar o dump em um arquivo
        if (file_put_contents($dump_file, $dump)) {
            echo "Dump concluído com sucesso. Arquivo salvo em: $dump_file\n";
            return true;
        } else {
            echo "Erro ao salvar o arquivo de dump.\n";
            return false;
        }
    } catch (PDOException $e) {
        echo "Erro ao exportar o banco de dados: " . $e->getMessage() . "\n";
        return false;
    }
}

// Função para importar os dados
function importDatabase($pdo, $dump_file) {
    try {
        if (!file_exists($dump_file)) {
            echo "Arquivo de dump não encontrado: $dump_file\n";
            return false;
        }
        
        echo "Importando dados do arquivo: $dump_file\n";
        
        // Ler o arquivo de dump
        $sql = file_get_contents($dump_file);
        
        // Desabilitar verificação de chaves estrangeiras
        $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
        
        // Executar as consultas SQL
        $statements = explode(";\n", $sql);
        foreach ($statements as $statement) {
            $statement = trim($statement);
            if (!empty($statement)) {
                // Exibir apenas os primeiros 50 caracteres para não poluir o terminal
                $preview = substr($statement, 0, 50) . (strlen($statement) > 50 ? '...' : '');
                echo "Executando: $preview\n";
                
                $pdo->exec($statement);
            }
        }
        
        // Habilitar verificação de chaves estrangeiras
        $pdo->exec("SET FOREIGN_KEY_CHECKS=1");
        
        echo "Importação concluída com sucesso.\n";
        return true;
    } catch (PDOException $e) {
        echo "Erro ao importar o banco de dados: " . $e->getMessage() . "\n";
        return false;
    }
}

// Verificar os argumentos da linha de comando
if ($argc < 2) {
    echo "Uso: php database_dump.php [export|import]\n";
    exit(1);
}

$action = strtolower($argv[1]);

// Conectar ao banco de dados
$pdo = connectToDatabase($db_host, $db_user, $db_pass, $db_name, $db_port);

// Executar a ação solicitada
switch ($action) {
    case 'export':
        exportDatabase($pdo, $dump_file);
        break;
    
    case 'import':
        importDatabase($pdo, $dump_file);
        break;
    
    default:
        echo "Ação desconhecida: $action\n";
        echo "Uso: php database_dump.php [export|import]\n";
        exit(1);
}
