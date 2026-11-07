<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * PATCH /users/{user}
 *  - naudotojas gali keisti savo vardą ir aprašymą;
 *  - rolę gali keisti TIK administratorius ir tik KITAM naudotojui (apsauga nuo teisių eskalacijos).
 */
class UserUpdateRequest extends FormRequest
{
    public function rules(): array
    {
        $canChangeRole = $this->user()->isAdmin() && ! $this->user()->is($this->route('user'));

        return [
            'name' => ['sometimes', 'string', 'min:2', 'max:50'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:500'],
            'role' => [Rule::prohibitedIf(! $canChangeRole), 'sometimes', Rule::in(User::ROLES)],
        ];
    }

    public function messages(): array
    {
        return ['role.prohibited' => 'Only an administrator can change the role of another user.'];
    }
}
