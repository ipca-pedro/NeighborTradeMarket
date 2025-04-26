<?php

namespace Tests\Feature;

use App\Models\Compra;
use App\Models\Reclamacao;
use App\Models\Utilizador;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ReclamacaoApiTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function setUp(): void
    {
        parent::setUp();
    }

    /** @test */
    public function unauthenticated_user_cannot_access_reclamacao_endpoints()
    {
        // Teste de criação de reclamação
        $response = $this->postJson('/api/reclamacoes', [
            'compraId' => 1,
            'descricao' => 'Descrição da reclamação'
        ]);
        
        $response->assertStatus(401);
        
        // Teste de listagem de reclamações
        $response = $this->getJson('/api/reclamacoes');
        $response->assertStatus(401);
        
        // Teste de visualização de reclamação específica
        $response = $this->getJson('/api/reclamacoes/1');
        $response->assertStatus(401);
    }

    /** @test */
    public function user_can_create_reclamacao_for_own_purchase()
    {
        // Criar um usuário para teste
        $user = Utilizador::factory()->create();
        
        // Autenticar o usuário
        Sanctum::actingAs($user);
        
        // Criar uma compra para o usuário
        $compra = Compra::factory()->create([
            'UtilizadorID_User' => $user->ID_User
        ]);
        
        // Testar criação de reclamação
        $response = $this->postJson('/api/reclamacoes', [
            'compraId' => $compra->ID_Compra,
            'descricao' => 'Produto com defeito'
        ]);
        
        $response->assertStatus(201)
            ->assertJson([
                'message' => 'Reclamação criada com sucesso'
            ]);
            
        // Verificar se reclamação foi criada no banco
        $this->assertDatabaseHas('reclamacao', [
            'Descricao' => 'Produto com defeito'
        ]);
        
        // Verificar associação com a compra
        $reclamacao = Reclamacao::latest('ID_Reclamacao')->first();
        $this->assertTrue($reclamacao->compras->contains($compra));
    }

    /** @test */
    public function user_cannot_create_reclamacao_for_other_users_purchase()
    {
        // Criar dois usuários
        $user1 = Utilizador::factory()->create();
        $user2 = Utilizador::factory()->create();
        
        // Autenticar como user1
        Sanctum::actingAs($user1);
        
        // Criar uma compra para o user2
        $compra = Compra::factory()->create([
            'UtilizadorID_User' => $user2->ID_User
        ]);
        
        // Testar criação de reclamação (deve falhar)
        $response = $this->postJson('/api/reclamacoes', [
            'compraId' => $compra->ID_Compra,
            'descricao' => 'Produto com defeito'
        ]);
        
        $response->assertStatus(403);
    }

    /** @test */
    public function user_can_see_own_reclamacoes()
    {
        // Criar um usuário para teste
        $user = Utilizador::factory()->create();
        
        // Autenticar o usuário
        Sanctum::actingAs($user);
        
        // Criar compras e reclamações associadas
        $compra1 = Compra::factory()->create(['UtilizadorID_User' => $user->ID_User]);
        $compra2 = Compra::factory()->create(['UtilizadorID_User' => $user->ID_User]);
        
        $reclamacao1 = Reclamacao::factory()->create();
        $reclamacao2 = Reclamacao::factory()->create();
        
        $compra1->reclamacoes()->attach($reclamacao1->ID_Reclamacao);
        $compra2->reclamacoes()->attach($reclamacao2->ID_Reclamacao);
        
        // Testar listagem de reclamações
        $response = $this->getJson('/api/reclamacoes');
        
        $response->assertStatus(200)
            ->assertJsonCount(2);
    }

    /** @test */
    public function admin_can_see_all_reclamacoes()
    {
        // Criar um admin (assumindo TipoUserID_TipoUser = 1 para admin)
        $admin = Utilizador::factory()->create(['TipoUserID_TipoUser' => 1]);
        
        // Autenticar como admin
        Sanctum::actingAs($admin);
        
        // Criar vários usuários, compras e reclamações
        $users = Utilizador::factory()->count(3)->create();
        
        foreach ($users as $user) {
            $compra = Compra::factory()->create(['UtilizadorID_User' => $user->ID_User]);
            $reclamacao = Reclamacao::factory()->create();
            $compra->reclamacoes()->attach($reclamacao->ID_Reclamacao);
        }
        
        // Testar rota de admin para listagem de todas reclamações
        $response = $this->getJson('/api/reclamacoes/todas');
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'total',
                'reclamacoes'
            ])
            ->assertJsonCount(3, 'reclamacoes');
    }

    /** @test */
    public function admin_can_update_reclamacao_status()
    {
        // Criar um admin
        $admin = Utilizador::factory()->create(['TipoUserID_TipoUser' => 1]);
        
        // Autenticar como admin
        Sanctum::actingAs($admin);
        
        // Criar reclamação
        $reclamacao = Reclamacao::factory()->create([
            'Status_ReclamacaoID_Status_Reclamacao' => 1 // Status inicial (pendente)
        ]);
        
        // Atualizar status da reclamação
        $response = $this->patchJson("/api/reclamacoes/{$reclamacao->ID_Reclamacao}/status", [
            'status_id' => 2 // Novo status (em análise)
        ]);
        
        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Status da reclamação atualizado com sucesso'
            ]);
            
        // Verificar atualização no banco
        $this->assertDatabaseHas('reclamacao', [
            'ID_Reclamacao' => $reclamacao->ID_Reclamacao,
            'Status_ReclamacaoID_Status_Reclamacao' => 2
        ]);
    }
} 