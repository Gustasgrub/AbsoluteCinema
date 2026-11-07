<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50);
            $table->string('email')->unique();
            $table->string('password');                        // bcrypt hash
            $table->string('role', 20)->default('member');     // member | admin (svečias – neprisijungęs)
            $table->text('bio')->nullable();
            $table->text('two_factor_secret')->nullable();      // užšifruotas 2FA (TOTP) raktas
            $table->timestamp('two_factor_enabled_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
