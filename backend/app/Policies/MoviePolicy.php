<?php

namespace App\Policies;

use App\Models\Movie;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Filmus kurti, redaguoti ir trinti gali tik administratorius.
 */
class MoviePolicy
{
    public function create(User $user): Response
    {
        return $user->isAdmin() ? Response::allow() : Response::deny('Only administrators can add movies.');
    }

    public function update(User $user, Movie $movie): Response
    {
        return $user->isAdmin() ? Response::allow() : Response::deny('Only administrators can edit movies.');
    }

    public function delete(User $user, Movie $movie): Response
    {
        return $user->isAdmin() ? Response::allow() : Response::deny('Only administrators can delete movies.');
    }
}
