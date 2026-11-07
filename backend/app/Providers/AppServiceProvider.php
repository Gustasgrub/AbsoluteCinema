<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // "jwt" guard: naudotoją nustato AuthenticateJwt middleware (Auth::setUser),
        // todėl be jo naudotojas visada laikomas svečiu (null)
        Auth::viaRequest('jwt', fn () => null);

        // Produkcijoje (Railway) HTTPS baigiasi proxy serveryje – nuorodos visada turi būti https://
        if (config('app.force_https')) {
            URL::forceScheme('https');
        }

        // ID parametrai turi būti skaičiai: /studios/abc → 404, o ne klaida
        Route::pattern('studio', '[0-9]+');
        Route::pattern('movie', '[0-9]+');
        Route::pattern('review', '[0-9]+');
        Route::pattern('user', '[0-9]+');

        // Užklausų limitai (viršijus → 429 Too Many Requests)
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(300)->by($request->user()?->id ?: $request->ip()));

        // Prisijungimui griežčiau – apsauga nuo slaptažodžių spėliojimo
        RateLimiter::for('auth', function (Request $request) {
            $email = is_string($request->input('email')) ? strtolower($request->input('email')) : '';

            return Limit::perMinute(10)->by($email.'|'.$request->ip());
        });
    }
}
