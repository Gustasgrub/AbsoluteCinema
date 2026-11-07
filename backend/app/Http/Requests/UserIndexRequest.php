<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Validation\Rule;

// GET /users?search=&role= (tik administratoriui)
class UserIndexRequest extends QueryRequest
{
    protected function filterRules(): array
    {
        return [
            'search' => ['sometimes', 'string', 'max:100'],
            'role' => ['sometimes', Rule::in(User::ROLES)],
        ];
    }
}
