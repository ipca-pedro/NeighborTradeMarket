<?php
// Configurações
$backupDir = __DIR__ . '/backups/';
$maxBackups = 5; // Número máximo de backups a manter
$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = '';
$dbName = 'db_nt';

// Função para log
function writeLog($message, $isError = false) {
    global $backupDir;
    $logPrefix = date('Y-m-d H:i:s') . ($isError ? " [ERRO] " : " [INFO] ");
    file_put_contents($backupDir . 'backup.log', $logPrefix . $message . "\n", FILE_APPEND);
}

// Criar diretório de backup se não existir
if (!file_exists($backupDir)) {
    mkdir($backupDir, 0755, true);
    writeLog("Diretório de backup criado: {$backupDir}");
}

// Nome do arquivo de backup
$backupFile = 'backup_' . date('Y-m-d_H-i-s') . '.sql';

// Verificar se o mysqldump existe
$mysqldump = 'C:\\xampp\\mysql\\bin\\mysqldump.exe';
if (!file_exists($mysqldump)) {
    writeLog("mysqldump não encontrado em: {$mysqldump}", true);
    die("Erro: mysqldump não encontrado");
}

// Comando para fazer o backup
// Opções importantes:
// --opt: Equivalente a --add-drop-table --add-locks --create-options --disable-keys --extended-insert --lock-tables --quick --set-charset
// --complete-insert: Usa nomes de colunas em INSERT
// --skip-extended-insert: Um INSERT por linha (mais legível)
// --routines: Inclui stored procedures e functions
// --triggers: Inclui triggers
$command = sprintf(
    '"%s" --opt --user=%s --host=%s --complete-insert --skip-extended-insert --routines --triggers --default-character-set=utf8mb4 %s > "%s%s" 2>&1',
    $mysqldump,
    escapeshellarg($dbUser),
    escapeshellarg($dbHost),
    escapeshellarg($dbName),
    $backupDir,
    $backupFile
);

// Executar o backup
writeLog("Iniciando backup...");
writeLog("Comando: " . $command);

exec($command, $output, $returnVar);

// Verificar o resultado
if ($returnVar === 0 && file_exists($backupDir . $backupFile) && filesize($backupDir . $backupFile) > 0) {
    writeLog("Backup realizado com sucesso: {$backupFile}");
    
    // Verificar o conteúdo do backup
    $content = file_get_contents($backupDir . $backupFile);
    $insertCount = substr_count($content, 'INSERT INTO');
    writeLog("Número de INSERTs no backup: {$insertCount}");
    
    // Mostrar tabelas incluídas
    preg_match_all('/CREATE TABLE `([^`]+)`/', $content, $matches);
    writeLog("\nTabelas incluídas no backup:");
    foreach ($matches[1] as $table) {
        writeLog("- " . $table);
    }
    
    // Limpar backups antigos
    $backups = glob($backupDir . 'backup_*.sql');
    if (count($backups) > $maxBackups) {
        // Ordenar por data (mais antigo primeiro)
        usort($backups, function($a, $b) {
            return filemtime($a) - filemtime($b);
        });
        
        // Remover backups antigos
        $toDelete = count($backups) - $maxBackups;
        for ($i = 0; $i < $toDelete; $i++) {
            if (unlink($backups[$i])) {
                writeLog("Backup antigo removido: " . basename($backups[$i]));
            } else {
                writeLog("Erro ao remover backup antigo: " . basename($backups[$i]), true);
            }
        }
    }
    
    echo "Backup concluído com sucesso!\n";
    echo "Arquivo: " . $backupDir . $backupFile . "\n";
    echo "Tamanho: " . round(filesize($backupDir . $backupFile) / 1024, 2) . " KB\n";
    echo "INSERTs: " . $insertCount . "\n";
    
} else {
    // Log detalhado do erro
    writeLog("Erro ao realizar backup", true);
    writeLog("Código de retorno: {$returnVar}", true);
    if (!empty($output)) {
        writeLog("Saída do comando:", true);
        foreach ($output as $line) {
            writeLog($line, true);
        }
    }
    if (!file_exists($backupDir . $backupFile)) {
        writeLog("Arquivo de backup não foi criado", true);
    } elseif (filesize($backupDir . $backupFile) === 0) {
        writeLog("Arquivo de backup está vazio", true);
    }
    
    echo "Erro ao criar backup. Verifique o arquivo de log para mais detalhes.\n";
} 