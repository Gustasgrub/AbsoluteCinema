<?php

namespace App\Http\Requests;

use App\Models\Movie;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Filmo kūrimas ir redagavimas. Neteisingi duomenys → 422.
 */
class MovieRequest extends FormRequest
{
    public function rules(): array
    {
        $required = $this->isMethod('PATCH') ? 'sometimes' : 'required';

        return [
            'title' => [$required, 'string', 'min:1', 'max:150'],
            'tagline' => ['sometimes', 'nullable', 'string', 'max:200'],
            'type' => [$required, Rule::in(Movie::TYPES)],
            'genre' => [$required, Rule::in(Movie::GENRES)],
            'synopsis' => [$required, 'string', 'min:10', 'max:3000'],
            'director' => [$required, 'string', 'min:2', 'max:120'],
            'release_date' => [$required, 'date_format:Y-m-d', 'after:1880-01-01', 'before:2100-01-01'],
            'runtime_minutes' => [$required, 'integer', 'between:1,999'],
            // Sezonų skaičius privalomas serialams ir draudžiamas filmams
            'seasons' => ['nullable', 'integer', 'between:1,99', 'required_if:type,series', 'prohibited_if:type,movie'],
            'age_rating' => [$required, Rule::in(Movie::AGE_RATINGS)],
            'poster_url' => ['sometimes', 'nullable', 'url:http,https', 'max:255'],
            // Redaguojant filmą galima perkelti į kitą studiją (kuriant – studija imama iš URL)
            'studio_id' => ['sometimes', 'integer', 'exists:studios,id'],
        ];
    }
}
