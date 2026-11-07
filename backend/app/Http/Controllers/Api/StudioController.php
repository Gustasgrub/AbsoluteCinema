<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StudioIndexRequest;
use App\Http\Requests\StudioRequest;
use App\Http\Resources\StudioResource;
use App\Models\Studio;
use App\Support\Link;
use App\Support\Paginated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Studijų CRUD + sąrašas.
 * Kas gali kviesti kurį metodą – aprašyta routes/api.php ir App\Policies\StudioPolicy.
 */
class StudioController extends Controller
{
    // GET /api/v1/studios – sąrašas su filtravimu, rikiavimu ir puslapiavimu → 200
    public function index(StudioIndexRequest $request): JsonResponse
    {
        $studios = Studio::query()
            ->withStats()
            ->filter($request->validated())
            ->sortBy($request->validated('sort', 'name'))
            ->paginate($request->perPage());

        $canCreate = $request->user()?->can('create', Studio::class);

        return Paginated::response($studios, StudioResource::class, array_filter([
            'create' => $canCreate ? Link::to('studios', 'POST') : null,
        ]));
    }

    // GET /api/v1/studios/{studio} → 200 arba 404
    public function show(Studio $studio): JsonResponse
    {
        return response()->json(['data' => new StudioResource($studio->loadStats())]);
    }

    // POST /api/v1/studios → 201 Created + Location antraštė
    public function store(StudioRequest $request): JsonResponse
    {
        $studio = Studio::create($request->validated());

        return response()
            ->json(['data' => new StudioResource($studio->loadStats())], 201)
            ->header('Location', Link::url("studios/{$studio->id}"));
    }

    // PUT/PATCH /api/v1/studios/{studio} → 200
    public function update(StudioRequest $request, Studio $studio): JsonResponse
    {
        $studio->update($request->validated());

        return response()->json(['data' => new StudioResource($studio->loadStats())]);
    }

    // DELETE /api/v1/studios/{studio} → 204 No Content (kartu ištrinami studijos filmai ir jų recenzijos)
    public function destroy(Studio $studio): Response
    {
        $studio->delete();

        return response()->noContent();
    }
}
