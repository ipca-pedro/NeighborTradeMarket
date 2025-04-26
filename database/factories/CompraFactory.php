<?php

namespace Database\Factories;

use App\Models\Anuncio;
use App\Models\Compra;
use App\Models\Utilizador;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompraFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Compra::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Garantir que existe um utilizador
        $utilizador = Utilizador::factory()->create();
        
        // Garantir que existe um anúncio
        $anuncio = Anuncio::factory()->create([
            'UtilizadorID_User' => Utilizador::factory()->create()->ID_User // Vendedor diferente do comprador
        ]);
        
        return [
            'DataCompra' => now(),
            'Endereco_Entrega' => $this->faker->address(),
            'Valor' => $anuncio->Preco ?? $this->faker->randomFloat(2, 10, 1000),
            'FormaPagamento' => $this->faker->randomElement(['Cartão', 'MBWay', 'PayPal']),
            'FormaEnvio' => $this->faker->randomElement(['Correios', 'Transportadora', 'Entrega Pessoal']),
            'Observacoes' => $this->faker->optional(0.3)->sentence(),
            'StatusCompraID_StatusCompra' => 1, // Assume 1 is "Pendente"
            'AnuncioID_Anuncio' => $anuncio->ID_Anuncio,
            'UtilizadorID_User' => $utilizador->ID_User
        ];
    }

    /**
     * Indicate that the purchase is completed.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function completa()
    {
        return $this->state(function (array $attributes) {
            return [
                'StatusCompraID_StatusCompra' => 4, // Assume 4 is "Concluída"
                'DataAtualizacao' => now()
            ];
        });
    }

    /**
     * Indicate that the purchase is in transit.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function emTransito()
    {
        return $this->state(function (array $attributes) {
            return [
                'StatusCompraID_StatusCompra' => 3, // Assume 3 is "Em trânsito"
                'DataAtualizacao' => now()
            ];
        });
    }
} 