<?php

namespace App\Services;

use App\Models\RefreshToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Cookie;

/**
 * Refresh žetonų valdymas (atnaujinimo strategija):
 *  - prisijungus išduodamas ilgai galiojantis refresh žetonas (HttpOnly slapukas);
 *  - kai access žetonas pasibaigia, klientas kviečia POST /auth/refresh;
 *  - kiekvieną kartą senas refresh žetonas atšaukiamas ir išduodamas naujas (rotacija);
 *  - jei bandoma panaudoti seną (jau pakeistą) žetoną – tai gali būti vagystė,
 *    todėl atšaukiamos visos to naudotojo sesijos.
 */
class RefreshTokenService
{
    // Per kiek sekundžių tą patį seną žetoną dar galima panaudoti (pvz. dvi naršyklės kortelės vienu metu)
    private const GRACE_SECONDS = 30;

    public function create(User $user, Request $request): string
    {
        $plainToken = Str::random(64);

        $user->refreshTokens()->create([
            'token_hash' => hash('sha256', $plainToken),
            'expires_at' => now()->addMinutes(config('jwt.refresh_ttl')),
            'user_agent' => Str::limit((string) $request->userAgent(), 250, ''),
            'ip_address' => $request->ip(),
        ]);

        return $plainToken;
    }

    /**
     * Patikrina refresh žetoną ir pakeičia jį nauju.
     *
     * @return array{0: User, 1: string} [naudotojas, naujas refresh žetonas]
     *
     * @throws InvalidTokenException
     */
    public function rotate(string $plainToken, Request $request): array
    {
        $token = RefreshToken::with('user')->where('token_hash', hash('sha256', $plainToken))->first();

        if (! $token || ! $token->user || $token->expires_at->isPast()) {
            throw new InvalidTokenException('The refresh token is invalid or expired. Please log in again.');
        }

        if ($token->revoked_at === null) {
            $token->update(['revoked_at' => now()]);
        } elseif ($token->revoked_at->lt(now()->subSeconds(self::GRACE_SECONDS))) {
            // Senas žetonas panaudotas dar kartą → galima vagystė → atšaukiame viską
            $this->deleteAllFor($token->user);
            throw new InvalidTokenException('Refresh token reuse detected. All sessions were revoked.');
        }

        return [$token->user, $this->create($token->user, $request)];
    }

    // Atsijungiant – ištriname konkretų žetoną
    public function delete(?string $plainToken): void
    {
        if ($plainToken) {
            RefreshToken::where('token_hash', hash('sha256', $plainToken))->delete();
        }
    }

    public function deleteAllFor(User $user): void
    {
        $user->refreshTokens()->delete();
    }

    // Išvalome nebegaliojančius įrašus, kad lentelė neaugtų be galo
    public function pruneExpired(): void
    {
        RefreshToken::where('expires_at', '<', now())->delete();
    }

    // HttpOnly – JavaScript negali perskaityti slapuko (apsauga nuo XSS)
    // Secure   – siunčiamas tik per HTTPS
    // SameSite – nesiunčiamas iš svetimų svetainių (apsauga nuo CSRF)
    public function cookie(string $plainToken): Cookie
    {
        return cookie(
            name: config('jwt.cookie.name'),
            value: $plainToken,
            minutes: config('jwt.refresh_ttl'),
            path: config('jwt.cookie.path'),
            secure: config('jwt.cookie.secure'),
            httpOnly: true,
            sameSite: config('jwt.cookie.same_site'),
        );
    }

    // Tas pats slapukas, bet jau pasibaigęs – naršyklė jį ištrina
    public function forgetCookie(): Cookie
    {
        return cookie(
            name: config('jwt.cookie.name'),
            value: '',
            minutes: -60,
            path: config('jwt.cookie.path'),
            secure: config('jwt.cookie.secure'),
            httpOnly: true,
            sameSite: config('jwt.cookie.same_site'),
        );
    }
}
