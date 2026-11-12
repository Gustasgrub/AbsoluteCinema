<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Sistemos naudotojas.
 *
 * Rolės: svečias (neprisijungęs, DB neturi įrašo), narys (member), administratorius (admin).
 */
class User extends Authenticatable
{
    use HasFactory;

    public const ROLE_MEMBER = 'member';

    public const ROLE_ADMIN = 'admin';

    public const ROLES = [self::ROLE_MEMBER, self::ROLE_ADMIN];

    // "role" sąmoningai NĖRA $fillable – registruojantis negalima pasiskirti administratoriaus rolės
    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password'];

    protected $attributes = ['role' => self::ROLE_MEMBER];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',                 // slaptažodis automatiškai užkoduojamas bcrypt
        ];
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function refreshTokens(): HasMany
    {
        return $this->hasMany(RefreshToken::class);
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }
}
