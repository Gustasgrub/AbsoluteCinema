<?php

namespace App\Http\Middleware;

use App\Models\User;
use App\Services\InvalidTokenException;
use App\Services\JwtService;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Contracts\Auth\Middleware\AuthenticatesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Vienintelė vieta, kur tikrinamas access žetonas (JWT).
 *
 * Naudojimas maršrutuose (routes/api.php):
 *   ->middleware('jwt')           – žetonas privalomas, kitaip 401 Unauthorized;
 *   ->middleware('jwt:optional')  – svečias praleidžiamas, bet jei žetonas atsiųstas, jis tikrinamas.
 *
 * Interfeisas AuthenticatesRequests užtikrina, kad šis middleware vyktų anksčiau
 * nei resursų paieška – todėl neprisijungęs naudotojas gauna 401, o ne 404.
 */
class AuthenticateJwt implements AuthenticatesRequests
{
    public function __construct(private JwtService $jwt) {}

    public function handle(Request $request, Closure $next, string $mode = 'required'): Response
    {
        $token = $request->bearerToken();   // "Authorization: Bearer <token>"

        if ($token === null) {
            if ($mode === 'optional') {
                return $next($request);     // svečias
            }

            throw new AuthenticationException('Access token is missing. Send it as "Authorization: Bearer <token>".');
        }

        try {
            $claims = $this->jwt->decode($token);
        } catch (InvalidTokenException $e) {
            throw new AuthenticationException($e->getMessage());
        }

        $user = User::find($claims->sub);

        if ($user === null) {
            throw new AuthenticationException('The user of this token no longer exists.');
        }

        // Jei administratorius pakeitė rolę, senas žetonas su sena role nebegalioja
        if ($user->role !== $claims->role) {
            throw new AuthenticationException('Your role has changed. Please refresh the token.');
        }

        Auth::setUser($user);                       // nuo šiol $request->user() grąžina šį naudotoją
        $request->attributes->set('jwt', $claims);   // atsijungimui reikia žetono ID (jti)

        return $next($request);
    }
}
