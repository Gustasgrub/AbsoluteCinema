<?php

namespace App\Http\Requests;

use App\Models\Movie;
use Illuminate\Validation\Rule;

// GET /movies ir GET /studios/{id}/movies su filtrais
class MovieIndexRequest extends QueryRequest
{
    protected function filterRules(): array
    {
        return [
            'search' => ['sometimes', 'string', 'max:100'],
            'studio_id' => ['sometimes', 'integer', 'min:1'],
            'genre' => ['sometimes', Rule::in(Movie::GENRES)],
            'type' => ['sometimes', Rule::in(Movie::TYPES)],
            'year_from' => ['sometimes', 'integer', 'between:1880,2100'],
            'year_to' => ['sometimes', 'integer', 'between:1880,2100'],
            'min_rating' => ['sometimes', 'numeric', 'between:1,10'],
            'sort' => ['sometimes', Rule::in([
                'title', '-title', 'release_date', '-release_date', 'rating', '-rating', 'reviews', '-reviews',
            ])],
        ];
    }
}
