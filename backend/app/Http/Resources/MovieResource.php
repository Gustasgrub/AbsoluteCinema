<?php

namespace App\Http\Resources;

use App\Models\Movie;
use App\Models\Review;
use App\Support\Link;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Movie
 */
class MovieResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $self = "studios/{$this->studio_id}/movies/{$this->id}";

        // my_review_id nustatomas tik vieno filmo užklausoje (žr. StudioMovieController::show)
        $knowsMyReview = array_key_exists('my_review_id', $this->resource->getAttributes());
        $canWriteReview = $knowsMyReview && $this->my_review_id === null && $user?->can('create', Review::class);

        return [
            'id' => $this->id,
            'studio_id' => $this->studio_id,
            'title' => $this->title,
            'tagline' => $this->tagline,
            'type' => $this->type,
            'genre' => $this->genre,
            'synopsis' => $this->synopsis,
            'director' => $this->director,
            'release_date' => $this->release_date?->format('Y-m-d'),
            'release_year' => $this->release_date?->year,
            'runtime_minutes' => $this->runtime_minutes,
            'seasons' => $this->seasons,
            'age_rating' => $this->age_rating,
            'poster_url' => $this->poster_url,
            'average_rating' => $this->reviews_avg_rating !== null ? round((float) $this->reviews_avg_rating, 1) : null,
            'reviews_count' => (int) $this->reviews_count,
            'studio' => $this->whenLoaded('studio', fn () => [
                'id' => $this->studio->id,
                'name' => $this->studio->name,
                'brand_color' => $this->studio->brand_color,
            ]),
            'my_review_id' => $this->when($knowsMyReview, fn () => $this->my_review_id),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            '_links' => array_filter([
                'self' => Link::to($self),
                'studio' => Link::to("studios/{$this->studio_id}"),
                'reviews' => Link::to("{$self}/reviews"),
                'update' => $user?->can('update', $this->resource) ? Link::to($self, 'PUT') : null,
                'delete' => $user?->can('delete', $this->resource) ? Link::to($self, 'DELETE') : null,
                'create_review' => $canWriteReview ? Link::to("{$self}/reviews", 'POST') : null,
                'my_review' => $knowsMyReview && $this->my_review_id
                    ? Link::to("{$self}/reviews/{$this->my_review_id}") : null,
            ]),
        ];
    }
}
