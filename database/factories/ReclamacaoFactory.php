<?php

namespace Database\Factories;

use App\Models\Aprovacao;
use App\Models\Reclamacao;
use App\Models\StatusReclamacao;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReclamacaoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Reclamacao::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Garantir que a aprovação existe
        $aprovacao = Aprovacao::factory()->create();
        
        // Garantir que existe ao menos um status de reclamação
        if (StatusReclamacao::count() === 0) {
            StatusReclamacao::create([
                'Nome' => 'Pendente',
                'Descricao' => 'Reclamação pendente de análise'
            ]);
        }
        
        $statusId = StatusReclamacao::first()->ID_Status_Reclamacao;
        
        return [
            'Descricao' => $this->faker->paragraph(),
            'DataReclamacao' => now(),
            'AprovacaoID_aprovacao' => $aprovacao->ID_aprovacao,
            'Status_ReclamacaoID_Status_Reclamacao' => $statusId
        ];
    }

    /**
     * Indicate that the reclamacao is resolved.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function resolvida()
    {
        // Garantir que existe status "Resolvida"
        $statusResolvida = StatusReclamacao::where('Nome', 'Resolvida')->first();
        if (!$statusResolvida) {
            $statusResolvida = StatusReclamacao::create([
                'Nome' => 'Resolvida',
                'Descricao' => 'Reclamação resolvida'
            ]);
        }
        
        return $this->state(function (array $attributes) use ($statusResolvida) {
            return [
                'Status_ReclamacaoID_Status_Reclamacao' => $statusResolvida->ID_Status_Reclamacao,
            ];
        });
    }
} 