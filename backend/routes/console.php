<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

// php artisan jwt:secret – sugeneruoja atsitiktinį JWT_SECRET ir įrašo jį į .env failą
Artisan::command('jwt:secret {--show : Tik parodyti raktą, neįrašant į .env}', function () {
    $secret = Str::random(64);

    if ($this->option('show')) {
        $this->line($secret);

        return;
    }

    $envPath = base_path('.env');
    $env = file_exists($envPath) ? file_get_contents($envPath) : '';

    $env = preg_match('/^JWT_SECRET=.*$/m', $env)
        ? preg_replace('/^JWT_SECRET=.*$/m', 'JWT_SECRET='.$secret, $env)
        : rtrim($env).PHP_EOL.'JWT_SECRET='.$secret.PHP_EOL;

    file_put_contents($envPath, $env);
    $this->info('JWT_SECRET was written to .env');
})->purpose('Generate the secret key used to sign JWT tokens');
