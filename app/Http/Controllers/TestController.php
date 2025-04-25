<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use App\Models\Anuncio;
use App\Models\Aprovacao;
use Illuminate\Support\Facades\Log;
use App\Models\ItemImagem;
use App\Models\Imagem;

class TestController extends Controller
{
    public function test()
    {
        return response()->json([
            'message' => 'API está funcionando!'
        ]);
    }
    
    public function testRejeitar(Request $request, $id)
    {
        Log::info('Teste de rejeição iniciado', [
            'anuncio_id' => $id,
            'request_data' => $request->all()
        ]);
        
        try {
            DB::beginTransaction();
            
            // Buscar anúncio
            $anuncio = Anuncio::find($id);
            
            if (!$anuncio) {
                Log::error('Anúncio não encontrado', ['id' => $id]);
                return response()->json(['message' => 'Anúncio não encontrado'], 404);
            }
            
            Log::info('Anúncio encontrado', ['anuncio' => $anuncio->toArray()]);
            
            // Atualizar status
            $anuncio->Status_AnuncioID_Status_Anuncio = 3; // Rejeitado
            $anuncio->save();
            
            // Buscar aprovação
            $aprovacao = Aprovacao::find($anuncio->AprovacaoID_aprovacao);
            
            if (!$aprovacao) {
                Log::error('Aprovação não encontrada', ['aprovacao_id' => $anuncio->AprovacaoID_aprovacao]);
                return response()->json(['message' => 'Aprovação não encontrada'], 404);
            }
            
            Log::info('Aprovação encontrada', ['aprovacao' => $aprovacao->toArray()]);
            
            // Atualizar aprovação
            $aprovacao->Status_AprovacaoID_Status_Aprovacao = 3; // Rejeitado
            $aprovacao->Data_Aprovacao = now();
            $aprovacao->UtilizadorID_Admin = 1; // Admin padrão
            
            // Salvar comentário se existir
            if ($request->has('motivo')) {
                $aprovacao->Comentario = $request->motivo;
                Log::info('Motivo definido', ['motivo' => $request->motivo]);
            }
            
            $aprovacao->save();
            
            DB::commit();
            
            Log::info('Teste de rejeição concluído com sucesso');
            
            return response()->json([
                'message' => 'Anúncio rejeitado com sucesso no teste',
                'anuncio' => $anuncio,
                'aprovacao' => $aprovacao
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erro no teste de rejeição', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro no teste: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
    
    public function dbConnection()
    {
        try {
            DB::connection()->getPdo();
            return response()->json([
                'status' => 'success',
                'message' => 'Database connection is working!',
                'database' => DB::connection()->getDatabaseName()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Database connection failed!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function authTest(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Authentication is working!',
            'user' => Auth::user()
        ]);
    }
    
    public function requestInfo(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'method' => $request->method(),
            'url' => $request->url(),
            'path' => $request->path(),
            'headers' => $request->headers->all(),
            'ip' => $request->ip(),
            'query' => $request->query(),
            'input' => $request->all()
        ]);
    }
    
    public function serverInfo()
    {
        return response()->json([
            'status' => 'success',
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'environment' => app()->environment(),
            'debug_mode' => config('app.debug')
        ]);
    }
    
    public function dbTables()
    {
        try {
            $tables = DB::select('SHOW TABLES');
            $tableNames = [];
            
            foreach ($tables as $table) {
                $tableName = array_values((array) $table)[0];
                $tableNames[] = $tableName;
            }
            
            return response()->json([
                'status' => 'success',
                'tables' => $tableNames,
                'count' => count($tableNames)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to get database tables!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Inspecionar a estrutura da tabela item_imagem
     */
    public function inspecionarTabelaItemImagem()
    {
        try {
            // Obter a estrutura da tabela
            $colunas = Schema::getColumnListing('item_imagem');
            
            // Obter alguns registros de exemplo
            $registros = DB::table('item_imagem')->take(5)->get();
            
            // Executar uma consulta SQL direta para descrever a tabela
            $descricao = DB::select('DESCRIBE item_imagem');
            
            // Verificar se a coluna Principal existe
            $temColunaPrincipal = in_array('Principal', $colunas);
            
            // Log para debug
            Log::info('Inspeção da tabela item_imagem', [
                'colunas' => $colunas,
                'tem_coluna_principal' => $temColunaPrincipal,
                'descricao_tabela' => $descricao
            ]);
            
            return response()->json([
                'message' => 'Inspeção da tabela item_imagem',
                'colunas' => $colunas,
                'tem_coluna_principal' => $temColunaPrincipal,
                'registros_exemplo' => $registros,
                'descricao_tabela' => $descricao
            ]);
        } catch (\Exception $e) {
            Log::error('Erro ao inspecionar tabela item_imagem', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro ao inspecionar tabela',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Teste de inserção na tabela item_imagem
     */
    public function testeInserirItemImagem(Request $request)
    {
        try {
            // Verificar se os parâmetros necessários foram fornecidos
            $itemId = $request->input('item_id');
            $imagemId = $request->input('imagem_id');
            
            if (!$itemId || !$imagemId) {
                return response()->json([
                    'message' => 'É necessário fornecer item_id e imagem_id'
                ], 400);
            }
            
            // Log dos parâmetros
            Log::info('Teste de inserção em item_imagem', [
                'item_id' => $itemId,
                'imagem_id' => $imagemId
            ]);
            
            // Verificar se a imagem e o item existem
            $imagem = DB::table('imagem')->where('ID_Imagem', $imagemId)->first();
            $item = DB::table('anuncio')->where('ID_Anuncio', $itemId)->first();
            
            // Log dos resultados da consulta
            Log::info('Verificação de existência', [
                'imagem_existe' => !empty($imagem),
                'item_existe' => !empty($item)
            ]);
            
            if (empty($imagem)) {
                return response()->json([
                    'message' => 'Imagem não encontrada'
                ], 404);
            }
            
            if (empty($item)) {
                return response()->json([
                    'message' => 'Item (anúncio) não encontrado'
                ], 404);
            }
            
            // Tentar inserção direta via SQL para evitar problemas do modelo
            DB::statement('INSERT INTO item_imagem (ItemID_Item, ImagemID_Imagem) VALUES (?, ?)', [
                $itemId, $imagemId
            ]);
            
            Log::info('Inserção direta via SQL realizada com sucesso');
            
            // Agora tentar via modelo Eloquent
            $itemImagem = new ItemImagem();
            $itemImagem->ItemID_Item = $itemId;
            $itemImagem->ImagemID_Imagem = $imagemId;
            // Se a coluna Principal existir, usar 0 como valor padrão
            if (Schema::hasColumn('item_imagem', 'Principal')) {
                $itemImagem->Principal = 0;
            }
            $itemImagem->save();
            
            Log::info('Inserção via Eloquent realizada com sucesso');
            
            return response()->json([
                'message' => 'Teste de inserção realizado com sucesso',
                'sql_direto' => true,
                'eloquent' => true
            ]);
        } catch (\Exception $e) {
            Log::error('Erro no teste de inserção', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Erro no teste de inserção',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
}