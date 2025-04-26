<?php

namespace Database\Factories;

use App\Models\StatusReclamacao;
use Illuminate\Database\Eloquent\Factories\Factory;

class StatusReclamacaoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = StatusReclamacao::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'Nome' => $this->faker->unique()->randomElement(['Pendente', 'Em Análise', 'Em Resolução', 'Resolvida', 'Cancelada']),
            'Descricao' => $this->faker->sentence()
        ];
    }

    /**
     * Indicate that the status is "Pending".
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function pendente()
    {
        return $this->state(function (array $attributes) {
            return [
                'Nome' => 'Pendente',
                'Descricao' => 'Reclamação pendente de análise'
            ];
        });
    }

    /**
     * Indicate that the status is "Resolved".
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function resolvida()
    {
        return $this->state(function (array $attributes) {
            return [
                'Nome' => 'Resolvida',
                'Descricao' => 'Reclamação resolvida com sucesso'
            ];
        });
    }
} 