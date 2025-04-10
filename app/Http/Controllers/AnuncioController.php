<?php

namespace App\Http\Controllers;

use App\Models\Anuncio;
use App\Models\Imagem;
use App\Models\Aprovacao;
use App\Models\Item_Imagem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class AnuncioController extends Controller
{
    /**
     * Listar todos os anúncios aprovados
     */
    public function index(Request $request)
    {
        // Filtros opcionais
        $categoria = $request->query('categoria');
        $tipo = $request->query('tipo');
        $preco_min = $request->query('preco_min');
        $preco_max = $request->query('preco_max');
        
        // Iniciar a query
        $query = Anuncio::where('Status_AnuncioID_Status_Anuncio', 2) // Status 2 = Aprovado
            ->with(['categoria', 'tipo_item', 'utilizador', 'imagens']);
        
        // Aplicar filtros se fornecidos
        if ($categoria) {
            $query->where('CategoriaID_Categoria', $categoria);
        }
        
        if ($tipo) {
            $query->where('Tipo_ItemID_Tipo', $tipo);
        }
        
        if ($preco_min) {
            $query->where('Preco', '>=', $preco_min);
        }
        
        if ($preco_max) {
            $query->where('Preco', '<=', $preco_max);
        }
        
        // Paginação
        $anuncios = $query->paginate(10);
        
        return response()->json($anuncios);
    }
    
    /**
     * Mostrar um anúncio específico
     */
    public function show($id)
    {
        $anuncio = Anuncio::with(['categoria', 'tipo_item', 'utilizador', 'imagens'])
            ->findOrFail($id);
        
        // Verificar se o anúncio está aprovado ou se pertence ao utilizador autenticado
        if ($anuncio->Status_AnuncioID_Status_Anuncio != 2 && 
            $anuncio->UtilizadorID_User != Auth::id()) {
            return response()->json([
                'message' => 'Anúncio não disponível'
            ], 403);
        }
        
        return response()->json($anuncio);
    }
    
    /**
     * Criar um novo anúncio
     */
    public function store(Request $request)
    {
        $request->validate([
            'Titulo' => 'required|string|max:255',
            'Descricao' => 'required|string',
            'Preco' => 'required|numeric|min:0',
            'Tipo_ItemID_Tipo' => 'required|exists:Tipo_Item,ID_Tipo',
            'CategoriaID_Categoria' => 'required|exists:Categoria,ID_Categoria',
            'imagens.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);
        
        DB::beginTransaction();
        
        try {
            // Criar aprovação pendente
            $aprovacao = new Aprovacao([
                'Data_Submissao' => now(),
                'UtilizadorID_Admin' => null, // Será preenchido quando for aprovado
                'Status_AprovacaoID_Status_Aprovacao' => 1 // Status pendente
            ]);
            $aprovacao->save();
            
            // Criar anúncio
            $anuncio = new Anuncio([
                'Titulo' => $request->Titulo,
                'Descricao' => $request->Descricao,
                'Preco' => $request->Preco,
                'UtilizadorID_User' => Auth::id(),
                'AprovacaoID_aprovacao' => $aprovacao->ID_aprovacao,
                'Tipo_ItemID_Tipo' => $request->Tipo_ItemID_Tipo,
                'CategoriaID_Categoria' => $request->CategoriaID_Categoria,
                'Status_AnuncioID_Status_Anuncio' => 1 // Status pendente
            ]);
            $anuncio->save();
            
            // Processar imagens se existirem
            if ($request->hasFile('imagens')) {
                foreach ($request->file('imagens') as $file) {
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('public/anuncios', $filename);
                    
                    // Criar imagem
                    $imagem = new Imagem([
                        'Caminho' => $path
                    ]);
                    $imagem->save();
                    
                    // Associar imagem ao anúncio
                    DB::table('Item_Imagem')->insert([
                        'ItemID_Item' => $anuncio->ID_Anuncio,
                        'ImagemID_Imagem' => $imagem->ID_Imagem
                    ]);
                }
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Anúncio criado com sucesso e aguardando aprovação',
                'anuncio' => $anuncio
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao criar anúncio: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Atualizar um anúncio existente
     */
    public function update(Request $request, $id)
    {
        $anuncio = Anuncio::findOrFail($id);
        
        // Verificar se o anúncio pertence ao utilizador
        if ($anuncio->UtilizadorID_User != Auth::id()) {
            return response()->json([
                'message' => 'Não autorizado a editar este anúncio'
            ], 403);
        }
        
        $request->validate([
            'Titulo' => 'sometimes|required|string|max:255',
            'Descricao' => 'sometimes|required|string',
            'Preco' => 'sometimes|required|numeric|min:0',
            'Tipo_ItemID_Tipo' => 'sometimes|required|exists:Tipo_Item,ID_Tipo',
            'CategoriaID_Categoria' => 'sometimes|required|exists:Categoria,ID_Categoria',
            'imagens.*' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'imagens_remover' => 'sometimes|array',
            'imagens_remover.*' => 'exists:Imagem,ID_Imagem'
        ]);
        
        DB::beginTransaction();
        
        try {
            // Atualizar anúncio
            if ($request->has('Titulo')) {
                $anuncio->Titulo = $request->Titulo;
            }
            
            if ($request->has('Descricao')) {
                $anuncio->Descricao = $request->Descricao;
            }
            
            if ($request->has('Preco')) {
                $anuncio->Preco = $request->Preco;
            }
            
            if ($request->has('Tipo_ItemID_Tipo')) {
                $anuncio->Tipo_ItemID_Tipo = $request->Tipo_ItemID_Tipo;
            }
            
            if ($request->has('CategoriaID_Categoria')) {
                $anuncio->CategoriaID_Categoria = $request->CategoriaID_Categoria;
            }
            
            // Se houver alterações significativas, voltar para status pendente
            if ($request->has('Titulo') || $request->has('Descricao') || $request->has('Preco')) {
                $anuncio->Status_AnuncioID_Status_Anuncio = 1; // Status pendente
                
                // Criar nova aprovação
                $aprovacao = new Aprovacao([
                    'Data_Submissao' => now(),
                    'UtilizadorID_Admin' => null,
                    'Status_AprovacaoID_Status_Aprovacao' => 1 // Status pendente
                ]);
                $aprovacao->save();
                
                $anuncio->AprovacaoID_aprovacao = $aprovacao->ID_aprovacao;
            }
            
            $anuncio->save();
            
            // Remover imagens se solicitado
            if ($request->has('imagens_remover')) {
                foreach ($request->imagens_remover as $imagemId) {
                    // Verificar se a imagem pertence a este anúncio
                    $itemImagem = DB::table('Item_Imagem')
                        ->where('ItemID_Item', $anuncio->ID_Anuncio)
                        ->where('ImagemID_Imagem', $imagemId)
                        ->first();
                    
                    if ($itemImagem) {
                        // Remover associação
                        DB::table('Item_Imagem')
                            ->where('ItemID_Item', $anuncio->ID_Anuncio)
                            ->where('ImagemID_Imagem', $imagemId)
                            ->delete();
                        
                        // Obter caminho da imagem
                        $imagem = Imagem::find($imagemId);
                        if ($imagem) {
                            // Remover arquivo
                            Storage::delete($imagem->Caminho);
                            
                            // Remover registro da imagem
                            $imagem->delete();
                        }
                    }
                }
            }
            
            // Adicionar novas imagens
            if ($request->hasFile('imagens')) {
                foreach ($request->file('imagens') as $file) {
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('public/anuncios', $filename);
                    
                    // Criar imagem
                    $imagem = new Imagem([
                        'Caminho' => $path
                    ]);
                    $imagem->save();
                    
                    // Associar imagem ao anúncio
                    DB::table('Item_Imagem')->insert([
                        'ItemID_Item' => $anuncio->ID_Anuncio,
                        'ImagemID_Imagem' => $imagem->ID_Imagem
                    ]);
                }
            }
            
            DB::commit();
            
            return response()->json([
                'message' => 'Anúncio atualizado com sucesso',
                'anuncio' => $anuncio
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao atualizar anúncio: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remover um anúncio
     */
    public function destroy($id)
    {
        $anuncio = Anuncio::findOrFail($id);
        
        // Verificar se o anúncio pertence ao utilizador
        if ($anuncio->UtilizadorID_User != Auth::id()) {
            return response()->json([
                'message' => 'Não autorizado a remover este anúncio'
            ], 403);
        }
        
        DB::beginTransaction();
        
        try {
            // Obter todas as imagens associadas
            $imagens = DB::table('Item_Imagem')
                ->where('ItemID_Item', $anuncio->ID_Anuncio)
                ->get();
            
            // Remover associações de imagens
            DB::table('Item_Imagem')
                ->where('ItemID_Item', $anuncio->ID_Anuncio)
                ->delete();
            
            // Remover imagens
            foreach ($imagens as $item) {
                $imagem = Imagem::find($item->ImagemID_Imagem);
                if ($imagem) {
                    Storage::delete($imagem->Caminho);
                    $imagem->delete();
                }
            }
            
            // Remover anúncio
            $anuncio->delete();
            
            DB::commit();
            
            return response()->json([
                'message' => 'Anúncio removido com sucesso'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Erro ao remover anúncio: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Listar anúncios do utilizador autenticado
     */
    public function myAds()
    {
        $anuncios = Anuncio::where('UtilizadorID_User', Auth::id())
            ->with(['categoria', 'tipo_item', 'status_anuncio', 'imagens'])
            ->get();
            
        return response()->json($anuncios);
    }
    
    /**
     * Marcar anúncio como vendido
     */
    public function markAsSold($id)
    {
        $anuncio = Anuncio::findOrFail($id);
        
        // Verificar se o anúncio pertence ao utilizador
        if ($anuncio->UtilizadorID_User != Auth::id()) {
            return response()->json([
                'message' => 'Não autorizado a modificar este anúncio'
            ], 403);
        }
        
        // Atualizar status para vendido (assumindo que ID 3 é para vendido)
        $anuncio->Status_AnuncioID_Status_Anuncio = 3;
        $anuncio->save();
        
        return response()->json([
            'message' => 'Anúncio marcado como vendido',
            'anuncio' => $anuncio
        ]);
    }
    
    /**
     * Obter categorias disponíveis
     */
    public function getCategorias()
    {
        $categorias = DB::table('Categoria')->get();
        return response()->json($categorias);
    }
    
    /**
     * Obter tipos de item disponíveis
     */
    public function getTiposItem()
    {
        $tipos = DB::table('Tipo_Item')->get();
        return response()->json($tipos);
    }
}
