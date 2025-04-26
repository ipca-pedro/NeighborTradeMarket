<?php

namespace Tests\Unit;

use App\Http\Controllers\AnuncioController;
use App\Models\Anuncio;
use App\Models\Aprovacao;
use App\Models\Categoria;
use App\Models\Utilizador;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use Mockery;

class AnuncioControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $controller;

    public function setUp(): void
    {
        parent::setUp();
        $this->controller = new AnuncioController();
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_retrieves_anuncios_for_logged_in_user()
    {
        // Mock user authentication
        $user = Mockery::mock(Utilizador::class);
        $user->ID_User = 1;
        Auth::shouldReceive('user')->andReturn($user);
        
        // Mock Anuncio::with->where
        $mockAnuncio = Mockery::mock('alias:App\Models\Anuncio');
        $mockAnuncio->shouldReceive('with')
            ->once()
            ->andReturnSelf();
        $mockAnuncio->shouldReceive('where')
            ->once()
            ->with('UtilizadorID_User', 1)
            ->andReturnSelf();
        $mockAnuncio->shouldReceive('orderBy')
            ->once()
            ->andReturnSelf();
        $mockAnuncio->shouldReceive('get')
            ->once()
            ->andReturn(collect([]));
        
        // Call controller method
        $response = $this->controller->myAds();
        
        // Assert response
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJson($response->getContent());
    }

    /** @test */
    public function it_creates_anuncio_successfully()
    {
        // Mock user authentication
        $user = Mockery::mock(Utilizador::class);
        $user->ID_User = 1;
        Auth::shouldReceive('user')->andReturn($user);
        Auth::shouldReceive('id')->andReturn(1);

        // Mock database transaction
        DB::shouldReceive('beginTransaction')->once();
        DB::shouldReceive('commit')->once();
        
        // Mock Storage facade for file handling
        Storage::shouldReceive('disk->put')->andReturn('path/to/image.jpg');
        
        // Mock models
        $categoria = Mockery::mock(Categoria::class);
        $categoria->ID_Categoria = 1;
        
        $mockCategoria = Mockery::mock('alias:App\Models\Categoria');
        $mockCategoria->shouldReceive('findOrFail')->with(1)->andReturn($categoria);
        
        $aprovacao = new Aprovacao();
        $aprovacao->ID_aprovacao = 1;
        $mockAprovacao = Mockery::mock('alias:App\Models\Aprovacao');
        $mockAprovacao->shouldReceive('save')->once()->andReturn(true);
        
        $anuncio = new Anuncio();
        $anuncio->ID_Anuncio = 1;
        $mockAnuncio = Mockery::mock('alias:App\Models\Anuncio');
        $mockAnuncio->shouldReceive('save')->once()->andReturn(true);
        
        // Create request with form data
        $request = new Request([
            'titulo' => 'Anúncio de teste',
            'descricao' => 'Descrição detalhada do anúncio',
            'preco' => 99.99,
            'estado' => 'Novo',
            'categoria_id' => 1,
            'disponivel_para_troca' => true,
            'imagens' => [
                Mockery::mock('Illuminate\Http\UploadedFile')
            ]
        ]);
        
        // Call controller method
        $response = $this->controller->store($request);
        
        // Assert response
        $this->assertEquals(201, $response->getStatusCode());
        $this->assertJson($response->getContent());
    }

    /** @test */
    public function it_updates_anuncio_status()
    {
        // Mock user authentication
        $user = Mockery::mock(Utilizador::class);
        $user->ID_User = 1;
        Auth::shouldReceive('user')->andReturn($user);
        
        // Create test data - Anuncio owned by user
        $anuncio = Mockery::mock(Anuncio::class);
        $anuncio->ID_Anuncio = 1;
        $anuncio->UtilizadorID_User = 1; // Same as authenticated user
        $anuncio->shouldReceive('getAttribute')->with('UtilizadorID_User')->andReturn(1);
        $anuncio->shouldReceive('save')->once()->andReturn(true);
        
        // Mock Anuncio::findOrFail
        $mockAnuncio = Mockery::mock('alias:App\Models\Anuncio');
        $mockAnuncio->shouldReceive('findOrFail')->with(1)->andReturn($anuncio);
        
        // Call controller method
        $response = $this->controller->markAsSold(1);
        
        // Assert response
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJson($response->getContent());
    }

    /** @test */
    public function it_categorizes_anuncios_correctly()
    {
        // Mock categoria
        $categoria = Mockery::mock(Categoria::class);
        $categoria->ID_Categoria = 1;
        $categoria->Nome = 'Eletrônicos';
        
        $mockCategoria = Mockery::mock('alias:App\Models\Categoria');
        $mockCategoria->shouldReceive('findOrFail')->with(1)->andReturn($categoria);
        
        // Mock anuncios query builder
        $mockAnuncio = Mockery::mock('alias:App\Models\Anuncio');
        $mockAnuncio->shouldReceive('with')
            ->once()
            ->andReturnSelf();
        $mockAnuncio->shouldReceive('where')
            ->once()
            ->with('CategoriaID_Categoria', 1)
            ->andReturnSelf();
        $mockAnuncio->shouldReceive('where')
            ->once()
            ->with('Aprovacao.Status_AprovacaoID_Status_Aprovacao', 2) // Assumindo 2 = aprovado
            ->andReturnSelf();
        $mockAnuncio->shouldReceive('get')
            ->once()
            ->andReturn(collect([]));
        
        // Call controller method
        $response = $this->controller->byCategoria(1);
        
        // Assert response
        $this->assertEquals(200, $response->getStatusCode());
        $this->assertJson($response->getContent());
    }
} 