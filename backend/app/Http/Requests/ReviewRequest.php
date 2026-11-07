<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Recenzijos kūrimas ir redagavimas. Neteisingi duomenys → 422.
 */
class ReviewRequest extends FormRequest
{
    public function rules(): array
    {
        $required = $this->isMethod('PATCH') ? 'sometimes' : 'required';

        return [
            'rating' => [$required, 'integer', 'between:1,10'],
            'title' => [$required, 'string', 'min:2', 'max:120'],
            'body' => [$required, 'string', 'min:10', 'max:5000'],
            'contains_spoilers' => ['sometimes', 'boolean'],
            'watched_on' => ['sometimes', 'nullable', 'date_format:Y-m-d', 'before_or_equal:today'],
        ];
    }
}
