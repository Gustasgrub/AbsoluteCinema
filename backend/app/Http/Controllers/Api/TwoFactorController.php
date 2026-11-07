<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use PragmaRX\Google2FA\Google2FA;

/**
 * Dviejų faktorių autentifikacija (TOTP – kaip Google Authenticator / Microsoft Authenticator).
 *  1. POST /auth/two-factor          → slaptas raktas + otpauth:// nuoroda (frontend iš jos piešia QR kodą)
 *  2. POST /auth/two-factor/confirm  → naudotojas įveda kodą iš programėlės, 2FA įjungiama
 *  3. Prisijungiant reikės ne tik slaptažodžio, bet ir 6 skaitmenų kodo
 */
class TwoFactorController extends Controller
{
    public function __construct(private Google2FA $google2fa) {}

    // POST /auth/two-factor → 200, arba 409 jei jau įjungta
    public function enable(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasTwoFactorEnabled()) {
            abort(409, 'Two-factor authentication is already enabled.');
        }

        $secret = $this->google2fa->generateSecretKey();
        $user->forceFill(['two_factor_secret' => $secret])->save();

        return response()->json(['data' => [
            'secret' => $secret,
            'otpauth_url' => $this->google2fa->getQRCodeUrl('AbsoluteCinema', $user->email, $secret),
        ]]);
    }

    // POST /auth/two-factor/confirm {code} → 200, 422 jei kodas blogas
    public function confirm(Request $request): JsonResponse
    {
        $data = $request->validate(['code' => ['required', 'digits:6']]);
        $user = $request->user();

        if ($user->hasTwoFactorEnabled()) {
            abort(409, 'Two-factor authentication is already enabled.');
        }

        if (! $user->two_factor_secret) {
            abort(409, 'Start the setup first (POST /auth/two-factor).');
        }

        $this->verifyCode($user->two_factor_secret, $data['code']);

        $user->forceFill(['two_factor_enabled_at' => now()])->save();

        return response()->json(['data' => new UserResource($user)]);
    }

    // DELETE /auth/two-factor {code} → 204
    public function disable(Request $request): Response
    {
        $data = $request->validate(['code' => ['required', 'digits:6']]);
        $user = $request->user();

        if (! $user->hasTwoFactorEnabled()) {
            abort(409, 'Two-factor authentication is not enabled.');
        }

        $this->verifyCode($user->two_factor_secret, $data['code']);

        $user->forceFill(['two_factor_secret' => null, 'two_factor_enabled_at' => null])->save();

        return response()->noContent();
    }

    private function verifyCode(string $secret, string|int $code): void
    {
        if (! $this->google2fa->verifyKey($secret, (string) $code)) {
            throw ValidationException::withMessages(['code' => 'The authentication code is invalid.']);
        }
    }
}
