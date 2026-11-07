<?php

namespace App\Policies;

use App\Models\Studio;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Kas gali keisti studijas? Tik administratorius.
 * (Peržiūrėti gali visi, net svečiai – tie maršrutai policy nenaudoja.)
 * Policy metodai iškviečiami iš routes/api.php: ->can('create', Studio::class)
 */
class StudioPolicy
{
    public function create(User $user): Response
    {
        return $user->isAdmin() ? Response::allow() : Response::deny('Only administrators can create studios.');
    }

    public function update(User $user, Studio $studio): Response
    {
        return $user->isAdmin() ? Response::allow() : Response::deny('Only administrators can edit studios.');
    }

    public function delete(User $user, Studio $studio): Response
    {
        return $user->isAdmin() ? Response::allow() : Response::deny('Only administrators can delete studios.');
    }
}
