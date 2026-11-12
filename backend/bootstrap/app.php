<?php

use App\Http\Middleware\AuthenticateJwt;
use App\Http\Middleware\ValidateJsonBody;
use App\Support\ApiError;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api/v1',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // Render / Caddy proxy perduoda tikrąjį adresą ir protokolą (https) X-Forwarded-* antraštėmis
        $middleware->trustProxies(at: '*');

        // Middleware trumpiniai, naudojami routes/api.php
        $middleware->alias([
            'jwt' => AuthenticateJwt::class,
        ]);

        // Kiekvienai API užklausai: JSON patikra (400/415) ir užklausų limitas (429)
        $middleware->api(prepend: [ValidateJsonBody::class]);
        $middleware->throttleApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(fn (Request $request) => $request->is('api/*') || $request->expectsJson());

        // Visos API klaidos grąžinamos vienodu JSON formatu su teisingu statuso kodu (žr. App\Support\ApiError)
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                return ApiError::fromException($e, $request);
            }
        });
    })->create();
