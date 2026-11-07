<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Recenzijos – autorizacija pagal rolę IR pagal naudotojo ID:
 *  - rašyti gali bet kuris prisijungęs naudotojas (narys ar administratorius);
 *  - redaguoti gali TIK autorius (net administratorius negali keisti svetimo teksto);
 *  - ištrinti gali autorius arba administratorius (moderavimas).
 */
class ReviewPolicy
{
    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Review $review): Response
    {
        return $user->id === $review->user_id
            ? Response::allow()
            : Response::deny('You can only edit your own reviews.');
    }

    public function delete(User $user, Review $review): Response
    {
        return $user->id === $review->user_id || $user->isAdmin()
            ? Response::allow()
            : Response::deny('You can only delete your own reviews.');
    }
}
