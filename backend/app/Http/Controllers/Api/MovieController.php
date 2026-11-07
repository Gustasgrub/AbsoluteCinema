<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\MovieIndexRequest;
use App\Http\Resources\MovieResource;
use App\Models\Movie;
use App\Support\Paginated;
use Illuminate\Http\JsonResponse;

/**
 * Bendras filmų katalogas per visas studijas (paieška ir filtrai).
 * Konkretaus filmo adresas visada hierarchinis: /studios/{studio}/movies/{movie}.
 */
class MovieController extends Controller
{
    // GET /api/v1/movies?search=&studio_id=&genre=&type=&year_from=&year_to=&min_rating=&sort= → 200
    public function index(MovieIndexRequest $request): JsonResponse
    {
        $movies = Movie::query()
            ->with('studio')
            ->withStats()
            ->filter($request->validated())
            ->sortBy($request->validated('sort', 'title'))
            ->paginate($request->perPage());

        return Paginated::response($movies, MovieResource::class);
    }
}
