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
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FA\Google2FA;

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

    // POST /auth/login → 200 su žetonais, 401 jei blogi duomenys, arba 2FA iššūkis
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->validated('email'))->first();

        if (! $user || ! Hash::check($request->validated('password'), $user->password)) {
            throw new AuthenticationException('Invalid email or password.');
        }

        // Jei įjungta 2FA – žetonų dar neduodame, prašome kodo iš autentifikatoriaus programėlės
        if ($user->hasTwoFactorEnabled()) {
            return response()->json([
                'two_factor_required' => true,
                'two_factor_token' => $this->jwt->createTwoFactorToken($user),
                'expires_in' => config('jwt.two_factor_ttl') * 60,
            ]);
        }

        $this->refreshTokens->pruneExpired();

        return $this->respondWithTokens($user, $request);
    }

    // POST /auth/two-factor/challenge {two_factor_token, code} → 200 su žetonais
    public function twoFactorChallenge(Request $request, Google2FA $google2fa): JsonResponse
    {
        $data = $request->validate([
            'two_factor_token' => ['required', 'string'],
            'code' => ['required', 'digits:6'],
        ]);

        try {
            $claims = $this->jwt->decode($data['two_factor_token'], JwtService::TYPE_TWO_FACTOR);
        } catch (InvalidTokenException) {
            throw new AuthenticationException('Your login attempt expired. Please enter your password again.');
        }

        $user = User::find($claims->sub);

        if (! $user || ! $user->hasTwoFactorEnabled()
            || ! $google2fa->verifyKey($user->two_factor_secret, (string) $data['code'])) {
            throw ValidationException::withMessages(['code' => 'The authentication code is invalid.']);
        }

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

    // GET /auth/me → 200 – prisijungusio naudotojo duomenys
    public function me(Request $request): JsonResponse
    {
        return response()->json(['data' => new UserResource($request->user()->loadCount('reviews'))]);
    }

    // Bendras atsakymas su žetonais: naudojamas register, login, refresh ir 2FA
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
