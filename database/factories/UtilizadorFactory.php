<?php

namespace Database\Factories;

use App\Models\Utilizador;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UtilizadorFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Utilizador::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'Nome' => $this->faker->name(),
            'Email' => $this->faker->unique()->safeEmail(),
            'Password' => Hash::make('password'),
            'Telefone' => $this->faker->numerify('9########'), // Portugal format
            'DataNascimento' => $this->faker->date('Y-m-d', '-18 years'),
            'DataCriacao' => now(),
            'TipoUserID_TipoUser' => 2, // Assume 2 is regular user
            'remember_token' => Str::random(10),
            'Status' => 1, // Assume 1 is active
        ];
    }

    /**
     * Indicate that the user is an admin.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function admin()
    {
        return $this->state(function (array $attributes) {
            return [
                'TipoUserID_TipoUser' => 1,
            ];
        });
    }

    /**
     * Indicate that the user is waiting for approval.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function pendingApproval()
    {
        return $this->state(function (array $attributes) {
            return [
                'Status' => 2, // Assuming 2 is pending
            ];
        });
    }
} 