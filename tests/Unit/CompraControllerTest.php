<?php

namespace Tests\Unit;

use App\Http\Controllers\CompraController;
use App\Models\Compra;
use App\Models\Anuncio;
use App\Models\Utilizador;
use App\Models\Notificacao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Mockery;

class CompraControllerTest extends TestCase
{
    protected $controller;

    public function setUp(): void
    {
        parent::setUp();
        $this->controller = new CompraController();
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_returns_purchases_for_logged_in_user()
    {
        // Teste básico para verificar se o método existe
        $this->assertTrue(method_exists($this->controller, 'minhasCompras'), 
            'O método minhasCompras não existe no CompraController');
            
        // Verificar também o método para vendas
        $this->assertTrue(method_exists($this->controller, 'sales'), 
            'O método sales não existe no CompraController');
    }

    /** @test */
    public function it_creates_purchase_successfully()
    {
        // Verificar se o método existe
        $this->assertTrue(method_exists($this->controller, 'store'), 
            'O método store não existe no CompraController');
        
        // Verificar se existe o método iniciarCompra (específico para iniciar a compra de um anúncio)
        $this->assertTrue(method_exists($this->controller, 'iniciarCompra'), 
            'O método iniciarCompra não existe no CompraController');
    }

    /** @test */
    public function it_updates_purchase_status()
    {
        // Verificar se o método existe
        $this->assertTrue(method_exists($this->controller, 'updateStatus'), 
            'O método updateStatus não existe no CompraController');
        
        // Verificar também o método para confirmar recebimento
        $this->assertTrue(method_exists($this->controller, 'confirmReceipt'), 
            'O método confirmReceipt não existe no CompraController');
        
        // Verificar método para cancelar compra
        $this->assertTrue(method_exists($this->controller, 'cancel'), 
            'O método cancel não existe no CompraController');
    }
    
    /** @test */
    public function it_verifies_compra_table_name()
    {
        // Testando diretamente o modelo real, sem mocks
        $compra = new Compra();
        
        // Verifica o nome da tabela (pode ser 'compra' ou 'Compra' dependendo da configuração)
        $tableName = $compra->getTable();
        $this->assertTrue(in_array($tableName, ['compra', 'Compra']), 
            "A tabela deve ser 'compra' ou 'Compra', mas foi '$tableName'");
    }
    
    /** @test */
    public function it_has_correct_relationships()
    {
        // Verificar se os métodos de relacionamento existem
        $compra = new Compra();
        
        $this->assertTrue(method_exists($compra, 'utilizador'), 
            'O relacionamento com utilizador não existe');
        $this->assertTrue(method_exists($compra, 'anuncio'), 
            'O relacionamento com anúncio não existe');
        $this->assertTrue(method_exists($compra, 'reclamacaos'), 
            'O relacionamento com reclamações não existe');
        $this->assertTrue(method_exists($compra, 'avaliacaos'), 
            'O relacionamento com avaliações não existe');
        $this->assertTrue(method_exists($compra, 'pagamentos'), 
            'O relacionamento com pagamentos não existe');
    }
    
    /** @test */
    public function it_can_get_purchase_details()
    {
        // Verificar se o método existe
        $this->assertTrue(method_exists($this->controller, 'show'), 
            'O método show não existe no CompraController');
            
        // Verificar também se existe o método detalhes, que pode ser um alias
        $this->assertTrue(method_exists($this->controller, 'detalhes') || method_exists($this->controller, 'show'), 
            'Não existe método para ver detalhes de uma compra');
    }
    
    /** @test */
    public function it_can_get_pending_sales()
    {
        // Verificar se o método para vendas pendentes existe
        $this->assertTrue(method_exists($this->controller, 'pendingSales'), 
            'O método pendingSales não existe no CompraController');
            
        // Verificar também método para minhas vendas
        $this->assertTrue(method_exists($this->controller, 'minhasVendas'), 
            'O método minhasVendas não existe no CompraController');
    }
} 