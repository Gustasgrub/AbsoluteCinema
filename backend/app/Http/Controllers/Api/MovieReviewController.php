<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewIndexRequest;
use App\Http\Requests\ReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Movie;
use App\Models\Review;
use App\Models\Studio;
use App\Support\Link;
use App\Support\Paginated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Filmo recenzijos: /api/v1/studios/{studio}/movies/{movie}/reviews/{review}
 * Tai hierarchiniai metodai – URL apima visus 3 objektus (Studija → Filmas → Recenzija).
 */
class MovieReviewController extends Controller
{
    // GET .../reviews → 200
    public function index(ReviewIndexRequest $request, Studio $studio, Movie $movie): JsonResponse
    {
        $reviews = $movie->reviews()
            ->with(['user', 'movie'])
            ->filter($request->validated())
            ->sortBy($request->validated('sort', '-created'))
            ->paginate($request->perPage());

        return Paginated::response($reviews, ReviewResource::class, [
            'movie' => Link::to("studios/{$studio->id}/movies/{$movie->id}"),
        ]);
    }

    // GET .../reviews/{review} → 200 arba 404
    public function show(Studio $studio, Movie $movie, Review $review): JsonResponse
    {
        return response()->json(['data' => new ReviewResource($review->load(['user', 'movie']))]);
    }

    // POST .../reviews → 201, arba 409 jei naudotojas šiam filmui recenziją jau parašė
    public function store(ReviewRequest $request, Studio $studio, Movie $movie): JsonResponse
    {
        $user = $request->user();

        if ($movie->reviews()->where('user_id', $user->id)->exists()) {
            abort(409, 'You have already reviewed this title. Edit your existing review instead.');
        }

        $review = new Review($request->validated());
        $review->user_id = $user->id;   // autorius – žetono savininkas, o ne laukas iš užklausos
        $movie->reviews()->save($review);

        return response()
            ->json(['data' => new ReviewResource($review->load(['user', 'movie']))], 201)
            ->header('Location', Link::url("studios/{$studio->id}/movies/{$movie->id}/reviews/{$review->id}"));
    }

    // PUT/PATCH .../reviews/{review} → 200 (tik autorius, žr. ReviewPolicy)
    public function update(ReviewRequest $request, Studio $studio, Movie $movie, Review $review): JsonResponse
    {
        $review->update($request->validated());

        return response()->json(['data' => new ReviewResource($review->load(['user', 'movie']))]);
    }

    // DELETE .../reviews/{review} → 204 (autorius arba administratorius)
    public function destroy(Studio $studio, Movie $movie, Review $review): Response
    {
        $review->delete();

        return response()->noContent();
    }
}
