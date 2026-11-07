<?php

namespace App\Policies;

use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Naudotojų valdymas:
 *  - visų naudotojų sąrašą mato tik administratorius;
 *  - savo profilį gali redaguoti pats naudotojas (administratorius – bet kurį);
 *  - šalinti naudotojus gali tik administratorius, bet ne save patį.
 */
class UserPolicy
{
    public function viewAny(User $user): Response
    {
        return $user->isAdmin() ? Response::allow() : Response::deny('Only administrators can list users.');
    }

    public function update(User $user, User $target): Response
    {
        return $user->is($target) || $user->isAdmin()
            ? Response::allow()
            : Response::deny('You can only edit your own profile.');
    }

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
