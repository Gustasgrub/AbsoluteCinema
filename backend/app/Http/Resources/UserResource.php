<?php

namespace App\Http\Resources;

use App\Models\User;
use App\Support\Link;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Naudotojas JSON pavidalu. El. paštą ir 2FA būseną mato tik pats naudotojas arba administratorius.
 *
 * @mixin User
 */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $viewer = $request->user();
        $canSeePrivate = $viewer !== null && ($viewer->id === $this->id || $viewer->isAdmin());
        $self = "users/{$this->id}";

        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role,
            'bio' => $this->bio,
            'email' => $this->when($canSeePrivate, $this->email),
            'two_factor_enabled' => $this->when($canSeePrivate, fn () => $this->hasTwoFactorEnabled()),
            'reviews_count' => $this->whenCounted('reviews'),
            'joined_at' => $this->created_at?->toIso8601String(),
            '_links' => array_filter([
                'self' => Link::to($self),
                'reviews' => Link::to("{$self}/reviews"),
                'update' => $viewer?->can('update', $this->resource) ? Link::to($self, 'PATCH') : null,
                'delete' => $viewer?->can('delete', $this->resource) ? Link::to($self, 'DELETE') : null,
            ]),
        ];
    }
}
