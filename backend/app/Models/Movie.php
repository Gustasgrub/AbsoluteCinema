<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Filmas arba serialas. Priklauso studijai, turi daug recenzijų.
 */
class Movie extends Model
{
    public const TYPES = ['movie', 'series'];

    public const GENRES = [
        'action', 'adventure', 'animation', 'comedy', 'crime', 'documentary', 'drama', 'family',
        'fantasy', 'horror', 'musical', 'mystery', 'romance', 'sci-fi', 'thriller', 'war',
    ];

    public const AGE_RATINGS = ['ALL', '7+', '13+', '16+', '18+'];

    protected $fillable = [
        'studio_id', 'title', 'tagline', 'type', 'genre', 'synopsis', 'director',
        'release_date', 'runtime_minutes', 'seasons', 'age_rating', 'poster_url',
    ];

    protected function casts(): array
    {
        return [
            'release_date' => 'date',
            'runtime_minutes' => 'integer',
            'seasons' => 'integer',
        ];
    }

    public function studio(): BelongsTo
    {
        return $this->belongsTo(Studio::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // Prideda skaičiuojamus laukus: reviews_count ir reviews_avg_rating
    public function scopeWithStats(Builder $query): void
    {
        $query->withCount('reviews')->withAvg('reviews', 'rating');
    }

    public function loadStats(): static
    {
        return $this->loadCount('reviews')->loadAvg('reviews', 'rating');
    }

    // Filtravimas: GET /movies?genre=drama&type=movie&year_from=2000&year_to=2010&min_rating=8
    public function scopeFilter(Builder $query, array $filters): void
    {
        $query
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->where(
                fn ($q) => $q->where('title', 'like', "%{$search}%")->orWhere('director', 'like', "%{$search}%")
            ))
            ->when($filters['studio_id'] ?? null, fn ($q, $studioId) => $q->where('studio_id', $studioId))
            ->when($filters['genre'] ?? null, fn ($q, $genre) => $q->where('genre', $genre))
            ->when($filters['type'] ?? null, fn ($q, $type) => $q->where('type', $type))
            ->when($filters['year_from'] ?? null, fn ($q, $year) => $q->whereYear('release_date', '>=', $year))
            ->when($filters['year_to'] ?? null, fn ($q, $year) => $q->whereYear('release_date', '<=', $year))
            ->when($filters['min_rating'] ?? null, fn ($q, $rating) => $q->whereRaw(
                '(select avg(rating) from reviews where reviews.movie_id = movies.id) >= ?', [$rating]
            ));
    }

    // Rikiavimas: ?sort=-rating, ?sort=title, ?sort=-release_date ...
    public function scopeSortBy(Builder $query, string $sort): void
    {
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';

        $column = match (ltrim($sort, '-')) {
            'release_date' => 'release_date',
            'rating' => 'reviews_avg_rating',
            'reviews' => 'reviews_count',
            default => 'title',
        };

        $query->orderBy($column, $direction)->orderBy('id');
    }
}
