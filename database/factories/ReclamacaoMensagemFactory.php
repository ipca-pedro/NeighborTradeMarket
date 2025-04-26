<?php

namespace Database\Factories;

use App\Models\ReclamacaoMensagem;
use App\Models\Utilizador;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReclamacaoMensagemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ReclamacaoMensagem::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        // Garantir que existe um utilizador
        $utilizador = Utilizador::factory()->create();
        
        return [
            'Mensagem' => $this->faker->paragraph(),
            'DataMensagem' => now(),
            'UtilizadorID_User' => $utilizador->ID_User,
            'ReclamacaoID_Reclamacao' => null, // Deve ser atribuído ao criar
            'Lida' => $this->faker->boolean(30)
        ];
    }

    /**
     * Indicate that the message is read.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function lida()
    {
        return $this->state(function (array $attributes) {
            return [
                'Lida' => true
            ];
        });
    }

    /**
     * Indicate that the message is from an admin.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function admin()
    {
        return $this->state(function (array $attributes) {
            // Criar um admin
            $admin = Utilizador::factory()->admin()->create();
            
            return [
                'UtilizadorID_User' => $admin->ID_User
            ];
        });
    }
} 