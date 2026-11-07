<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewIndexRequest;
use App\Http\Resources\ReviewResource;
use App\Models\User;
use App\Support\Link;
use App\Support\Paginated;
use Illuminate\Http\JsonResponse;

class UserReviewController extends Controller
{
    // GET /api/v1/users/{user}/reviews – visos naudotojo recenzijos (profilio puslapiui) → 200
    public function index(ReviewIndexRequest $request, User $user): JsonResponse
    {
        $reviews = $user->reviews()
            ->with(['user', 'movie.studio'])
            ->filter($request->validated())
            ->sortBy($request->validated('sort', '-created'))
            ->paginate($request->perPage());

        return Paginated::response($reviews, ReviewResource::class, [
            'author' => Link::to("users/{$user->id}"),
        ]);
    }
}
