<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

/**
 * Studija – hierarchijos viršus: Studija → Filmas → Recenzija.
 */
class Studio extends Model
{
    protected $fillable = [
        'name', 'description', 'country', 'founded_year', 'headquarters', 'website', 'brand_color',
    ];

    protected function casts(): array
    {
        return ['founded_year' => 'integer'];
    }

    public function movies(): HasMany
    {
        return $this->hasMany(Movie::class);
    }

    // Visos studijos filmų recenzijos (per filmus) – reikalingos vidutiniam įvertinimui
    public function reviews(): HasManyThrough
    {
        return $this->hasManyThrough(Review::class, Movie::class);
    }

    // Prideda skaičiuojamus laukus: movies_count, reviews_count, reviews_avg_rating
    public function scopeWithStats(Builder $query): void
    {
        $query->withCount(['movies', 'reviews'])->withAvg('reviews', 'rating');
    }

    public function loadStats(): static
    {
        return $this->loadCount(['movies', 'reviews'])->loadAvg('reviews', 'rating');
    }

    // Filtravimas: GET /studios?search=ghibli&country=Japan&founded_from=1980&founded_to=2000
    public function scopeFilter(Builder $query, array $filters): void
    {
        $query
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->whereLike('name', "%{$search}%"))
            ->when($filters['country'] ?? null, fn ($q, $country) => $q->where('country', $country))
            ->when($filters['founded_from'] ?? null, fn ($q, $year) => $q->where('founded_year', '>=', $year))
            ->when($filters['founded_to'] ?? null, fn ($q, $year) => $q->where('founded_year', '<=', $year));
    }

    // Rikiavimas: ?sort=name (didėjančiai) arba ?sort=-name (mažėjančiai)
    public function scopeSortBy(Builder $query, string $sort): void
    {
        $direction = str_starts_with($sort, '-') ? 'desc' : 'asc';

        $column = match (ltrim($sort, '-')) {
            'founded_year' => 'founded_year',
            'movies' => 'movies_count',
            'rating' => 'reviews_avg_rating',
            default => 'name',
        };

        // "nulls last" – studijos be įvertinimų visada sąrašo gale (PostgreSQL be šito jas dėtų į priekį)
        $query->orderByRaw("{$column} {$direction} nulls last")->orderBy('id');
    }
}
