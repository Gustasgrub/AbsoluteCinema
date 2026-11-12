<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\MovieReviewController;
use App\Http\Controllers\Api\StudioController;
use App\Http\Controllers\Api\StudioMovieController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserReviewController;
use App\Models\Movie;
use App\Models\Review;
use App\Models\Studio;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| AbsoluteCinema API maršrutai. Visi turi priešdėlį /api/v1 (bootstrap/app.php).
|--------------------------------------------------------------------------
| Prieigos lygiai:
|   jwt:optional – gali kviesti visi (svečias taip pat); jei žetonas atsiųstas – naudotojas atpažįstamas
|   jwt          – tik prisijungusiems (kitaip 401)
|   ->can(...)   – papildomai tikrinama rolė / savininkas per Policy klases (kitaip 403)
|
| scopeBindings() – vaikinis resursas ieškomas TIK tėvinio viduje:
|   /studios/1/movies/5 → 404, jei filmas #5 nepriklauso studijai #1.
*/

// ID adrese – tik skaičius (iki 18 skaitmenų), kitaip 404.
// Be šito PostgreSQL per didelį skaičių (pvz. /studios/99999999999999999999) laikytų klaida ir grąžintų 500.
Route::patterns([
    'studio' => '[0-9]{1,18}',
    'movie' => '[0-9]{1,18}',
    'review' => '[0-9]{1,18}',
    'user' => '[0-9]{1,18}',
]);

Route::scopeBindings()->group(function () {

    // ---------- Autentifikacija ----------
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->middleware('throttle:auth');
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:auth');
        Route::post('refresh', [AuthController::class, 'refresh']);

        Route::post('logout', [AuthController::class, 'logout'])->middleware('jwt');
    });

    // ---------- Skaitymas: gali visi (svečias, narys, administratorius) ----------
    Route::middleware('jwt:optional')->group(function () {
        Route::get('dashboard', DashboardController::class);

        Route::get('studios', [StudioController::class, 'index']);
        Route::get('studios/{studio}', [StudioController::class, 'show']);

        Route::get('studios/{studio}/movies', [StudioMovieController::class, 'index']);
        Route::get('studios/{studio}/movies/{movie}', [StudioMovieController::class, 'show']);

        // Hierarchinis metodas per visus 3 objektus: Studija → Filmas → Recenzijos
        Route::get('studios/{studio}/movies/{movie}/reviews', [MovieReviewController::class, 'index']);
        Route::get('studios/{studio}/movies/{movie}/reviews/{review}', [MovieReviewController::class, 'show']);

        // Naudotojo profilis ir jo recenzijos
        Route::get('users/{user}', [UserController::class, 'show']);
        Route::get('users/{user}/reviews', [UserReviewController::class, 'index']);
    });

    // ---------- Keitimas: tik prisijungusiems, teisės tikrinamos Policy klasėse ----------
    Route::middleware('jwt')->group(function () {
        // Studijos – tik administratorius (StudioPolicy)
        Route::post('studios', [StudioController::class, 'store'])->can('create', Studio::class);
        Route::match(['put', 'patch'], 'studios/{studio}', [StudioController::class, 'update'])->can('update', 'studio');
        Route::delete('studios/{studio}', [StudioController::class, 'destroy'])->can('delete', 'studio');

        // Filmai – tik administratorius (MoviePolicy)
        Route::post('studios/{studio}/movies', [StudioMovieController::class, 'store'])->can('create', Movie::class);
        Route::match(['put', 'patch'], 'studios/{studio}/movies/{movie}', [StudioMovieController::class, 'update'])->can('update', 'movie');
        Route::delete('studios/{studio}/movies/{movie}', [StudioMovieController::class, 'destroy'])->can('delete', 'movie');

        // Recenzijos – rašo narys/administratorius, redaguoja autorius, trina autorius arba administratorius (ReviewPolicy)
        Route::post('studios/{studio}/movies/{movie}/reviews', [MovieReviewController::class, 'store'])->can('create', Review::class);
        Route::match(['put', 'patch'], 'studios/{studio}/movies/{movie}/reviews/{review}', [MovieReviewController::class, 'update'])->can('update', 'review');
        Route::delete('studios/{studio}/movies/{movie}/reviews/{review}', [MovieReviewController::class, 'destroy'])->can('delete', 'review');

        // Naudotojus šalina tik administratorius, bet ne save (UserPolicy)
        Route::delete('users/{user}', [UserController::class, 'destroy'])->can('delete', 'user');
    });
});
