<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            // Filmas (1) → Recenzijos (N). Ištrynus filmą, ištrinamos ir jo recenzijos.
            $table->foreignId('movie_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('rating');            // 1–10
            $table->string('title', 120);
            $table->text('body');
            $table->boolean('contains_spoilers')->default(false);
            $table->date('watched_on')->nullable();
            $table->timestamps();

            // Vienas naudotojas gali parašyti tik vieną recenziją tam pačiam filmui
            $table->unique(['movie_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
