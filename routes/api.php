<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnuncioController;
use App\Http\Controllers\MensagemController;
use App\Http\Controllers\TrocaController;
use App\Http\Controllers\AvaliacaoController;
use App\Http\Controllers\NotificacaoController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\TestController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\CartaoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Rotas públicas de autenticação
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/login', [AuthController::class, 'login']); // Rota alternativa para compatibilidade
Route::post('/auth/register', [AuthController::class, 'register']);
Route::get('/moradas', [AuthController::class, 'getMoradas']);

// Rotas públicas para categorias e tipos de item
Route::get('/categorias', [AnuncioController::class, 'getCategories']);
Route::get('/tipos-item', [AnuncioController::class, 'getTiposItem']);

// Rota pública para buscar anúncios sem autenticação
Route::get('/anuncios/publicos', [AnuncioController::class, 'getAnunciosPublicos']);

// Rota para listar anúncios por categoria
Route::get('/anuncios/categoria/{categoriaId}', [AnuncioController::class, 'byCategoria']);

// Rota para servir arquivos
Route::get('/files/id/{id}', [FileController::class, 'serveById']);

// Rota para obter anúncios aleatórios
Route::get('/anuncios/aleatorios', [AnuncioController::class, 'getAnunciosAleatorios']);

// Rota alternativa para obter anúncios do usuário (sem depender do middleware sanctum)
Route::get('/user/{userId}/anuncios', [AnuncioController::class, 'myAds']);

// Rotas de redefinição de senha
Route::post('/password/email', [AuthController::class, 'sendResetLinkEmail']);
Route::get('/password/reset/{token}', [AuthController::class, 'showResetForm']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);


// Rotas de teste
Route::get('/test', [TestController::class, 'test']);


// Rotas de teste básicas (mantidas para fins de diagnóstico)
Route::get('/test', [TestController::class, 'test']);

// Rota de teste simples que não requer controlador
Route::get('/ping', function() {
    return response()->json(['message' => 'pong']);
});

// Rota de teste para login que não usa o controlador existente
Route::post('/test-login', function(\Illuminate\Http\Request $request) {
    return response()->json([
        'message' => 'Requisição de login recebida',
        'data' => $request->all()
    ]);
});

// Rotas públicas de anúncios
Route::get('/anuncios/{id}', [AnuncioController::class, 'show']);

