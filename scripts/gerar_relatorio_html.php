<?php

echo "Iniciando geracao do relatorio HTML...\n";

// Defina o caminho relativo para o arquivo resultado_final.txt
$arquivo_final = __DIR__ . '/../resultado_final.txt';

if (!file_exists($arquivo_final)) {
    echo "Arquivo resultado_final.txt nao encontrado.\n";
    exit(1);
}

echo "Lendo resultado_final.txt: {$arquivo_final}\n";
if (filesize($arquivo_final) == 0) {
    echo "AVISO: O arquivo de resultados está vazio!\n";
    $resultado = "";
} else {
    $resultado = file_get_contents($arquivo_final);
    echo "Tamanho do arquivo: " . strlen($resultado) . " bytes\n";
}

// Processando os resultados dos testes
$linhas = explode("\n", $resultado);
$passados = [];
$falhados = [];
$avisos = [];
$skipped = [];
$incompletos = [];
$erros = [];
$total_testes = 0;

echo "Total de linhas encontradas: " . count($linhas) . "\n";

$currentBlock = null;
foreach ($linhas as $linha) {
    $linha = trim($linha);
    if (empty($linha)) {
        $currentBlock = null;
        continue;
    }
    if (strpos($linha, 'Metadata in doc-comments is deprecated') !== false) {
        continue;
    }

    // Falha real: linha com FAIL ou FAILURE
    if (preg_match('/FAIL(URE)?/i', $linha)) {
        $falhados[] = $linha;
        $total_testes++;
        $currentBlock = null;
        continue;
    }

    // ✓ = passed
    if (strpos($linha, '✓') === 0) {
        $passados[] = $linha;
        $total_testes++;
        continue;
    }

    // - = skipped
    if (strpos($linha, '-') === 0) {
        $skipped[] = $linha;
        $total_testes++;
        continue;
    }

    // Avisos
    if (stripos($linha, 'WARN') === 0 || stripos($linha, 'WARNING') === 0) {
        $avisos[] = $linha;
        $total_testes++;
        continue;
    }

    // Incompletos
    if (stripos($linha, 'INCOMPLETE') === 0) {
        $incompletos[] = $linha;
        $total_testes++;
        continue;
    }

    // Erros
    if (stripos($linha, 'ERROR') === 0) {
        $erros[] = $linha;
        $total_testes++;
        continue;
    }
}


echo "Testes encontrados: Passados={" . count($passados) . "}, Falhas={" . count($falhados) . "}, Avisos={" . count($avisos) . "}\n";

$data = date('Y-m-d H:i:s');
$passados_count = count($passados);
$falhados_count = count($falhados);
$avisos_count = count($avisos);
$skipped_count = count($skipped);
$incompletos_count = count($incompletos);
$erros_count = count($erros);
$html = <<<HTML
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Testes - NeighborTrade</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #eee;
        }
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .card {
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            transition: transform 0.2s;
        }
        .card:hover {
            transform: translateY(-5px);
        }
        .chart-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto 40px;
        }
        .test-section {
            margin-bottom: 30px;
        }
        .test-item {
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            font-family: monospace;
        }
        .pass {
            background-color: #d4edda;
            border-left: 5px solid #28a745;
        }
        .fail {
            background-color: #f8d7da;
            border-left: 5px solid #dc3545;
        }
        .warn {
            background-color: #fff3cd;
            border-left: 5px solid #ffc107;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            color: #6c757d;
        }
        #searchInput {
            width: 100%;
            padding: 10px;
            margin-bottom: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 class="display-4">Relatório de Testes</h1>
            <p class="text-muted">NeighborTrade - Gerado em $data</p>
        </div>

        <div class="summary-cards">
            <div class="card bg-success bg-opacity-10">
                <h3>Passados</h3>
                <h2 class="display-5">{$passados_count}</h2>
            </div>
            <div class="card bg-danger bg-opacity-10">
                <h3>Falhas</h3>
                <h2 class="display-5">{$falhados_count}</h2>
            </div>
            <div class="card bg-warning bg-opacity-10">
                <h3>Avisos</h3>
                <h2 class="display-5">{$avisos_count}</h2>
            </div>
            <div class="card bg-secondary bg-opacity-10">
                <h3>Skipped</h3>
                <h2 class="display-5">{$skipped_count}</h2>
            </div>
            <div class="card bg-secondary bg-opacity-25">
                <h3>Incompletos</h3>
                <h2 class="display-5">{$incompletos_count}</h2>
            </div>
            <div class="card bg-dark bg-opacity-10">
                <h3>Erros</h3>
                <h2 class="display-5">{$erros_count}</h2>
            </div>
            <div class="card bg-info bg-opacity-10">
                <h3>Total</h3>
                <h2 class="display-5">{$total_testes}</h2>
            </div>
        </div>

        <div class="chart-container">
            <canvas id="testResults"></canvas>
        </div>

        <input type="text" id="searchInput" placeholder="Pesquisar nos resultados..." class="form-control">

        <div class="test-section">
            <h3>Testes Passados</h3>
