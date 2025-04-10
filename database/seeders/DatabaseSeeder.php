<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\TipoNotificacaoSeeder;
use Database\Seeders\InitialDataSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Executar os seeders
        $this->call([
            InitialDataSeeder::class,
            TipoNotificacaoSeeder::class,
        ]);
    }
}