// Rotas protegidas que requerem autenticação
Route::middleware('auth:sanctum')->group(function () {
    // Rotas de utilizador
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/perfil', [AuthController::class, 'getUserProfile']);
    Route::post('/perfil', [AuthController::class, 'updateUserProfile']);
    
    // Rotas de compras do usuário
    Route::get('/compras/minhas', [CompraController::class, 'minhasCompras']);
    Route::get('/compras/{id}', [CompraController::class, 'show']);
    
    // Rotas de administrador
    Route::prefix('admin')->group(function () {
        // Users
        Route::get('/users/pending', [AdminController::class, 'getPendingUsers']);
        Route::post('/users/{userId}/approve', [AdminController::class, 'approveUser']);
        Route::post('/users/{userId}/reject', [AdminController::class, 'rejectUser']);
        Route::get('/users', [AdminController::class, 'getAllUsers']);
        Route::put('/users/{userId}/status', [AdminController::class, 'updateUserStatus']);
        Route::get('/stats/pending-users', [AdminController::class, 'getPendingUsersCount']);
        Route::get('/pending-users-count', [AdminController::class, 'pendingUsersCount']);

        // Anuncios (Admin Management)
        Route::get('/anuncios/pendentes', [AnuncioController::class, 'anunciosPendentes']);
        Route::post('/anuncios/{id}/aprovar', [AnuncioController::class, 'aprovarAnuncio']);
        Route::post('/anuncios/{id}/rejeitar', [AnuncioController::class, 'rejeitarAnuncio']);
        Route::get('/anuncios', [AdminController::class, 'getAllAnuncios']);
        Route::put('/anuncios/{anuncioId}/status', [AdminController::class, 'updateAnuncioStatus']);

        // Add other admin routes here...
    });

    // Rota para buscar anúncios do utilizador logado (mantida fora do prefixo admin)
    Route::get('/meus-anuncios', [AnuncioController::class, 'myAds']);

    // Rotas de administração de anúncios
    Route::get('/anuncios', [AnuncioController::class, 'index']);
    Route::post('/anuncios', [AnuncioController::class, 'store']);
    Route::put('/anuncios/{id}', [AnuncioController::class, 'update']);
    Route::delete('/anuncios/{id}', [AnuncioController::class, 'destroy']);
    Route::post('/anuncios/{id}/sold', [AnuncioController::class, 'markAsSold']);
    Route::post('/anuncios/{anuncioId}/imagens/{imagemId}/principal', [AnuncioController::class, 'updatePrincipalImage']);
    
    // Rotas de mensagens
    Route::get('/conversas', [MensagemController::class, 'getConversations']);
    Route::get('/mensagens/{anuncioId}', [MensagemController::class, 'getMessages']);
    Route::post('/mensagens/{anuncioId}/iniciar', [MensagemController::class, 'iniciarConversa']);
    Route::post('/mensagens/{anuncioId}/responder', [MensagemController::class, 'enviarMensagem']);
    Route::post('/mensagens/{anuncioId}/lidas', [MensagemController::class, 'markAsRead']);
    Route::get('/mensagens/nao-lidas/contar', [MensagemController::class, 'countUnread']);
    
    // Rotas de trocas
    Route::get('/trocas', [TrocaController::class, 'index']);
    Route::get('/trocas/{id}', [TrocaController::class, 'show']);
    Route::post('/trocas', [TrocaController::class, 'store']);
    Route::post('/trocas/{id}/aceitar', [TrocaController::class, 'accept']);
    Route::post('/trocas/{id}/rejeitar', [TrocaController::class, 'reject']);
    Route::post('/trocas/{id}/cancelar', [TrocaController::class, 'cancel']);
    Route::get('/trocas/recebidas/pendentes', [TrocaController::class, 'pendingReceived']);
    Route::get('/trocas/enviadas/pendentes', [TrocaController::class, 'pendingSent']);
    
    // Rotas de avaliações
    Route::get('/avaliacoes/recebidas', [AvaliacaoController::class, 'receivedRatings']);
    Route::get('/avaliacoes/enviadas', [AvaliacaoController::class, 'sentRatings']);
    Route::get('/avaliacoes/{id}', [AvaliacaoController::class, 'show']);
    Route::post('/avaliacoes/compra', [AvaliacaoController::class, 'storeForPurchase']);
    Route::post('/avaliacoes/{id}/responder', [AvaliacaoController::class, 'respondToRating']);
    Route::get('/avaliacoes/notas', [AvaliacaoController::class, 'getNotas']);
    Route::get('/avaliacoes/pendentes', [AvaliacaoController::class, 'getPendingRatings']);
    Route::get('/avaliacoes/estatisticas/{userId?}', [AvaliacaoController::class, 'getUserStats']);
    
    // Rotas de notificações
    Route::get('/notificacoes', [NotificacaoController::class, 'index']);
    Route::get('/notificacoes/nao-lidas', [NotificacaoController::class, 'unread']);
    Route::post('/notificacoes/{id}/lida', [NotificacaoController::class, 'markAsRead']);
    Route::post('/notificacoes/todas-lidas', [NotificacaoController::class, 'markAllAsRead']);
    Route::delete('/notificacoes/{id}', [NotificacaoController::class, 'destroy']);
    Route::delete('/notificacoes/lidas', [NotificacaoController::class, 'deleteAllRead']);
    Route::get('/notificacoes/nao-lidas/contar', [NotificacaoController::class, 'countUnread']);
    Route::get('/notificacoes/{id}', [NotificacaoController::class, 'show']);
    
    // Rotas de compras
    Route::get('/compras', [CompraController::class, 'index']);
    Route::get('/vendas', [CompraController::class, 'sales']);
    Route::post('/compras', [CompraController::class, 'store']);
    Route::put('/compras/{id}/status', [CompraController::class, 'updateStatus']);
    Route::post('/compras/{id}/cancelar', [CompraController::class, 'cancel']);
    Route::post('/compras/{id}/confirmar-recebimento', [CompraController::class, 'confirmReceipt']);
    Route::get('/compras/status/opcoes', [CompraController::class, 'getStatusOptions']);
    Route::get('/vendas/pendentes', [CompraController::class, 'pendingSales']);

    // Rotas para cartões
    Route::get('/cartoes', [CartaoController::class, 'index']);
    Route::post('/cartoes', [CartaoController::class, 'store']);
    Route::delete('/cartoes/{id}', [CartaoController::class, 'destroy']);

    // Rotas de Compras
    Route::post('/compras/anuncio/{anuncioId}', [CompraController::class, 'iniciarCompra']);
    Route::get('/compras/minhas', [CompraController::class, 'minhasCompras']);
    Route::get('/vendas/minhas', [CompraController::class, 'minhasVendas']);
    Route::put('/compras/{compraId}/status', [CompraController::class, 'atualizarStatus']);
    Route::get('/compras/{compraId}', [CompraController::class, 'detalhes']);
});