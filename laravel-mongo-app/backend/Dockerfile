FROM php:8.2-fpm

# ------------------------------------------------------------
# System dependencies
# ------------------------------------------------------------
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# ------------------------------------------------------------
# MongoDB PHP extension
# ------------------------------------------------------------
RUN pecl install mongodb \
    && docker-php-ext-enable mongodb

# ------------------------------------------------------------
# Composer
# ------------------------------------------------------------
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# ------------------------------------------------------------
# Application setup
# ------------------------------------------------------------
WORKDIR /var/www

# Copy the ENTIRE Laravel application first (artisan must exist)
COPY . .

# Ensure proper permissions (important on Linux VMs)
RUN chown -R www-data:www-data /var/www

# ------------------------------------------------------------
# Install PHP dependencies
# ------------------------------------------------------------
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction

# ------------------------------------------------------------
# Expose port & run
# ------------------------------------------------------------
EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000