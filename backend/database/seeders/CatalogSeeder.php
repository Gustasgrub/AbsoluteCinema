<?php

namespace Database\Seeders;

use App\Models\Studio;
use Illuminate\Database\Seeder;

/**
 * Studijos ir jų filmai (duomenys – database/seeders/data/catalog.php).
 */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = require __DIR__.'/data/catalog.php';

        foreach ($catalog as $studioData) {
            $movies = $studioData['movies'];
            unset($studioData['movies']);

            $studio = Studio::create($studioData);

            foreach ($movies as [$title, $type, $genre, $releaseDate, $director, $runtime, $seasons, $ageRating, $tagline, $synopsis]) {
                $studio->movies()->create([
                    'title' => $title,
                    'type' => $type,
                    'genre' => $genre,
                    'release_date' => $releaseDate,
                    'director' => $director,
                    'runtime_minutes' => $runtime,
                    'seasons' => $seasons,
                    'age_rating' => $ageRating,
                    'tagline' => $tagline,
                    'synopsis' => $synopsis,
                ]);
            }
        }
    }
}
