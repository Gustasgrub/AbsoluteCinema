<?php

namespace App\Http\Resources;

use App\Models\Review;
use App\Support\Link;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Recenzija JSON pavidalu. Užklausose visada užkraunami ryšiai "user" ir "movie"
 * (->with(['user', 'movie'])), nes nuorodoms reikia filmo studijos ID.
 *
 * @mixin Review
 */
class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $movieUrl = "studios/{$this->movie->studio_id}/movies/{$this->movie_id}";
        $self = "{$movieUrl}/reviews/{$this->id}";

        return [
            'id' => $this->id,
            'movie_id' => $this->movie_id,
            'rating' => $this->rating,
            'title' => $this->title,
            'body' => $this->body,
            'contains_spoilers' => $this->contains_spoilers,
            'watched_on' => $this->watched_on?->format('Y-m-d'),
            'author' => $this->whenLoaded('user', fn () => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ]),
            'movie' => [
                'id' => $this->movie->id,
                'title' => $this->movie->title,
                'type' => $this->movie->type,
                'genre' => $this->movie->genre,
                'release_year' => $this->movie->release_date?->year,
                'poster_url' => $this->movie->poster_url,
                'studio_id' => $this->movie->studio_id,
                'studio' => $this->movie->relationLoaded('studio') ? [
                    'id' => $this->movie->studio->id,
                    'name' => $this->movie->studio->name,
                    'brand_color' => $this->movie->studio->brand_color,
                ] : null,
            ],
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            '_links' => array_filter([
                'self' => Link::to($self),
                'movie' => Link::to($movieUrl),
                'author' => Link::to("users/{$this->user_id}"),
                'update' => $user?->can('update', $this->resource) ? Link::to($self, 'PUT') : null,
                'delete' => $user?->can('delete', $this->resource) ? Link::to($self, 'DELETE') : null,
            ]),
        ];
    }
}
