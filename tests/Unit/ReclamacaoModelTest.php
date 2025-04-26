<?php

namespace Tests\Unit;

use App\Models\Aprovacao;
use App\Models\Compra;
use App\Models\Reclamacao;
use App\Models\StatusReclamacao;
use App\Models\ReclamacaoMensagem;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReclamacaoModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_correct_relationships()
    {
        // Criar modelos relacionados
        $aprovacao = Aprovacao::factory()->create();
        $statusReclamacao = StatusReclamacao::factory()->create();
        
        // Criar a reclamação
        $reclamacao = Reclamacao::factory()->create([
            'AprovacaoID_aprovacao' => $aprovacao->ID_aprovacao,
            'Status_ReclamacaoID_Status_Reclamacao' => $statusReclamacao->ID_Status_Reclamacao
        ]);
        
        // Criar uma compra
        $compra = Compra::factory()->create();
        
        // Associar reclamação à compra
        $compra->reclamacoes()->attach($reclamacao->ID_Reclamacao);
        
        // Criar mensagens para a reclamação
        $mensagem1 = ReclamacaoMensagem::factory()->create([
            'ReclamacaoID_Reclamacao' => $reclamacao->ID_Reclamacao
        ]);
        
        $mensagem2 = ReclamacaoMensagem::factory()->create([
            'ReclamacaoID_Reclamacao' => $reclamacao->ID_Reclamacao
        ]);

        // Testar relações
        $this->assertEquals($aprovacao->ID_aprovacao, $reclamacao->aprovacao->ID_aprovacao);
        $this->assertEquals($statusReclamacao->ID_Status_Reclamacao, $reclamacao->status->ID_Status_Reclamacao);
        $this->assertTrue($reclamacao->compras->contains($compra));
        $this->assertCount(2, $reclamacao->mensagens);
        $this->assertTrue($reclamacao->mensagens->contains($mensagem1));
        $this->assertTrue($reclamacao->mensagens->contains($mensagem2));
    }

    /** @test */
    public function it_can_scope_by_status()
    {
        // Criar status
        $statusPendente = StatusReclamacao::factory()->create(['Nome' => 'Pendente']);
        $statusResolvido = StatusReclamacao::factory()->create(['Nome' => 'Resolvido']);
        
        // Criar reclamações com diferentes status
        $reclamacaoPendente1 = Reclamacao::factory()->create([
            'Status_ReclamacaoID_Status_Reclamacao' => $statusPendente->ID_Status_Reclamacao
        ]);
        
        $reclamacaoPendente2 = Reclamacao::factory()->create([
            'Status_ReclamacaoID_Status_Reclamacao' => $statusPendente->ID_Status_Reclamacao
        ]);
        
        $reclamacaoResolvida = Reclamacao::factory()->create([
            'Status_ReclamacaoID_Status_Reclamacao' => $statusResolvido->ID_Status_Reclamacao
        ]);
        
        // Testar escopo (assumindo que existe um escopo local comStatus)
        $pendenteCount = Reclamacao::comStatus($statusPendente->ID_Status_Reclamacao)->count();
        $this->assertEquals(2, $pendenteCount);
        
        $resolvidoCount = Reclamacao::comStatus($statusResolvido->ID_Status_Reclamacao)->count();
        $this->assertEquals(1, $resolvidoCount);
    }
    
    /** @test */
    public function it_has_correct_table_name_and_primary_key()
    {
        $reclamacao = new Reclamacao();
        
        $this->assertEquals('reclamacao', $reclamacao->getTable());
        $this->assertEquals('ID_Reclamacao', $reclamacao->getKeyName());
    }
} 