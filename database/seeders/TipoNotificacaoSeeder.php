<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TipoNotificacaoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar se já existe um tipo de notificação para redefinição de senha
        $existingType = DB::table('TIpo_notificacao')
            ->where('Descricao', 'Redefinição de Senha')
            ->first();
        
        // Se não existir, criar
        if (!$existingType) {
            DB::table('TIpo_notificacao')->insert([
                'ID_TipoNotificacao' => 3, // Usando ID 3 como definido no AuthController
                'Descricao' => 'Redefinição de Senha'
            ]);
        }
        
        // Verificar se já existe um tipo de referência para utilizador
        $existingRefType = DB::table('ReferenciaTipo')
            ->where('Descricao', 'Utilizador')
            ->first();
        
        // Se não existir, criar
        if (!$existingRefType) {
            DB::table('ReferenciaTipo')->insert([
                'ID_ReferenciaTipo' => 1, // Usando ID 1 como definido no AuthController
                'Descricao' => 'Utilizador'
            ]);
        }
    }
}
