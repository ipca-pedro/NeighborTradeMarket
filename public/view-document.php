<?php

// Get the image ID from the query string
$imageId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if (!$imageId) {
    die('ID da imagem não fornecido');
}

// Connect to the database
$host = 'localhost';
$db = 'neighbortrade'; // Adjust this to your actual database name
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die('Erro de conexão: ' . $e->getMessage());
}

// Get the image path from the database
$stmt = $pdo->prepare("SELECT Caminho FROM imagem WHERE ID_Imagem = ?");
$stmt->execute([$imageId]);
$imagem = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$imagem) {
    die('Imagem não encontrada');
}

// Get the file path
$filePath = $imagem['Caminho'];

// Try different path variations
$pathVariations = [
    // Absolute paths
    __DIR__ . '/../storage/app/' . $filePath,
    __DIR__ . '/../storage/app/public/' . str_replace('public/', '', $filePath),
    __DIR__ . '/../storage/app/' . str_replace('public/', '', $filePath),
    // Relative paths from this script
    '../storage/app/' . $filePath,
    '../storage/app/public/' . str_replace('public/', '', $filePath),
    '../storage/app/' . str_replace('public/', '', $filePath),
];

$foundPath = null;

// Check each path variation
foreach ($pathVariations as $path) {
    if (file_exists($path)) {
        $foundPath = $path;
        break;
    }
}

if (!$foundPath) {
    echo "Arquivo não encontrado. Caminhos testados:<br>";
    echo "<pre>";
    print_r($pathVariations);
    echo "</pre>";
    echo "Caminho no banco de dados: " . $filePath;
    die();
}

// Get the file extension
$extension = pathinfo($foundPath, PATHINFO_EXTENSION);

// Set the appropriate content type
$contentTypes = [
    'pdf' => 'application/pdf',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png',
];

$contentType = isset($contentTypes[$extension]) ? $contentTypes[$extension] : 'application/octet-stream';

// Output the file
header('Content-Type: ' . $contentType);
header('Content-Disposition: inline; filename="' . basename($foundPath) . '"');
header('Content-Length: ' . filesize($foundPath));
readfile($foundPath);
exit;
