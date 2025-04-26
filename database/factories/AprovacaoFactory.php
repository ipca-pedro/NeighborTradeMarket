<?php

namespace Database\Factories;

use App\Models\Aprovacao;
use Illuminate\Database\Eloquent\Factories\Factory;

class AprovacaoFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Aprovacao::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'Data_Submissao' => now(),
            'Data_Aprovacao' => null,
            'Status_AprovacaoID_Status_Aprovacao' => 1, // Assume 1 is "Pendente"
            'Observacao' => $this->faker->optional(0.3)->sentence()
        ];
    }

    /**
     * Indicate that the aprovacao is approved.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function aprovada()
    {
        return $this->state(function (array $attributes) {
            return [
                'Data_Aprovacao' => now(),
                'Status_AprovacaoID_Status_Aprovacao' => 2, // Assume 2 is "Aprovado"
            ];
        });
    }

    /**
     * Indicate that the aprovacao is rejected.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function rejeitada()
    {
        return $this->state(function (array $attributes) {
            return [
                'Data_Aprovacao' => now(),
                'Status_AprovacaoID_Status_Aprovacao' => 3, // Assume 3 is "Rejeitado"
                'Observacao' => $this->faker->sentence()
            ];
        });
    }
} 