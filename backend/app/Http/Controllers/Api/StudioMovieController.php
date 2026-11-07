<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MovieIndexRequest;
use App\Http\Requests\MovieRequest;
use App\Http\Resources\MovieResource;
use App\Models\Movie;
use App\Models\Studio;
use App\Support\Link;
use App\Support\Paginated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Studijos filmai: /api/v1/studios/{studio}/movies/{movie}
 *
 * Apimties valdymas (scoping) per URL: jei filmas nepriklauso nurodytai studijai,
 * Laravel grąžina 404 (žr. scopeBindings() routes/api.php).
 */
class StudioMovieController extends Controller
{
    // GET /studios/{studio}/movies → 200
    public function index(MovieIndexRequest $request, Studio $studio): JsonResponse
    {
        $movies = $studio->movies()
            ->with('studio')
            ->withStats()
            ->filter($request->safe()->except('studio_id'))
            ->sortBy($request->validated('sort', 'title'))
            ->paginate($request->perPage());

        $canCreate = $request->user()?->can('create', Movie::class);

        return Paginated::response($movies, MovieResource::class, array_filter([
            'studio' => Link::to("studios/{$studio->id}"),
            'create' => $canCreate ? Link::to("studios/{$studio->id}/movies", 'POST') : null,
        ]));
    }

    // GET /studios/{studio}/movies/{movie} → 200 arba 404
    public function show(Request $request, Studio $studio, Movie $movie): JsonResponse
    {
        $movie->load('studio')->loadStats();

        // Prisijungusiam naudotojui pasakome, ar jis jau parašė recenziją šiam filmui
        if ($request->user()) {
            $movie->my_review_id = $movie->reviews()->where('user_id', $request->user()->id)->value('id');
        }

        return response()->json(['data' => new MovieResource($movie)]);
    }

    // POST /studios/{studio}/movies → 201 (filmas priskiriamas URL nurodytai studijai)
    public function store(MovieRequest $request, Studio $studio): JsonResponse
    {
        $movie = $studio->movies()->create($request->safe()->except('studio_id'));
        $movie->load('studio')->loadStats();

        return response()
            ->json(['data' => new MovieResource($movie)], 201)
            ->header('Location', Link::url("studios/{$studio->id}/movies/{$movie->id}"));
    }

    // PUT/PATCH /studios/{studio}/movies/{movie} → 200
    public function update(MovieRequest $request, Studio $studio, Movie $movie): JsonResponse
    {
        $movie->fill($request->validated());

        if ($movie->type === 'movie') {
            $movie->seasons = null;   // filmai sezonų neturi
        }

        $movie->save();
        $movie->load('studio')->loadStats();

        return response()->json(['data' => new MovieResource($movie)]);
    }

    // DELETE /studios/{studio}/movies/{movie} → 204 (kartu ištrinamos filmo recenzijos)
    public function destroy(Studio $studio, Movie $movie): Response
    {
        $movie->delete();

        return response()->noContent();
    }
}
