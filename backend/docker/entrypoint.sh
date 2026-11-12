#!/bin/sh
# Paleidžiama kiekvieną kartą startuojant konteineriui
set -e

# Konfigūracijos, maršrutų ir šablonų kešas – greitesniam veikimui
php artisan config:cache
php artisan route:cache
php artisan view:cache

# DB lentelės ir pradiniai duomenys (seeder'is nieko nedaro, jei duomenys jau yra)
php artisan migrate --force
php artisan db:seed --force

# Web serveris klauso PORT (Render jį nustato pats)
exec frankenphp php-server --listen ":${PORT:-8080}" --root /app/public
