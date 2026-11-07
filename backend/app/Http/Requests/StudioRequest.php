<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Studijos kūrimas (POST) ir redagavimas (PUT – visi laukai, PATCH – tik siunčiami laukai).
 * Neteisingi duomenys → 422 Unprocessable Content.
 */
class StudioRequest extends FormRequest
{
    public function rules(): array
    {
        // PATCH – dalinis atnaujinimas, todėl laukai neprivalomi
        $required = $this->isMethod('PATCH') ? 'sometimes' : 'required';
        $studio = $this->route('studio');

        return [
            'name' => [$required, 'string', 'min:2', 'max:100', Rule::unique('studios', 'name')->ignore($studio)],
            'description' => [$required, 'string', 'min:10', 'max:2000'],
            'country' => [$required, 'string', 'min:2', 'max:60'],
            'founded_year' => [$required, 'integer', 'between:1850,'.date('Y')],
            'headquarters' => ['sometimes', 'nullable', 'string', 'max:100'],
            'website' => ['sometimes', 'nullable', 'url:http,https', 'max:255'],
            'brand_color' => ['sometimes', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
        ];
    }

    public function messages(): array
    {
        return ['brand_color.regex' => 'The brand color must be a HEX color like #1E6F6A.'];
    }
}
