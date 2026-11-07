<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Recenzijos (duomenys – database/seeders/data/reviews.php).
 * Datos išdėstomos per pastaruosius ~8 mėnesius, kad sąrašai atrodytų gyvi.
 */
class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $reviews = require __DIR__.'/data/reviews.php';

        $movies = Movie::pluck('id', 'title');                 // ['Spirited Away' => 1, ...]
        $users = User::pluck('id', 'email');                   // ['rasa@absolutecinema.test' => 3, ...]
        $start = now()->subDays(count($reviews) * 2);

        foreach ($reviews as $i => [$movieTitle, $userKey, $rating, $title, $body, $spoilers]) {
            // (i * 37) % n sumaišo datas, kad naujausios recenzijos būtų apie skirtingus filmus
            $dayOffset = ($i * 37) % count($reviews) * 2;
            $createdAt = $start->copy()->addDays($dayOffset)->setTime(17 + $i % 6, ($i * 7) % 60);

            $review = new Review([
                'rating' => $rating,
                'title' => $title,
                'body' => $body,
                'contains_spoilers' => $spoilers,
                'watched_on' => $createdAt->copy()->subDays($i % 4)->toDateString(),
            ]);
            $review->movie_id = $movies[$movieTitle];
            $review->user_id = $users["{$userKey}@absolutecinema.test"];
            $review->created_at = $createdAt;
            $review->updated_at = $createdAt;
            $review->save();
        }
    }
}
