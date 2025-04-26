<?php

namespace Database\Factories;

use App\Models\Anuncio;
use App\Models\Aprovacao;
use App\Models\Categoria;
use App\Models\Utilizador;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnuncioFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Anuncio::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Garantir que existe um utilizador
        $utilizador = Utilizador::factory()->create();
        
        // Garantir que existe uma categoria
        if (Categoria::count() === 0) {
            Categoria::create([
                'Nome' => 'Eletrônicos',
                'Descricao' => 'Produtos eletrônicos diversos'
            ]);
        }
        $categoria = Categoria::first();
        
        // Criar aprovação
        $aprovacao = Aprovacao::factory()->create();
        
        return [
            'Titulo' => $this->faker->sentence(3),
            'Descricao' => $this->faker->paragraph(),
            'Preco' => $this->faker->randomFloat(2, 10, 1000),
            'Estado' => $this->faker->randomElement(['Novo', 'Usado', 'Semi-novo']),
            'Disponivel_para_troca' => $this->faker->boolean(30),
            'data_criacao' => now(),
            'data_update' => null,
            'UtilizadorID_User' => $utilizador->ID_User,
            'CategoriaID_Categoria' => $categoria->ID_Categoria,
            'AprovacaoID_aprovacao' => $aprovacao->ID_aprovacao,
            'vendido' => false
        ];
    }

    /**
     * Indicate that the anuncio is sold.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function vendido()
    {
        return $this->state(function (array $attributes) {
            return [
                'vendido' => true,
                'data_update' => now()
            ];
        });
    }

    /**
     * Indicate that the anuncio is approved.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function aprovado()
    {
        return $this->state(function (array $attributes) {
            // Criar uma aprovação com status aprovado
            $aprovacao = Aprovacao::factory()->aprovada()->create();
            
            return [
                'AprovacaoID_aprovacao' => $aprovacao->ID_aprovacao,
            ];
        });
    }
} 