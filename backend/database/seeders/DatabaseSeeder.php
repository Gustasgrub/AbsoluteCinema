<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * php artisan migrate:fresh --seed
 * Užpildo DB prasmingais duomenimis: 10 naudotojų, 7 studijos, 40 filmų/serialų, 120 recenzijų.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Saugiklis serveriui: jei duomenys jau yra (pvz. po pakartotinio diegimo), nieko nekartojame
        if (User::exists()) {
            $this->command?->info('Database already has data – seeding skipped.');

            return;
        }

        $this->call([
            UserSeeder::class,
            CatalogSeeder::class,
            ReviewSeeder::class,
        ]);
    }
}
