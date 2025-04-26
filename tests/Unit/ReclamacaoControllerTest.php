<?php

namespace Tests\Unit;

use App\Http\Controllers\ReclamacaoController;
use App\Models\Aprovacao;
use App\Models\Compra;
use App\Models\Notificacao;
use App\Models\Reclamacao;
use App\Models\Utilizador;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;
use Mockery;

class ReclamacaoControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $controller;

    public function setUp(): void
    {
        parent::setUp();
        $this->controller = new ReclamacaoController();
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_creates_a_reclamacao_successfully()
    {
        // Mock user authentication
        $user = Mockery::mock(Utilizador::class);
        $user->ID_User = 1;
        Auth::shouldReceive('user')->andReturn($user);
        Auth::shouldReceive('id')->andReturn(1);

        // Mock database transaction
        DB::shouldReceive('beginTransaction')->once();
        DB::shouldReceive('commit')->once();
        
        // Create test data - Compra with user as buyer
        $anuncio = Mockery::mock('App\Models\Anuncio');
        $anuncio->shouldReceive('getAttribute')->with('UtilizadorID_User')->andReturn(2);
        
        $compra = Mockery::mock('App\Models\Compra');
        $compra->shouldReceive('getAttribute')->with('UtilizadorID_User')->andReturn(1);
        $compra->shouldReceive('reclamacoes->exists')->andReturn(false);
        $compra->shouldReceive('reclamacoes->attach')->once();
        $compra->anuncio = $anuncio;
        
        // Mock Compra::findOrFail
        $mockCompra = Mockery::mock('alias:App\Models\Compra');
        $mockCompra->shouldReceive('findOrFail')->with(1)->andReturn($compra);
        
        // Mock Aprovacao
        $aprovacao = new Aprovacao();
        $aprovacao->ID_aprovacao = 1;
        $mockAprovacao = Mockery::mock('alias:App\Models\Aprovacao');
        $mockAprovacao->shouldReceive('save')->once()->andReturn(true);
        
        // Mock Reclamacao
        $reclamacao = new Reclamacao();
        $reclamacao->ID_Reclamacao = 1;
        $mockReclamacao = Mockery::mock('alias:App\Models\Reclamacao');
        $mockReclamacao->shouldReceive('save')->once()->andReturn(true);
        
        // Mock Notificacao
        $mockNotificacao = Mockery::mock('alias:App\Models\Notificacao');
        $mockNotificacao->shouldReceive('save')->times(2)->andReturn(true);
        
        // Mock admin users
        $admin = new Utilizador();
        $admin->ID_Utilizador = 3;
        $mockUtilizador = Mockery::mock('alias:App\Models\Utilizador');
        $mockUtilizador->shouldReceive('where->get')->andReturn(collect([$admin]));
        
        // Create request
        $request = new Request([
            'compraId' => 1,
            'descricao' => 'Teste de reclamação'
        ]);
        
        // Call controller method
        $response = $this->controller->store($request);
        
        // Assert response
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertJson($response->getContent());
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals('Reclamação criada com sucesso', $responseData['message']);
    }

    /** @test */
    public function it_returns_403_when_user_is_not_buyer()
    {
        // Mock user authentication
        $user = Mockery::mock(Utilizador::class);
        $user->ID_User = 1;
        Auth::shouldReceive('user')->andReturn($user);
        Auth::shouldReceive('id')->andReturn(1);
        
        // Create test data - Compra with different user as buyer
        $compra = Mockery::mock('App\Models\Compra');
        $compra->shouldReceive('getAttribute')->with('UtilizadorID_User')->andReturn(2);
        
        // Mock Compra::findOrFail
        $mockCompra = Mockery::mock('alias:App\Models\Compra');
        $mockCompra->shouldReceive('findOrFail')->with(1)->andReturn($compra);
        
        // Create request
        $request = new Request([
            'compraId' => 1,
            'descricao' => 'Teste de reclamação'
        ]);
        
        // Call controller method
        $response = $this->controller->store($request);
        
        // Assert response
        $this->assertEquals(403, $response->getStatusCode());
        $this->assertJson($response->getContent());
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals('Não autorizado a criar reclamação para esta compra', $responseData['message']);
    }

    /** @test */
    public function it_returns_400_when_reclamacao_already_exists()
    {
        // Mock user authentication
        $user = Mockery::mock(Utilizador::class);
        $user->ID_User = 1;
        Auth::shouldReceive('user')->andReturn($user);
        Auth::shouldReceive('id')->andReturn(1);
        
        // Create test data - Compra with existing reclamacao
        $compra = Mockery::mock('App\Models\Compra');
        $compra->shouldReceive('getAttribute')->with('UtilizadorID_User')->andReturn(1);
        $compra->shouldReceive('reclamacoes->exists')->andReturn(true);
        
        // Mock Compra::findOrFail
        $mockCompra = Mockery::mock('alias:App\Models\Compra');
        $mockCompra->shouldReceive('findOrFail')->with(1)->andReturn($compra);
        
        // Create request
        $request = new Request([
            'compraId' => 1,
            'descricao' => 'Teste de reclamação'
        ]);
        
        // Call controller method
        $response = $this->controller->store($request);
        
        // Assert response
        $this->assertEquals(400, $response->getStatusCode());
        $this->assertJson($response->getContent());
        $responseData = json_decode($response->getContent(), true);
        $this->assertEquals('Já existe uma reclamação para esta compra', $responseData['message']);
    }
} 