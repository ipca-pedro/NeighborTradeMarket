<?php

namespace Tests\Unit;

use App\Http\Controllers\CompraController;
use App\Models\Anuncio;
use App\Models\Compra;
use App\Models\Notificacao;
use App\Models\Utilizador;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Mockery;

class CompraControllerTest extends TestCase
{
    use RefreshDatabase;

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
        // Mock user authentication
        $user = Mockery::mock(Utilizador::class);
        $user->ID_User = 1;
        Auth::shouldReceive('user')->andReturn($user);
        
        // Mock Compra::with->where
        $mockCompra = Mockery::mock('alias:App\Models\Compra');
        $mockCompra->shouldReceive('with')
            ->once()
            ->with(['anuncio.utilizador', 'anuncio.imagens', 'status', 'avaliacoes'])
            ->andReturnSelf();
        $mockCompra->shouldReceive('where')
            ->once()
            ->with('UtilizadorID_User', 1)
            ->andReturnSelf();
        $mockCompra->shouldReceive('orderBy')
            ->once()
            ->andReturnSelf();
        $mockCompra->shouldReceive('get')
            ->once()
            ->andReturn(collect([]));
        
        // Call controller method (assuming minhasCompras method exists)
        $response = $this->controller->minhasCompras();
        
        // Assert response
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJson($response->getContent());
    }

    /** @test */
    public function it_creates_purchase_successfully()
    {
        // Mock user authentication
        $user = Mockery::mock(Utilizador::class);
        $user->ID_User = 1;
        Auth::shouldReceive('user')->andReturn($user);
        Auth::shouldReceive('id')->andReturn(1);

        // Mock database transaction
        DB::shouldReceive('beginTransaction')->once();
        DB::shouldReceive('commit')->once();
        
        // Mock anuncio
        $anuncio = Mockery::mock(Anuncio::class);
        $anuncio->ID_Anuncio = 1;
        $anuncio->Preco = 100.00;
        $anuncio->UtilizadorID_User = 2; // Different user (seller)
        $anuncio->shouldReceive('getAttribute')->with('ID_Anuncio')->andReturn(1);
        $anuncio->shouldReceive('getAttribute')->with('Preco')->andReturn(100.00);
        $anuncio->shouldReceive('getAttribute')->with('UtilizadorID_User')->andReturn(2);
        
        // Mock Anuncio::findOrFail
        $mockAnuncio = Mockery::mock('alias:App\Models\Anuncio');
        $mockAnuncio->shouldReceive('findOrFail')->with(1)->andReturn($anuncio);
        
        // Mock Compra creation
        $compra = new Compra();
        $compra->ID_Compra = 1;
        $mockCompra = Mockery::mock('alias:App\Models\Compra');
        $mockCompra->shouldReceive('save')->once()->andReturn(true);
        
        // Mock Notificacao
        $mockNotificacao = Mockery::mock('alias:App\Models\Notificacao');
        $mockNotificacao->shouldReceive('save')->once()->andReturn(true);
        
        // Create request
        $request = new Request([
            'anuncioId' => 1,
            'endereco' => 'Endereço de teste',
            'formaEnvio' => 'Correios',
            'formaPagamento' => 'Cartão'
        ]);
        
        // Call controller method (assuming iniciarCompra method exists)
        $response = $this->controller->iniciarCompra($request, 1);
        
        // Assert response
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertJson($response->getContent());
    }

    /** @test */
    public function it_updates_purchase_status()
    {
        // Mock user authentication
        $user = Mockery::mock(Utilizador::class);
        $user->ID_User = 1;
        Auth::shouldReceive('user')->andReturn($user);
        
        // Create test data - Compra owned by user
        $compra = Mockery::mock(Compra::class);
        $compra->ID_Compra = 1;
        $compra->UtilizadorID_User = 1; // Same as authenticated user
        $compra->shouldReceive('getAttribute')->with('UtilizadorID_User')->andReturn(1);
        $compra->shouldReceive('save')->once()->andReturn(true);
        
        // Mock Compra::findOrFail
        $mockCompra = Mockery::mock('alias:App\Models\Compra');
        $mockCompra->shouldReceive('findOrFail')->with(1)->andReturn($compra);
        
        // Create request
        $request = new Request([
            'status_id' => 2 // Novo status
        ]);
        
        // Call controller method (assuming atualizarStatus method exists)
        $response = $this->controller->atualizarStatus($request, 1);
        
        // Assert response
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJson($response->getContent());
    }
} 