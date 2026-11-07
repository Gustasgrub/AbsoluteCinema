<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Vienodas puslapiuoto sąrašo atsakymas:
 *   { "data": [...], "meta": { "current_page": 1, "per_page": 12, "total": 40, "last_page": 4 },
 *     "_links": { "self", "first", "prev", "next", "last", ... } }
 */
class Paginated
{
    /**
     * @param  class-string  $resourceClass  pvz. StudioResource::class
     * @param  array  $extraLinks  papildomos nuorodos, pvz. "create" administratoriui
     */
    public static function response(LengthAwarePaginator $page, string $resourceClass, array $extraLinks = []): JsonResponse
    {
        $page->withQueryString();   // filtrai (?genre=drama) išlieka ir kitų puslapių nuorodose

        return response()->json([
            'data' => $resourceClass::collection($page->getCollection()),
            'meta' => [
                'current_page' => $page->currentPage(),
                'per_page' => $page->perPage(),
                'total' => $page->total(),
                'last_page' => $page->lastPage(),
            ],
            '_links' => array_filter([
                'self' => ['href' => $page->url($page->currentPage())],
                'first' => ['href' => $page->url(1)],
                'prev' => $page->previousPageUrl() ? ['href' => $page->previousPageUrl()] : null,
                'next' => $page->nextPageUrl() ? ['href' => $page->nextPageUrl()] : null,
                'last' => ['href' => $page->url($page->lastPage())],
                ...$extraLinks,
            ]),
        ]);
    }
}
