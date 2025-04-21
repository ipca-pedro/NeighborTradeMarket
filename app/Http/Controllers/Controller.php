<?php

namespace App\Http\Controllers;

/**
 * @OA\Info(
 *     title="NeighborTrade API",
 *     version="1.0.0",
 *     description="API para o sistema NeighborTrade - Plataforma de compra, venda e troca de produtos entre vizinhos",
 *     @OA\Contact(
 *         email="suporte@neighbortrade.com",
 *         name="Suporte NeighborTrade"
 *     ),
 *     @OA\License(
 *         name="MIT",
 *         url="https://opensource.org/licenses/MIT"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000",
 *     description="Servidor Local"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 * 
 * @OA\Tag(
 *     name="Auth",
 *     description="Endpoints de autenticação e gestão de usuários"
 * )
 * 
 * @OA\Tag(
 *     name="Admin",
 *     description="Endpoints exclusivos para administradores do sistema"
 * )
 */
abstract class Controller
{
    //
}
