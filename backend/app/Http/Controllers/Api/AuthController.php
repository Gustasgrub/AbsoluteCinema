<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\InvalidTokenException;
use App\Services\JwtService;
use App\Services\RefreshTokenService;
use App\Support\ApiError;
use App\Support\Link;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

/**
 * Registracija, prisijungimas, žetonų atnaujinimas ir atsijungimas.
 *
 * Srautas:
 *  1. POST /auth/login    → access žetonas (JSON) + refresh žetonas (HttpOnly slapukas)
 *  2. Kitos užklausos     → "Authorization: Bearer <access žetonas>"
 *  3. Po 15 min. access žetonas pasibaigia → POST /auth/refresh (naršyklė pati atsiunčia slapuką)
 *  4. POST /auth/logout   → abu žetonai atšaukiami
 */
class AuthController extends Controller
{
    public function __construct(
        private JwtService $jwt,
        private RefreshTokenService $refreshTokens,
    ) {}

    // POST /auth/register → 201. Naujas naudotojas visada gauna rolę "member".
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->validated());

        return $this->respondWithTokens($user, $request, 201)
            ->header('Location', Link::url("users/{$user->id}"));
    }

    // POST /auth/login → 200 su žetonais, 401 jei blogi duomenys
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw new AuthenticationException('Invalid email or password.');
        }

        $this->refreshTokens->pruneExpired();

        return $this->respondWithTokens($user, $request);
    }

    // POST /auth/refresh → 200 su nauju access žetonu (ir nauju refresh slapuku), arba 401
    public function refresh(Request $request): JsonResponse
    {
        $plainToken = $request->cookie(config('jwt.cookie.name'));

        if (! $plainToken) {
            return ApiError::response(401, 'Refresh token cookie is missing. Please log in.');
        }

        try {
            [$user, $newRefreshToken] = $this->refreshTokens->rotate($plainToken, $request);
        } catch (InvalidTokenException $e) {
            return ApiError::response(401, $e->getMessage())->withCookie($this->refreshTokens->forgetCookie());
        }

        return $this->respondWithTokens($user, $request, 200, $newRefreshToken);
    }

    // POST /auth/logout → 204. Refresh žetonas ištrinamas, access žetonas įtraukiamas į juodąjį sąrašą.
    public function logout(Request $request): Response
    {
        $this->jwt->revoke($request->attributes->get('jwt'));
        $this->refreshTokens->delete($request->cookie(config('jwt.cookie.name')));

        return response()->noContent()->withCookie($this->refreshTokens->forgetCookie());
    }

    // Bendras atsakymas su žetonais: naudojamas register, login ir refresh
    private function respondWithTokens(User $user, Request $request, int $status = 200, ?string $refreshToken = null): JsonResponse
    {
        $refreshToken ??= $this->refreshTokens->create($user, $request);

        Auth::setUser($user);   // kad UserResource parodytų el. paštą (savo duomenys)

        return response()->json([
            'token_type' => 'Bearer',
            'access_token' => $this->jwt->createAccessToken($user),
            'expires_in' => $this->jwt->accessTtlSeconds(),
            'user' => new UserResource($user),
        ], $status)->withCookie($this->refreshTokens->cookie($refreshToken));
    }
}
