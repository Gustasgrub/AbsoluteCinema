<?php

namespace App\Http\Resources;

use App\Models\Movie;
use App\Models\Studio;
use App\Support\Link;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Kaip studija atrodo JSON atsakyme.
 * "_links" (hypermedia) rodo ne tik kur yra susiję resursai, bet ir kokius veiksmus
 * DABARTINIS naudotojas gali atlikti – pvz. "update"/"delete" matys tik administratorius.
 *
 * @mixin Studio
 */
class StudioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $request->user();
        $self = "studios/{$this->id}";

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'country' => $this->country,
            'founded_year' => $this->founded_year,
            'headquarters' => $this->headquarters,
            'website' => $this->website,
            'brand_color' => $this->brand_color,
            'movies_count' => (int) $this->movies_count,
            'reviews_count' => (int) $this->reviews_count,
            'average_rating' => $this->reviews_avg_rating !== null ? round((float) $this->reviews_avg_rating, 1) : null,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
            '_links' => array_filter([
                'self' => Link::to($self),
                'movies' => Link::to("{$self}/movies"),
                'collection' => Link::to('studios'),
                'update' => $user?->can('update', $this->resource) ? Link::to($self, 'PUT') : null,
                'delete' => $user?->can('delete', $this->resource) ? Link::to($self, 'DELETE') : null,
                'create_movie' => $user?->can('create', Movie::class) ? Link::to("{$self}/movies", 'POST') : null,
            ]),
        ];
    }
}
