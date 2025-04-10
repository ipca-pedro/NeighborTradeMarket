<?php

// Carregar o ambiente Laravel
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\Utilizador;
use App\Models\Aprovacao;
use App\Models\Imagem;
use App\Models\Morada;

// Desativar verificação de chaves estrangeiras
DB::statement('SET FOREIGN_KEY_CHECKS=0');

try {
    // Criar ou recuperar imagem padrão
    $imagem = Imagem::firstOrCreate(
        ['ID_Imagem' => 1],
        ['Caminho' => 'public/perfil/default.png']
    );

    // Criar ou recuperar moradas
    $moradaAdmin = Morada::firstOrCreate(
        ['ID_Morada' => 1],
        ['Rua' => 'Rua do Administrador, 123']
    );

    $moradaUser = Morada::firstOrCreate(
        ['ID_Morada' => 2],
        ['Rua' => 'Rua do Usuário, 456']
    );

    // Verificar se já existe um administrador
    $adminExists = Utilizador::where('ID_User', 1)->exists();
    
    if (!$adminExists) {
        // Criar aprovação para o administrador
        $aprovacaoAdmin = new Aprovacao();
        $aprovacaoAdmin->ID_aprovacao = 1;
        $aprovacaoAdmin->Comentario = 'Administrador do sistema';
        $aprovacaoAdmin->Data_Submissao = now();
        $aprovacaoAdmin->Data_Aprovacao = now();
        $aprovacaoAdmin->Status_AprovacaoID_Status_Aprovacao = 1; // Aprovado
        $aprovacaoAdmin->save();

        // Atualizar o UtilizadorID_Admin depois
        
        // Criar o administrador
        $admin = new Utilizador();
        $admin->ID_User = 1;
        $admin->User_Name = 'admin';
        $admin->Name = 'Administrador';
        $admin->Data_Nascimento = '1990-01-01';
        $admin->Password = Hash::make('password');
        $admin->CC = '12345678';
        $admin->Email = 'admin@example.com';
        $admin->MoradaID_Morada = 1;
        $admin->AprovacaoID_aprovacao = 1;
        $admin->TipoUserID_TipoUser = 1; // Administrador
        $admin->ImagemID_Imagem = 1;
        $admin->Status_UtilizadorID_status_utilizador = 1; // Ativo
        $admin->save();
        
        // Atualizar o UtilizadorID_Admin na aprovação
        $aprovacaoAdmin->UtilizadorID_Admin = $admin->ID_User;
        $aprovacaoAdmin->save();
        
        echo "Administrador criado com sucesso!\n";
    } else {
        echo "Administrador já existe!\n";
    }
    
    // Verificar se já existe um usuário normal
    $userExists = Utilizador::where('ID_User', 2)->exists();
    
    if (!$userExists) {
        // Criar aprovação para o usuário normal
        $aprovacaoUser = new Aprovacao();
        $aprovacaoUser->ID_aprovacao = 2;
        $aprovacaoUser->Comentario = 'Usuário de teste';
        $aprovacaoUser->Data_Submissao = now();
        $aprovacaoUser->Data_Aprovacao = now();
        $aprovacaoUser->UtilizadorID_Admin = 1; // Aprovado pelo admin
        $aprovacaoUser->Status_AprovacaoID_Status_Aprovacao = 1; // Aprovado
        $aprovacaoUser->save();
        
        // Criar o usuário normal
        $user = new Utilizador();
        $user->ID_User = 2;
        $user->User_Name = 'user';
        $user->Name = 'Usuário Normal';
        $user->Data_Nascimento = '1995-05-05';
        $user->Password = Hash::make('password');
        $user->CC = '87654321';
        $user->Email = 'user@example.com';
        $user->MoradaID_Morada = 2;
        $user->AprovacaoID_aprovacao = 2;
        $user->TipoUserID_TipoUser = 2; // Usuário Normal
        $user->ImagemID_Imagem = 1;
        $user->Status_UtilizadorID_status_utilizador = 1; // Ativo
        $user->save();
        
        echo "Usuário normal criado com sucesso!\n";
    } else {
        echo "Usuário normal já existe!\n";
    }
    
    echo "Processo concluído com sucesso!\n";

} catch (Exception $e) {
    echo "Erro: " . $e->getMessage() . "\n";
} finally {
    // Reativar verificação de chaves estrangeiras
    DB::statement('SET FOREIGN_KEY_CHECKS=1');
}
