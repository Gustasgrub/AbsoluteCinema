<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

// GET .../reviews?min_rating=&max_rating=&spoilers=&search=&sort=
class ReviewIndexRequest extends QueryRequest
{
    protected function filterRules(): array
    {
        return [
            'min_rating' => ['sometimes', 'integer', 'between:1,10'],
            'max_rating' => ['sometimes', 'integer', 'between:1,10'],
            'spoilers' => ['sometimes', Rule::in(['true', 'false', '1', '0'])],
            'search' => ['sometimes', 'string', 'max:100'],
            'sort' => ['sometimes', Rule::in(['created', '-created', 'rating', '-rating'])],
        ];
    }
}
