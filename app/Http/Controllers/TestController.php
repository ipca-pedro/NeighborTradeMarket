<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    /**
     * Endpoint de teste básico
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        return response()->json([
            'mensagem' => 'API funcionando corretamente!',
            'status' => 'online',
            'timestamp' => now()->toDateTimeString(),
            'projeto' => 'NT - Marketplace de Produtos e Serviços',
            'versao' => '1.0'
        ]);
    }
}