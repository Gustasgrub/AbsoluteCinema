<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('studios', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique();
            $table->text('description');
            $table->string('country', 60);
            $table->unsignedSmallInteger('founded_year');
            $table->string('headquarters', 100)->nullable();
            $table->string('website')->nullable();
            $table->char('brand_color', 7)->default('#D93A2B');   // HEX spalva, pvz. #1E6F6A
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('studios');
    }
};
