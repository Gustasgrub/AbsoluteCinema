<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

// GET /studios?search=&country=&founded_from=&founded_to=&sort=&page=&per_page=
class StudioIndexRequest extends QueryRequest
{
    protected function filterRules(): array
    {
        return [
            'search' => ['sometimes', 'string', 'max:100'],
            'country' => ['sometimes', 'string', 'max:60'],
            'founded_from' => ['sometimes', 'integer', 'between:1850,2100'],
            'founded_to' => ['sometimes', 'integer', 'between:1850,2100'],
            'sort' => ['sometimes', Rule::in(['name', '-name', 'founded_year', '-founded_year', 'movies', '-movies', 'rating', '-rating'])],
        ];
    }
}
