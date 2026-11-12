<?php

namespace App\Http\Resources;

use App\Models\User;
use App\Support\Link;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Naudotojas JSON pavidalu. El. paštą mato tik pats naudotojas.
 *
 * @mixin User
 */
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $viewer = $request->user();
        $isMe = $viewer !== null && $viewer->id === $this->id;
        $self = "users/{$this->id}";

        return [
            'id' => $this->id,
            'name' => $this->name,
            'role' => $this->role,
            'email' => $this->when($isMe, $this->email),
            'reviews_count' => $this->whenCounted('reviews'),
            'joined_at' => $this->created_at?->toIso8601String(),
            '_links' => array_filter([
                'self' => Link::to($self),
                'reviews' => Link::to("{$self}/reviews"),
                'delete' => $viewer?->can('delete', $this->resource) ? Link::to($self, 'DELETE') : null,
            ]),
        ];
    }
}
