# AbsoluteCinema API (Laravel)

Pilna dokumentacija – pagrindiniame [README](../README.md).

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate:fresh --seed
php artisan serve          # http://localhost:8000/api/v1 · dokumentacija http://localhost:8000/docs
php artisan test           # PHPUnit testai
```
