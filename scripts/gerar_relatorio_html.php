<?php

echo "Iniciando geracao do relatorio HTML...\n";

// Defina o caminho absoluto para o arquivo resultado_final.txt
$arquivo_final = 'C:/xampp/htdocs/NT/resultado_final.txt';

if (!file_exists($arquivo_final)) {
    echo "Arquivo resultado_final.txt nao encontrado.\n";
    exit(1);
}

echo "Lendo resultado_final.txt...\n";
$resultado = file_get_contents($arquivo_final);

// Processando os resultados dos testes
$linhas = explode("\n", $resultado);
$passados = [];
$falhados = [];
$avisos = [];
$total_testes = 0;

foreach ($linhas as $linha) {
    if (strpos($linha, 'Metadata in doc-comments is deprecated') !== false) {
        continue; // Ignorar avisos de metadata deprecated
    } elseif (strpos($linha, 'PASS') !== false) {
        $passados[] = $linha;
        $total_testes++;
    } elseif (strpos($linha, 'FAIL') !== false) {
        $falhados[] = $linha;
        $total_testes++;
    } elseif (strpos($linha, 'WARN') !== false) {
        $avisos[] = $linha;
        $total_testes++;
    }
}

$data = date('Y-m-d H:i:s');
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
                <h2 class="display-5">" . count($passados) . "</h2>
            </div>
            <div class="card bg-danger bg-opacity-10">
                <h3>Falhas</h3>
                <h2 class="display-5">" . count($falhados) . "</h2>
            </div>
            <div class="card bg-warning bg-opacity-10">
                <h3>Avisos</h3>
                <h2 class="display-5">" . count($avisos) . "</h2>
            </div>
            <div class="card bg-info bg-opacity-10">
                <h3>Total</h3>
                <h2 class="display-5">$total_testes</h2>
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
                labels: ['Passados', 'Falhas', 'Avisos'],
                datasets: [{
                    data: [" . count($passados) . ", " . count($falhados) . ", " . count($avisos) . "],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.8)',
                        'rgba(220, 53, 69, 0.8)',
                        'rgba(255, 193, 7, 0.8)'
                    ],
                    borderColor: [
                        'rgba(40, 167, 69, 1)',
                        'rgba(220, 53, 69, 1)',
                        'rgba(255, 193, 7, 1)'
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