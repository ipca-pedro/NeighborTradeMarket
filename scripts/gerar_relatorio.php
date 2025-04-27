<?php

echo "Iniciando geracao do relatorio...\n";

// Defina o caminho absoluto para o autoload
require 'C:/xampp/htdocs/NT/vendor/autoload.php'; // Caminho absoluto para o autoload
echo "Autoload carregado.\n";

use Dompdf\Dompdf;
use Dompdf\Options;

// Ajuste o caminho para o arquivo resultado_final.txt
$arquivo_final = 'C:/xampp/htdocs/NT/resultado_final.txt';

if (!file_exists($arquivo_final)) {
    echo "Arquivo resultado_final.txt nao encontrado.\n";
    exit(1);
}

echo "Lendo resultado_final.txt...\n";
$resultado = file_get_contents($arquivo_final);

$options = new Options();
$options->set('defaultFont', 'Arial');
$dompdf = new Dompdf($options);

echo "Gerando HTML...\n";

// Definir estilo e estrutura visual amigável
$html = '
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            color: #333;
        }
        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        h1 {
            font-size: 24px;
            color: #2c3e50;
            text-align: center;
            margin-bottom: 20px;
        }
        h2 {
            font-size: 18px;
            color: #34495e;
            margin-top: 20px;
            text-align: left;
        }
        .test-result {
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .pass {
            background-color: #28a745;
            color: #fff;
        }
        .fail {
            background-color: #dc3545;
            color: #fff;
        }
        .warn {
            background-color: #ffc107;
            color: #fff;
        }
        pre {
            background: #eaeaea;
            padding: 15px;
            border-radius: 5px;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 14px;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }
        .footer p {
            margin: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Relatório de Resultados dos Testes</h1>';

        // Processando e formatando os resultados dos testes
        $linhas = explode("\n", $resultado);
        $passados = [];
        $falhados = [];
        $avisos = [];

        foreach ($linhas as $linha) {
            // Ignorar avisos de metadata deprecated e tratá-los como Passados
            if (strpos($linha, 'Metadata in doc-comments is deprecated') !== false) {
                $passados[] = $linha; // Ignorar e considerar como Passado
            } elseif (strpos($linha, 'PASS') !== false) {
                $passados[] = $linha;
            } elseif (strpos($linha, 'FAIL') !== false) {
                $falhados[] = $linha;
            } elseif (strpos($linha, 'WARN') !== false) {
                $avisos[] = $linha;
            }
        }

        // Exibindo os resultados de teste
        $html .= "<h2>Testes Passados:</h2>";
        foreach ($passados as $teste) {
            $html .= '<div class="test-result pass">' . htmlspecialchars($teste) . '</div>';
        }

        $html .= "<h2>Testes Falhados:</h2>";
        foreach ($falhados as $teste) {
            $html .= '<div class="test-result fail">' . htmlspecialchars($teste) . '</div>';
        }

        $html .= "<h2>Testes com Avisos:</h2>";
        foreach ($avisos as $teste) {
            $html .= '<div class="test-result warn">' . htmlspecialchars($teste) . '</div>';
        }

        $html .= '
        <div class="footer">
            <p>Relatório gerado automaticamente</p>
            <p>&copy; 2025 NeighborTrade - Todos os direitos reservados</p>
        </div>
    </div>
</body>
</html>';

$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();

echo "Salvando PDF...\n";
file_put_contents('relatorio_testes.pdf', $dompdf->output());

echo "Relatório gerado com sucesso!\n";