HTML;

foreach ($passados as $teste) {
    $html .= '<div class="test-item pass">' . htmlspecialchars($teste) . '</div>';
}

$html .= '<h3>Testes Falhados</h3>';
foreach ($falhados as $teste) {
    $html .= '<div class="test-item fail">' . htmlspecialchars($teste) . '</div>';
}

$html .= '<h3>Testes com Avisos</h3>';
foreach ($avisos as $teste) {
    $html .= '<div class="test-item warn">' . htmlspecialchars($teste) . '</div>';
}

$html .= '<h3>Testes Skipped</h3>';
foreach ($skipped as $teste) {
    $html .= '<div class="test-item warn">' . htmlspecialchars($teste) . '</div>';
}

$html .= '<h3>Testes Incompletos</h3>';
foreach ($incompletos as $teste) {
    $html .= '<div class="test-item warn">' . htmlspecialchars($teste) . '</div>';
}

$html .= '<h3>Testes com Erro</h3>';
foreach ($erros as $teste) {
    $html .= '<div class="test-item fail">' . htmlspecialchars($teste) . '</div>';
}

$html .= <<<HTML
        </div>

        <div class="footer">
            <p>© 2025 NeighborTrade - Todos os direitos reservados</p>
            <p>Relatório gerado automaticamente pelo sistema de testes</p>
        </div>
    </div>

    <script>
        // Gráfico de resultados
        const ctx = document.getElementById('testResults').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Passados', 'Falhas', 'Avisos', 'Skipped', 'Incompletos', 'Erros'],
                datasets: [{
                    data: [{$passados_count}, {$falhados_count}, {$avisos_count}, {$skipped_count}, {$incompletos_count}, {$erros_count}],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)', // Passados
                        'rgba(220, 53, 69, 0.8)', // Falhas
                        'rgba(255, 193, 7, 0.8)', // Avisos
                        'rgba(108, 117, 125, 0.8)', // Skipped
                        'rgba(108, 117, 125, 0.4)', // Incompletos
                        'rgba(33, 37, 41, 0.8)' // Erros
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)', // Passados
                        'rgba(220, 53, 69, 1)', // Falhas
                        'rgba(255, 193, 7, 1)', // Avisos
                        'rgba(108, 117, 125, 1)', // Skipped
                        'rgba(108, 117, 125, 0.7)', // Incompletos
                        'rgba(33, 37, 41, 1)' // Erros
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    title: {
                        display: true,
                        text: 'Distribuição dos Resultados dos Testes'
                    }
                }
            }
        });

        // Funcionalidade de pesquisa
        document.getElementById('searchInput').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            document.querySelectorAll('.test-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.classList.toggle('hidden', !text.includes(searchTerm));
            });
        });
    </script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
HTML;

echo "Salvando relatorio HTML...\n";
file_put_contents('relatorio_testes.html', $html);

echo "Relatório HTML gerado com sucesso!\n"; 