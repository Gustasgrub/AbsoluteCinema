<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Išduotas refresh žetonas (DB saugomas tik jo SHA-256 hash'as).
 */
class RefreshToken extends Model
{
    protected $fillable = ['token_hash', 'expires_at', 'revoked_at', 'user_agent', 'ip_address'];

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'revoked_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
