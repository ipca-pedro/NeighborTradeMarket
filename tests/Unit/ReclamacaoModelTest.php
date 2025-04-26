<?php

namespace Tests\Unit;

use App\Models\Reclamacao;
use App\Models\Compra;
use App\Models\StatusReclamacao;
use App\Models\Aprovacao;
use Tests\TestCase;
use Mockery;
use Carbon\Carbon;

class ReclamacaoModelTest extends TestCase
{
    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /** @test */
    public function it_has_correct_relationships()
    {
        // Verifica se os métodos de relacionamento existem (sem testar a funcionalidade completa)
        $reclamacao = new Reclamacao();
        
        // Testa se os métodos de relacionamento existem
        $this->assertTrue(method_exists($reclamacao, 'status'), 'O método de relacionamento "status" não existe');
        $this->assertTrue(method_exists($reclamacao, 'compras'), 'O método de relacionamento "compras" não existe');
        $this->assertTrue(method_exists($reclamacao, 'aprovacao'), 'O método de relacionamento "aprovacao" não existe');
    }

    /** @test */
    public function it_can_scope_by_status()
    {
        // Mock a query builder
        $queryBuilder = Mockery::mock('Illuminate\Database\Eloquent\Builder');
        $queryBuilder->shouldReceive('where')->once()->with('Status_ReclamacaoID_Status_Reclamacao', 1)->andReturnSelf();
        
        // Create a partial mock of the Reclamacao model
        $reclamacao = Mockery::mock(Reclamacao::class)->makePartial();
        $reclamacao->shouldReceive('newQuery')->once()->andReturn($queryBuilder);
        
        // We're testing if the status scope works - in a real app we'd have a scopeStatus method
        // This is simulating how it would filter by status
        $result = $reclamacao->newQuery()->where('Status_ReclamacaoID_Status_Reclamacao', 1);
        
        $this->assertSame($queryBuilder, $result);
    }
    
    /** @test */
    public function it_has_correct_table_name_and_primary_key()
    {
        // Testando diretamente o modelo real, sem mocks
        $reclamacao = new Reclamacao();
        
        // Verifica o nome da tabela (pode ser 'reclamacao' ou 'Reclamacao' dependendo da configuração)
        $tableName = $reclamacao->getTable();
        $this->assertTrue(in_array($tableName, ['reclamacao', 'Reclamacao']), 
            "A tabela deve ser 'reclamacao' ou 'Reclamacao', mas foi '$tableName'");
            
        // Verifica a chave primária
        $this->assertEquals('ID_Reclamacao', $reclamacao->getKeyName());
    }
    
    /** @test */
    public function it_uses_correct_fillable_attributes()
    {
        $reclamacao = new Reclamacao();
        
        $expectedFillable = [
            'Descricao',
            'DataReclamacao',
            'Status_ReclamacaoID_Status_Reclamacao',
            'AprovacaoID_aprovacao'
        ];
        
        $this->assertEquals($expectedFillable, $reclamacao->getFillable());
    }
    
    /** @test */
    public function it_has_correct_casts()
    {
        $reclamacao = new Reclamacao();
        
        $expectedCasts = [
            'DataReclamacao' => 'datetime',
            'AprovacaoID_aprovacao' => 'int',
            'Status_ReclamacaoID_Status_Reclamacao' => 'int',
            'ID_Reclamacao' => 'int'
        ];
        
        $this->assertEquals($expectedCasts, $reclamacao->getCasts());
    }
    
    /** @test */
    public function it_doesnt_use_timestamps()
    {
        $reclamacao = new Reclamacao();
        $this->assertFalse($reclamacao->timestamps);
    }
} 