<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

/**
 * Bazinė klasė sąrašų (GET) query parametrams: puslapiavimas, filtrai, rikiavimas.
 * Neteisingi query parametrai (pvz. ?page=abc) grąžina 400 Bad Request.
 */
abstract class QueryRequest extends FormRequest
{
    public const DEFAULT_PER_PAGE = 12;

    // Kiekviena vaikinė klasė aprašo savo filtrus
    abstract protected function filterRules(): array;

    public function rules(): array
    {
        return [
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
            ...$this->filterRules(),
        ];
    }

    public function perPage(): int
    {
        return (int) $this->validated('per_page', self::DEFAULT_PER_PAGE);
    }

    protected function failedValidation(Validator $validator): void
    {
        throw (new ValidationException($validator))->status(400);
    }
}
