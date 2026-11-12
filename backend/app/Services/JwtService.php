<?php

namespace App\Services;

use App\Models\User;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

/**
 * VISA darbo su JWT logika vienoje vietoje:
 *  - access žetono sukūrimas ir pasirašymas (HS256 + JWT_SECRET iš .env);
 *  - žetono patikrinimas (parašas, galiojimas, tipas, ar neatšauktas);
 *  - žetono atšaukimas atsijungiant (juodasis sąrašas kešuose).
 *
 * JWT struktūra: header.payload.signature (kiekviena dalis – base64url).
 * Payload (claims) pavyzdys:
 *   { "iss": "http://localhost:8000", "sub": "3", "role": "member", "name": "Rasa",
 *     "typ": "access", "iat": 1762500000, "exp": 1762500900, "jti": "9b1c..." }
 */
class JwtService
{
    public const TYPE_ACCESS = 'access';

    // Sukuria trumpai galiojantį access žetoną su naudotojo ID ir role
    public function createAccessToken(User $user): string
    {
        return $this->encode([
            'sub' => (string) $user->id,   // naudotojo ID
            'role' => $user->role,         // naudotojo rolė (member/admin)
            'name' => $user->name,
            'typ' => self::TYPE_ACCESS,
        ], $this->accessTtlSeconds());
    }

    /**
     * Patikrina žetoną ir grąžina jo duomenis (claims).
     *
     * @throws InvalidTokenException jei žetonas netinkamas
     */
    public function decode(string $token): object
    {
        try {
            // Biblioteka patikrina parašą ir laukus "exp", "nbf", "iat"
            $claims = JWT::decode($token, new Key($this->secret(), config('jwt.algorithm')));
        } catch (ExpiredException) {
            throw new InvalidTokenException('The token has expired.');
        } catch (Throwable) {
            throw new InvalidTokenException('The token is invalid.');
        }

        if (($claims->typ ?? null) !== self::TYPE_ACCESS || ! isset($claims->sub, $claims->jti)) {
            throw new InvalidTokenException('The token is invalid.');
        }

        if ($this->isRevoked($claims->jti)) {
            throw new InvalidTokenException('The token has been revoked.');
        }

        return $claims;
    }

    // Atsijungus access žetonas įrašomas į juodąjį sąrašą, kol natūraliai nebegalios
    public function revoke(object $claims): void
    {
        $secondsLeft = $claims->exp - time();

        if ($secondsLeft > 0) {
            Cache::put('revoked_jwt:'.$claims->jti, true, $secondsLeft);
        }
    }

    public function isRevoked(string $jti): bool
    {
        return Cache::has('revoked_jwt:'.$jti);
    }

    public function accessTtlSeconds(): int
    {
        return config('jwt.access_ttl') * 60;
    }

    // Prideda standartinius laukus ir pasirašo žetoną
    private function encode(array $claims, int $ttlSeconds): string
    {
        $now = time();

        $payload = [
            'iss' => config('jwt.issuer'),     // kas išdavė
            ...$claims,
            'iat' => $now,                     // kada išduotas
            'exp' => $now + $ttlSeconds,       // kada nustos galioti
            'jti' => (string) Str::uuid(),     // unikalus žetono ID (reikalingas atšaukimui)
        ];

        return JWT::encode($payload, $this->secret(), config('jwt.algorithm'));
    }

    private function secret(): string
    {
        $secret = (string) config('jwt.secret');

        if (strlen($secret) < 32) {
            throw new RuntimeException('JWT_SECRET is missing or too short. Run: php artisan jwt:secret');
        }

        return $secret;
    }
}
