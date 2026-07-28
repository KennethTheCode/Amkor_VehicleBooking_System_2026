# =========================================================
# PHP + Apache + MySQL Runtime
# =========================================================

FROM php:8.2-apache


# Install MySQL + Supervisor + PHP Extensions

RUN apt-get update && apt-get install -y \
    default-mysql-server \
    supervisor \
    && docker-php-ext-install mysqli pdo pdo_mysql \
    && a2enmod rewrite \
    && rm -rf /var/lib/apt/lists/*



# Apache Configuration

COPY docker/apache-vhost.conf /etc/apache2/sites-available/000-default.conf



# Backend

COPY Backend/ /var/www/html/backend/



# React Build

COPY Frontend/dist/ /var/www/html/



# React Router

COPY docker/htaccess-root /var/www/html/.htaccess



# Supervisor

COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf



# Database Schema

RUN mkdir -p /docker-entrypoint-initdb

COPY schema.sql /docker-entrypoint-initdb/schema.sql


# Startup Script

COPY docker/entrypoint.sh /entrypoint.sh



# Permissions

RUN chmod +x /entrypoint.sh \
    && mkdir -p /var/lib/mysql \
    && mkdir -p /var/run/mysqld \
    && chown -R mysql:mysql /var/lib/mysql \
    && chown -R mysql:mysql /var/run/mysqld \
    && chown -R www-data:www-data /var/www/html \
    && find /var/www/html -type d -exec chmod 755 {} \; \
    && find /var/www/html -type f -exec chmod 644 {} \;

ENV MYSQL_ROOT_PASSWORD=root
ENV DB_NAME=AmkorVehicleBookingSystem

EXPOSE 80


ENTRYPOINT ["/entrypoint.sh"]