<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Recenzija – hierarchijos apačia. Priklauso filmui ir ją parašiusiam naudotojui.
 */
class Review extends Model
{
    // movie_id ir user_id nustatomi kontroleryje, ne iš užklausos – kad niekas negalėtų jų suklastoti
    protected $fillable = ['rating', 'title', 'body', 'contains_spoilers', 'watched_on'];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'contains_spoilers' => 'boolean',
            'watched_on' => 'date',
        ];
    }

    public function movie(): BelongsTo
    {
        return $this->belongsTo(Movie::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Filtravimas: GET .../reviews?min_rating=7&max_rating=10&spoilers=false&search=ending
    public function scopeFilter(Builder $query, array $filters): void
    {
        $query
            ->when($filters['min_rating'] ?? null, fn ($q, $rating) => $q->where('rating', '>=', $rating))
            ->when($filters['max_rating'] ?? null, fn ($q, $rating) => $q->where('rating', '<=', $rating))
            ->when(isset($filters['spoilers']), fn ($q) => $q->where(
                'contains_spoilers', filter_var($filters['spoilers'], FILTER_VALIDATE_BOOLEAN)   // "true"/"1" → true
            ))
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->where(
                fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('body', 'like', "%{$search}%")
            ));
    }

    // Rikiavimas: ?sort=-created (naujausios), ?sort=-rating (geriausios), ?sort=rating
    public function scopeSortBy(Builder $query, string $sort): void
    {
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';
        $column = ltrim($sort, '-') === 'rating' ? 'rating' : 'created_at';

        $query->orderBy($column, $direction)->orderBy('id', $direction);
    }
}
