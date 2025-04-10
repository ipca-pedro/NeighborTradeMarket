<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class InitialDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Status de Utilizador
        if (DB::table('Status_Utilizador')->count() == 0) {
            DB::table('Status_Utilizador')->insert([
                ['ID_status_utilizador' => 1, 'Descricao_status_utilizador' => 'Pendente'],
                ['ID_status_utilizador' => 2, 'Descricao_status_utilizador' => 'Ativo'],
                ['ID_status_utilizador' => 3, 'Descricao_status_utilizador' => 'Inativo'],
                ['ID_status_utilizador' => 4, 'Descricao_status_utilizador' => 'Bloqueado']
            ]);
        }

        // Tipo de Utilizador
        if (DB::table('TipoUser')->count() == 0) {
            DB::table('TipoUser')->insert([
                ['ID_TipoUser' => 1, 'Descrição_TipoUtilizador' => 'Administrador'],
                ['ID_TipoUser' => 2, 'Descrição_TipoUtilizador' => 'Utilizador Normal']
            ]);
        }

        // Status de Aprovação
        if (DB::table('Status_Aprovacao')->count() == 0) {
            DB::table('Status_Aprovacao')->insert([
                ['ID_Status_Aprovacao' => 1, 'Descricao_Status_aprovacao' => 'Pendente'],
                ['ID_Status_Aprovacao' => 2, 'Descricao_Status_aprovacao' => 'Aprovado'],
                ['ID_Status_Aprovacao' => 3, 'Descricao_Status_aprovacao' => 'Rejeitado']
            ]);
        }

        // Status de Anúncio
        if (DB::table('Status_Anuncio')->count() == 0) {
            DB::table('Status_Anuncio')->insert([
                ['ID_Status_Anuncio' => 1, 'Descricao_status_anuncio' => 'Ativo'],
                ['ID_Status_Anuncio' => 2, 'Descricao_status_anuncio' => 'Inativo'],
                ['ID_Status_Anuncio' => 3, 'Descricao_status_anuncio' => 'Vendido'],
                ['ID_Status_Anuncio' => 4, 'Descricao_status_anuncio' => 'Pendente']
            ]);
        }

        // Status de Mensagem
        if (DB::table('Status_Mensagem')->count() == 0) {
            DB::table('Status_Mensagem')->insert([
                ['ID_Status_Mensagem' => 1, 'Descricao_status_mensagem' => 'Não Lida'],
                ['ID_Status_Mensagem' => 2, 'Descricao_status_mensagem' => 'Lida']
            ]);
        }

        // Status de Troca
        if (DB::table('Status_Troca')->count() == 0) {
            DB::table('Status_Troca')->insert([
                ['ID_Status_Troca' => 1, 'Descricao_status_troca' => 'Pendente'],
                ['ID_Status_Troca' => 2, 'Descricao_status_troca' => 'Aceita'],
                ['ID_Status_Troca' => 3, 'Descricao_status_troca' => 'Rejeitada'],
                ['ID_Status_Troca' => 4, 'Descricao_status_troca' => 'Cancelada']
            ]);
        }

        // Status de Reclamação
        if (DB::table('Status_Reclamacao')->count() == 0) {
            DB::table('Status_Reclamacao')->insert([
                ['ID_Status_Reclamacao' => 1, 'Descricao_status_reclamacao' => 'Pendente'],
                ['ID_Status_Reclamacao' => 2, 'Descricao_status_reclamacao' => 'Em Análise'],
                ['ID_Status_Reclamacao' => 3, 'Descricao_status_reclamacao' => 'Resolvida'],
                ['ID_Status_Reclamacao' => 4, 'Descricao_status_reclamacao' => 'Rejeitada']
            ]);
        }

        // Status de Compra - Tabela será criada posteriormente se necessário

        // Notas para avaliações
        if (DB::table('Nota')->count() == 0) {
            DB::table('Nota')->insert([
                ['ID_Nota' => 1, 'Descricao_nota' => '1 Estrela'],
                ['ID_Nota' => 2, 'Descricao_nota' => '2 Estrelas'],
                ['ID_Nota' => 3, 'Descricao_nota' => '3 Estrelas'],
                ['ID_Nota' => 4, 'Descricao_nota' => '4 Estrelas'],
                ['ID_Nota' => 5, 'Descricao_nota' => '5 Estrelas']
            ]);
        }

        // Tipos de Item
        if (DB::table('Tipo_Item')->count() == 0) {
            DB::table('Tipo_Item')->insert([
                ['ID_Tipo' => 1, 'Descricao_TipoItem' => 'Produto'],
                ['ID_Tipo' => 2, 'Descricao_TipoItem' => 'Serviço']
            ]);
        }

        // Categorias
        if (DB::table('Categoria')->count() == 0) {
            DB::table('Categoria')->insert([
                ['ID_Categoria' => 1, 'Descricao_Categoria' => 'Eletrônicos'],
                ['ID_Categoria' => 2, 'Descricao_Categoria' => 'Móveis'],
                ['ID_Categoria' => 3, 'Descricao_Categoria' => 'Roupas'],
                ['ID_Categoria' => 4, 'Descricao_Categoria' => 'Livros'],
                ['ID_Categoria' => 5, 'Descricao_Categoria' => 'Esportes'],
                ['ID_Categoria' => 6, 'Descricao_Categoria' => 'Outros']
            ]);
        }

        // Imagem padrão
        if (DB::table('Imagem')->count() == 0) {
            DB::table('Imagem')->insert([
                ['ID_Imagem' => 1, 'Caminho' => 'public/perfil/default.png']
            ]);
        }

        // Morada exemplo (para testes)
        if (DB::table('Morada')->count() == 0) {
            DB::table('Morada')->insert([
                ['ID_Morada' => 1, 'Rua' => 'Rua de Exemplo, 123']
            ]);
        }

        // Criar um utilizador administrador
        if (DB::table('Utilizador')->count() == 0) {
            // Criar aprovação para o admin
            DB::table('Aprovacao')->insert([
                [
                    'ID_aprovacao' => 1,
                    'Comentario' => 'Administrador do sistema',
                    'Data_Submissao' => now(),
                    'Data_Aprovacao' => now(),
                    'UtilizadorID_Admin' => 1, // Auto-aprovação
                    'Status_AprovacaoID_Status_Aprovacao' => 2 // Aprovado
                ]
            ]);

            // Criar o utilizador admin
            DB::table('Utilizador')->insert([
                [
                    'ID_User' => 1,
                    'User_Name' => 'admin',
                    'Name' => 'Administrador',
                    'Data_Nascimento' => '1990-01-01',
                    'Password' => Hash::make('admin123'),
                    'CC' => '12345678',
                    'Email' => 'admin@example.com',
                    'MoradaID_Morada' => 1,
                    'AprovacaoID_aprovacao' => 1,
                    'TipoUserID_TipoUser' => 1, // Administrador
                    'ImagemID_Imagem' => 1, // Imagem padrão
                    'Status_UtilizadorID_status_utilizador' => 2 // Ativo
                ]
            ]);
        }
    }
}
