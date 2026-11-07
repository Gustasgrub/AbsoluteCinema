<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserIndexRequest;
use App\Http\Requests\UserUpdateRequest;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\UserResource;
use App\Models\Movie;
use App\Models\User;
use App\Support\Paginated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class UserController extends Controller
{
    // GET /api/v1/users – tik administratoriui → 200
    public function index(UserIndexRequest $request): JsonResponse
    {
        $users = User::query()
            ->withCount('reviews')
            ->when($request->validated('search'), fn ($q, $search) => $q->where(
                fn ($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%")
            ))
            ->when($request->validated('role'), fn ($q, $role) => $q->where('role', $role))
            ->orderBy('name')
            ->paginate($request->perPage());

        return Paginated::response($users, UserResource::class);
    }

    /**
     * GET /api/v1/users/{user} – naudotojo PROFILIS.
     * Resursas sukonstruojamas iš kelių esybių: User + Review + Movie + Studio.
     */
    public function show(Request $request, User $user): JsonResponse
    {
        $user->loadCount('reviews');

        // Kiek kartų naudotojas skyrė kiekvieną balą (1–10)
        $ratingCounts = $user->reviews()
            ->selectRaw('rating, count(*) as total')
            ->groupBy('rating')
            ->pluck('total', 'rating');

        // Žanras, kurio filmams naudotojas parašė daugiausiai recenzijų
        $favoriteGenre = Movie::query()
            ->join('reviews', 'reviews.movie_id', '=', 'movies.id')
            ->where('reviews.user_id', $user->id)
            ->groupBy('movies.genre')
            ->orderByRaw('count(*) desc')
            ->orderBy('movies.genre')
            ->value('movies.genre');

        $average = $user->reviews()->avg('rating');

        $recentReviews = $user->reviews()
            ->with(['user', 'movie.studio'])
            ->latest()
            ->limit(5)
            ->get();

        return response()->json(['data' => [
            ...(new UserResource($user))->resolve($request),
            'stats' => [
                'reviews_count' => $user->reviews_count,
                'average_rating' => $average !== null ? round((float) $average, 1) : null,
                'favorite_genre' => $favoriteGenre,
                'rating_distribution' => collect(range(1, 10))
                    ->mapWithKeys(fn ($rating) => [$rating => (int) ($ratingCounts[$rating] ?? 0)]),
            ],
            'recent_reviews' => ReviewResource::collection($recentReviews),
        ]]);
    }

    // PATCH /api/v1/users/{user} – savo profilio keitimas; administratorius gali keisti kitų rolę → 200
    public function update(UserUpdateRequest $request, User $user): JsonResponse
    {
        $data = $request->validated();

        $user->fill($data);

        if (isset($data['role'])) {
            $user->role = $data['role'];   // "role" nėra $fillable, todėl nustatoma atskirai
        }

        $user->save();

        return response()->json(['data' => new UserResource($user->loadCount('reviews'))]);
    }

    // DELETE /api/v1/users/{user} – tik administratorius → 204 (kartu ištrinamos ir recenzijos)
    public function destroy(User $user): Response
    {
        $user->delete();

        return response()->noContent();
    }
}
