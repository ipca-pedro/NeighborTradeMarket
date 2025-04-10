<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to your application's "home" route.
     *
     * Typically, users are redirected here after authentication.
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     */
    public function boot(): void
    {
        // Configurar o limitador de taxa para a API
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->ID_User ?: $request->ip());
        });
        
        // Registar as rotas da API
        Route::middleware('api')
            ->prefix('api')
            ->group(base_path('routes/api.php'));
            
        // Registar as rotas web
        Route::middleware('web')
            ->group(base_path('routes/web.php'));
    }
}
