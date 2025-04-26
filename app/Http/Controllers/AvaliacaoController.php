<?php

namespace App\Http\Controllers;

use App\Models\Avaliacao;
use App\Models\Aprovacao;
use App\Models\Compra;
use App\Models\Troca;
use App\Models\Nota;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AvaliacaoController extends Controller
{
    /**
     * Listar avaliações recebidas pelo utilizador autenticado
     */
    public function receivedRatings()
    {
        $userId = Auth::id();
        
        // Buscar avaliações recebidas (através de compras e trocas)
        $avaliacoes = Avaliacao::whereHas('compra', function($query) use ($userId) {
                // Compras onde o utilizador é o vendedor
                $query->whereHas('anuncio', function($q) use ($userId) {
                    $q->where('UtilizadorID_User', $userId);
                });
            })
            ->with(['nota', 'compra', 'compra.anuncio', 'compra.utilizador'])
            ->orderBy('Data_Avaliacao', 'desc')
            ->get();
        
        return response()->json($avaliacoes);
    }
    
    /**
     * Listar avaliações feitas pelo utilizador autenticado
     */
    public function sentRatings()
    {
        $userId = Auth::id();
        
        // Buscar avaliações feitas pelo utilizador
        $avaliacoes = Avaliacao::whereHas('compra', function($query) use ($userId) {
                // Compras onde o utilizador é o comprador
                $query->where('UtilizadorID_User', $userId);
            })
            ->with(['nota', 'compra', 'compra.anuncio', 'compra.anuncio.utilizador'])
            ->orderBy('Data_Avaliacao', 'desc')
            ->get();
        
        return response()->json($avaliacoes);
    }
    
    /**
     * Mostrar detalhes de uma avaliação específica
     */
    public function show($id)
    {
        $userId = Auth::id();
        
        $avaliacao = Avaliacao::with(['nota', 'compra', 'compra.anuncio', 'compra.utilizador', 'compra.anuncio.utilizador'])
            ->findOrFail($id);
        
        // Verificar se o utilizador está envolvido na avaliação
        $compra = $avaliacao->compra;
        $anuncio = $compra->anuncio;
        
        if ($compra->UtilizadorID_User != $userId && $anuncio->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Não autorizado a ver esta avaliação'
            ], 403);
        }
        
        return response()->json($avaliacao);
    }
    
    /**
     * Criar uma nova avaliação para uma compra
     */
    public function storeForPurchase(Request $request)
    {
        $request->validate([
            'compra_id' => 'required|exists:compra,ID_Compra',
            'nota_id' => 'required|exists:nota,ID_Nota',
            'comentario' => 'required|string|max:255'
        ]);
        
        $userId = Auth::id();
        $compraId = $request->compra_id;
        
        // Verificar se a compra existe e se o utilizador é o comprador
        $compra = Compra::findOrFail($compraId);
        
        if ($compra->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Você não é o comprador deste item'
            ], 403);
        }
        
        // Verificar se já existe uma avaliação para esta compra
        $avaliacaoExistente = Avaliacao::where('OrdemID_Produto', $compraId)->first();
        
        if ($avaliacaoExistente) {
            return response()->json([
                'message' => 'Já existe uma avaliação para esta compra'
            ], 400);
        }
        
        DB::beginTransaction();
        
        try {
            // Criar avaliação
            $avaliacao = new Avaliacao([
                'Comentario' => $request->comentario,
                'Data_Avaliacao' => now(),
                'NotaID_Nota' => $request->nota_id,
                'OrdemID_Produto' => $compraId
            ]);
            
            $avaliacao->save();
            
            // Buscar o anúncio e o vendedor para a notificação
            $anuncio = $compra->anuncio;
            $vendedor = $anuncio->utilizador;
            
            // Criar notificação para o vendedor
            DB::table('notificacao')->insert([
                'Mensagem' => 'Você recebeu uma nova avaliação para o anúncio: ' . $anuncio->Titulo,
                'DataNotificacao' => now(),
                'ReferenciaID' => $avaliacao->Id_Avaliacao,
                'UtilizadorID_User' => $vendedor->ID_User,
                'ReferenciaTipoID_ReferenciaTipo' => 5, // Avaliações
                'TIpo_notificacaoID_TipoNotificacao' => 7, // Notificações de avaliação
                'Estado_notificacaoID_estado_notificacao' => 1 // Não lida
            ]);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Avaliação enviada com sucesso',
                'avaliacao' => $avaliacao
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao criar avaliação: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Responder a uma avaliação (como vendedor)
     */
    public function respondToRating(Request $request, $id)
    {
        $request->validate([
            'resposta' => 'required|string|max:255'
        ]);
        
        $userId = Auth::id();
        
        // Buscar a avaliação
        $avaliacao = Avaliacao::with(['compra', 'compra.anuncio'])
            ->findOrFail($id);
        
        // Verificar se o utilizador é o vendedor
        $compra = $avaliacao->compra;
        $anuncio = $compra->anuncio;
        
        if ($anuncio->UtilizadorID_User != $userId) {
            return response()->json([
                'message' => 'Você não é o vendedor deste item'
            ], 403);
        }
        
        // Verificar se a avaliação já tem resposta
        if ($avaliacao->Resposta) {
            return response()->json([
                'message' => 'Esta avaliação já possui uma resposta'
            ], 400);
        }
        
        // Atualizar a avaliação com a resposta
        $avaliacao->Resposta = $request->resposta;
        $avaliacao->Data_Resposta = now();
        $avaliacao->save();
        
        // Criar notificação para o comprador
        DB::table('Notificacao')->insert([
            'Mensagem' => 'O vendedor respondeu à sua avaliação para o anúncio: ' . $anuncio->Titulo,
            'DataNotificacao' => now(),
            'ReferenciaID' => $avaliacao->Id_Avaliacao,
            'UtilizadorID_User' => $compra->UtilizadorID_User,
            'ReferenciaTipoID_ReferenciaTipo' => 4, // Avaliações
            'TIpo_notificacaoID_TipoNotificacao' => 4, // Notificações de avaliação
            'Estado_notificacaoID_estado_notificacao' => 1 // Não lida
        ]);
        
        return response()->json([
            'message' => 'Resposta enviada com sucesso',
            'avaliacao' => $avaliacao
        ]);
    }
    
    /**
     * Obter as opções de notas disponíveis
     */
    public function getNotas()
    {
        $notas = DB::table('nota')->select('ID_Nota', 'Descricao_nota')->get();
        return response()->json($notas);
    }
    
    /**
     * Listar compras que podem ser avaliadas pelo utilizador
     */
    public function getPendingRatings()
    {
        $userId = Auth::id();
        
        // Buscar compras do utilizador que ainda não foram avaliadas
        $compras = Compra::where('UtilizadorID_User', $userId)
            ->whereDoesntHave('avaliacao')
            ->with(['anuncio', 'anuncio.utilizador'])
            ->orderBy('Data', 'desc')
            ->get();
        
        return response()->json($compras);
    }
    
    /**
     * Obter estatísticas de avaliações de um utilizador
     */
    public function getUserStats($userId = null)
    {
        // Se não for especificado, usar o ID do utilizador autenticado
        if (!$userId) {
            $userId = Auth::id();
        }
        
        // Verificar se o utilizador existe
        $utilizador = DB::table('Utilizador')->where('ID_User', $userId)->first();
        
        if (!$utilizador) {
            return response()->json([
                'message' => 'Utilizador não encontrado'
            ], 404);
        }
        
        // Buscar anúncios do utilizador
        $anunciosIds = DB::table('Anuncio')
            ->where('UtilizadorID_User', $userId)
            ->pluck('ID_Anuncio')
            ->toArray();
        
        // Buscar compras desses anúncios
        $comprasIds = DB::table('Compra')
            ->whereIn('AnuncioID_Anuncio', $anunciosIds)
            ->pluck('ID_Compra')
            ->toArray();
        
        // Estatísticas de avaliações
        $totalAvaliacoes = DB::table('Avaliacao')
            ->whereIn('OrdemID_Produto', $comprasIds)
            ->count();
        
        // Média de avaliações (assumindo que a nota é um valor numérico)
        $mediaAvaliacoes = DB::table('Avaliacao as a')
            ->join('Nota as n', 'a.NotaID_Nota', '=', 'n.ID_Nota')
            ->whereIn('a.OrdemID_Produto', $comprasIds)
            ->avg('n.Valor'); // Assumindo que existe uma coluna 'Valor' na tabela Nota
        
        // Distribuição de notas
        $distribuicaoNotas = DB::table('Avaliacao as a')
            ->join('Nota as n', 'a.NotaID_Nota', '=', 'n.ID_Nota')
            ->whereIn('a.OrdemID_Produto', $comprasIds)
            ->select('n.ID_Nota', 'n.Descricao_nota', DB::raw('COUNT(*) as total'))
            ->groupBy('n.ID_Nota', 'n.Descricao_nota')
            ->get();
        
        return response()->json([
            'utilizador' => $utilizador,
            'total_avaliacoes' => $totalAvaliacoes,
            'media_avaliacoes' => $mediaAvaliacoes,
            'distribuicao_notas' => $distribuicaoNotas
        ]);
    }
}
