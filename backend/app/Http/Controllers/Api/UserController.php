<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class UserController extends Controller
{
    // GET /api/v1/users/{user} – naudotojo profilis (vardas, rolė, recenzijų skaičius) → 200
    public function show(User $user): JsonResponse
    {
        return response()->json(['data' => new UserResource($user->loadCount('reviews'))]);
    }

    // DELETE /api/v1/users/{user} – tik administratorius → 204 (kartu ištrinamos ir recenzijos)
    public function destroy(User $user): Response
    {
        $user->delete();

        return response()->noContent();
    }
}
