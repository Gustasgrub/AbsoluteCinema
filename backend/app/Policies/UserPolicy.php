<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Naudotojų šalinimas: gali tik administratorius, bet ne save patį.
 */
class UserPolicy
{
    public function delete(User $user, User $target): Response
    {
        if (! $user->isAdmin()) {
            return Response::deny('Only administrators can delete users.');
        }

        return $user->is($target)
            ? Response::deny('Administrators cannot delete their own account.')
            : Response::allow();
    }
}
