<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReferenciatipoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Garante que existe pelo menos o ID 1 para Referenciatipo
        DB::table('referenciatipo')->updateOrInsert(
            ['ID_ReferenciaTipo' => 1],
            ['Descricao' => 'Utilizador']
        );
    }
}
