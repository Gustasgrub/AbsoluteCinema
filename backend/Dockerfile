# AbsoluteCinema API – produkcinis konteineris.
# FrankenPHP = PHP + web serveris (Caddy) viename paleidžiamame faile.
FROM dunglas/frankenphp:1-php8.4

# PHP plėtiniai, kurių reikia Laravel + PostgreSQL
RUN install-php-extensions pdo_pgsql intl zip bcmath opcache

WORKDIR /app

# 1) Composer priklausomybės (atskiras sluoksnis – Docker jį kešuoja, kol nesikeičia composer.lock)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction

# 2) Programos kodas
COPY . .
RUN composer dump-autoload --optimize --no-dev \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R ug+rwX storage bootstrap/cache

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    SESSION_DRIVER=array \
    CACHE_STORE=database \
    QUEUE_CONNECTION=sync \
    PORT=8080

COPY docker/entrypoint.sh /usr/local/bin/entrypoint
RUN chmod +x /usr/local/bin/entrypoint

EXPOSE 8080
ENTRYPOINT ["entrypoint"]
