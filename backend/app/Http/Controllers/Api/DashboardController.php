<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MovieResource;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\StudioResource;
use App\Models\Movie;
use App\Models\Review;
use App\Models\Studio;
use App\Models\User;
use App\Support\Link;
use Illuminate\Http\JsonResponse;

/**
 * GET /api/v1/dashboard – pagrindinio puslapio "panelė".
 * Vienas resursas, sukonstruotas iš kelių esybių: Studio + Movie + Review + User.
 */
class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $topRated = Movie::query()
            ->with('studio')
            ->withStats()
            ->has('reviews', '>=', 2)           // bent 2 recenzijos, kad reitingas būtų patikimas
            ->orderByDesc('reviews_avg_rating')
            ->orderByDesc('reviews_count')
            ->limit(8)
            ->get();

        $latestReviews = Review::query()
            ->with(['user', 'movie.studio'])
            ->latest()
            ->orderByDesc('id')
            ->limit(6)
            ->get();

        $studios = Studio::query()->withStats()->orderBy('name')->get();

        $genres = Movie::query()
            ->select('genre')
            ->selectRaw('count(*) as titles')
            ->groupBy('genre')
            ->orderByDesc('titles')
            ->orderBy('genre')
            ->get();

        return response()->json(['data' => [
            'totals' => [
                'studios' => Studio::count(),
                'movies' => Movie::where('type', 'movie')->count(),
                'series' => Movie::where('type', 'series')->count(),
                'reviews' => Review::count(),
                'members' => User::count(),
            ],
            'top_rated' => MovieResource::collection($topRated),
            'latest_reviews' => ReviewResource::collection($latestReviews),
            'studios' => StudioResource::collection($studios),
            'genres' => $genres,
            '_links' => [
                'self' => Link::to('dashboard'),
                'studios' => Link::to('studios'),
            ],
        ]]);
    }
}
