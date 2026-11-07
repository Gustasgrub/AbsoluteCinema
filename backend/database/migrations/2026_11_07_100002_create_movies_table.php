<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            // Studija (1) → Filmai (N). Ištrynus studiją, ištrinami ir jos filmai.
            $table->foreignId('studio_id')->constrained()->cascadeOnDelete();
            $table->string('title', 150);
            $table->string('tagline', 200)->nullable();
            $table->string('type', 10);                       // movie | series
            $table->string('genre', 20);
            $table->text('synopsis');
            $table->string('director', 120);                  // serialams – kūrėjas (creator)
            $table->date('release_date');
            $table->unsignedSmallInteger('runtime_minutes');  // serialams – vidutinė serijos trukmė
            $table->unsignedTinyInteger('seasons')->nullable();
            $table->string('age_rating', 4);                  // ALL, 7+, 13+, 16+, 18+
            $table->string('poster_url')->nullable();
            $table->timestamps();

            $table->index(['genre', 'release_date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movies');
    }
};
