#!/bin/bash
set -e

echo "=============================="
echo "Starting MySQL Setup"
echo "=============================="

DB_NAME="${DB_NAME:-AmkorVehicleBookingSystem}"
DB_PASSWORD="${MYSQL_ROOT_PASSWORD:-root}"

if [ ! -d "/var/lib/mysql/mysql" ]; then
    echo "Initializing MySQL..."

    mysql_install_db \
        --user=mysql \
        --datadir=/var/lib/mysql > /dev/null

    FIRST_RUN=true
else
    FIRST_RUN=false
fi

echo "Starting MySQL..."

mysqld_safe --datadir=/var/lib/mysql &

until mysqladmin ping --silent; do
    sleep 1
done

echo "MySQL ready"

if [ "$FIRST_RUN" = true ]; then

    echo "Creating root password..."

    mysql -u root <<MYSQL

ALTER USER 'root'@'localhost'
IDENTIFIED BY '${DB_PASSWORD}';

CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;

FLUSH PRIVILEGES;

MYSQL

    echo "Importing schema.sql..."

    mysql \
        -u root \
        -p"${DB_PASSWORD}" \
        "${DB_NAME}" < /docker-entrypoint-initdb/schema.sql

else

    echo "Existing database detected. Skipping initialization."

fi

echo "Stopping temporary MySQL..."

mysqladmin \
    -u root \
    -p"${DB_PASSWORD}" shutdown

echo "Starting Apache and MySQL..."

exec supervisord -c /etc/supervisor/conf.d/supervisord.conf