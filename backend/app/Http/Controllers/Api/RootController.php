<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\Link;
use Illuminate\Http\JsonResponse;

/**
 * GET /api/v1 – API įėjimo taškas. Klientas gali pradėti nuo čia ir sekti nuorodas (HATEOAS).
 */
class RootController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'name' => 'AbsoluteCinema API',
            'version' => 'v1',
            'documentation' => url('docs'),
            '_links' => [
                'self' => Link::to(''),
                'dashboard' => Link::to('dashboard'),
                'studios' => Link::to('studios'),
                'movies' => Link::to('movies'),
                'register' => Link::to('auth/register', 'POST'),
                'login' => Link::to('auth/login', 'POST'),
                'refresh' => Link::to('auth/refresh', 'POST'),
                'logout' => Link::to('auth/logout', 'POST'),
                'me' => Link::to('auth/me'),
            ],
        ]);
    }
}
