#!/usr/bin/env sh
set -eu

PORT="${PORT:-10000}"
sed -i "s/^Listen .*/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:[0-9]*>/<VirtualHost *:${PORT}>/" /etc/apache2/sites-available/000-default.conf

mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

php artisan config:clear
php artisan route:clear
php artisan view:clear

attempt=1
max_attempts=5
until php artisan migrate --force; do
    if [ "$attempt" -ge "$max_attempts" ]; then
        echo "Database migration failed after ${max_attempts} attempts." >&2
        exit 1
    fi
    echo "Waiting for database (attempt ${attempt}/${max_attempts})..."
    attempt=$((attempt + 1))
    sleep 3
done

php artisan db:seed --class=MinefieldSeeder --force
if [ -n "${MINEFIELD_ADMIN_PASSWORD:-}" ]; then
    php artisan db:seed --class=AdminUserSeeder --force
fi

php artisan config:cache
php artisan route:cache
php artisan view:cache

exec apache2-foreground
