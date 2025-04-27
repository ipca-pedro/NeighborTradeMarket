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
    // Lê o arquivo .env linha por linha para evitar problemas com sintaxe
    $env_file = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    
    foreach ($env_file as $line) {
        // Ignora comentários
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Processa linhas com formato KEY=VALUE
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Remove aspas se existirem
            if (strpos($value, '"') === 0 && strrpos($value, '"') === strlen($value) - 1) {
                $value = substr($value, 1, -1);
            } elseif (strpos($value, "'") === 0 && strrpos($value, "'") === strlen($value) - 1) {
                $value = substr($value, 1, -1);
            }
            
            $env[$key] = $value;
        }
    }
} else {
    die("Arquivo .env não encontrado.\n");
}

// Configurações do banco de dados a partir do .env
$db_host = $env['DB_HOST'] ?? 'localhost';
$db_name = $env['DB_DATABASE'] ?? 'db_nt'; // Nome correto do banco de dados
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

// Função para verificar se uma tabela existe
function tableExists($pdo, $table) {
    try {
        $result = $pdo->query("SHOW TABLES LIKE '$table'");
        return $result->rowCount() > 0;
    } catch (PDOException $e) {
        return false;
    }
}

// Função para criar tabelas do Laravel que podem estar faltando
function createLaravelTables($pdo) {
    $laravelTables = [
        'cache' => "CREATE TABLE `cache` (
            `key` VARCHAR(255) NOT NULL,
            `value` MEDIUMTEXT NOT NULL,
            `expiration` INT(11) NOT NULL,
            PRIMARY KEY (`key`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
        
        'cache_locks' => "CREATE TABLE `cache_locks` (
            `key` VARCHAR(255) NOT NULL,
            `owner` VARCHAR(255) NOT NULL,
            `expiration` INT(11) NOT NULL,
            PRIMARY KEY (`key`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
        
        'jobs' => "CREATE TABLE `jobs` (
            `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            `queue` VARCHAR(255) NOT NULL,
            `payload` LONGTEXT NOT NULL,
            `attempts` TINYINT(3) UNSIGNED NOT NULL,
            `reserved_at` INT(10) UNSIGNED DEFAULT NULL,
            `available_at` INT(10) UNSIGNED NOT NULL,
            `created_at` INT(10) UNSIGNED NOT NULL,
            PRIMARY KEY (`id`),
            KEY `jobs_queue_index` (`queue`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
        
        'failed_jobs' => "CREATE TABLE `failed_jobs` (
            `id` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            `uuid` VARCHAR(255) NOT NULL,
            `connection` TEXT NOT NULL,
            `queue` TEXT NOT NULL,
            `payload` LONGTEXT NOT NULL,
            `exception` LONGTEXT NOT NULL,
            `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`),
            UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",
        
        'sessions' => "CREATE TABLE `sessions` (
            `id` VARCHAR(255) NOT NULL,
            `user_id` BIGINT(20) UNSIGNED DEFAULT NULL,
            `ip_address` VARCHAR(45) DEFAULT NULL,
            `user_agent` TEXT DEFAULT NULL,
            `payload` TEXT NOT NULL,
            `last_activity` INT(11) NOT NULL,
            PRIMARY KEY (`id`),
            KEY `sessions_user_id_index` (`user_id`),
            KEY `sessions_last_activity_index` (`last_activity`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
    ];
    
    foreach ($laravelTables as $table => $createSql) {
        if (!tableExists($pdo, $table)) {
            echo "Criando tabela $table que está faltando...\n";
            try {
                $pdo->exec($createSql);
                echo "Tabela $table criada com sucesso.\n";
            } catch (PDOException $e) {
                echo "Erro ao criar tabela $table: " . $e->getMessage() . "\n";
            }
        }
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
        
        // Criar tabelas do Laravel que podem estar faltando
        createLaravelTables($pdo);
        
        // Ler o arquivo de dump
        $sql = file_get_contents($dump_file);
        
        // Desabilitar verificação de chaves estrangeiras
        $pdo->exec("SET FOREIGN_KEY_CHECKS=0");
        
        // Executar as consultas SQL
        $statements = explode(";\n", $sql);
        foreach ($statements as $statement) {
            $statement = trim($statement);
            if (!empty($statement)) {
                // Verificar se é um TRUNCATE e se a tabela existe
                if (preg_match('/TRUNCATE TABLE `([^`]+)`/', $statement, $matches)) {
                    $tableName = $matches[1];
                    if (!tableExists($pdo, $tableName)) {
                        echo "Pulando TRUNCATE para tabela inexistente: $tableName\n";
                        continue;
                    }
                }
                
                // Verificar se é um INSERT e se a tabela existe
                if (preg_match('/INSERT INTO `([^`]+)`/', $statement, $matches)) {
                    $tableName = $matches[1];
                    if (!tableExists($pdo, $tableName)) {
                        echo "Pulando INSERT para tabela inexistente: $tableName\n";
                        continue;
                    }
                }
                
                // Exibir apenas os primeiros 50 caracteres para não poluir o terminal
                $preview = substr($statement, 0, 50) . (strlen($statement) > 50 ? '...' : '');
                echo "Executando: $preview\n";
                
                try {
                    $pdo->exec($statement);
                } catch (PDOException $e) {
                    echo "Erro ao executar: $preview\n";
                    echo "Mensagem de erro: " . $e->getMessage() . "\n";
                    // Continua a execução mesmo com erro
                }
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
