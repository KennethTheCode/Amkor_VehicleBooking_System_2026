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
fi


echo "Starting MySQL..."

mysqld_safe --datadir=/var/lib/mysql &


until mysqladmin ping --silent; do
    sleep 1
done


echo "MySQL ready"


echo "Creating root password..."

mysql -u root <<MYSQL

ALTER USER 'root'@'localhost'
IDENTIFIED BY '${DB_PASSWORD}';

CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;

FLUSH PRIVILEGES;

MYSQL


TABLE_COUNT=$(mysql -u root -p"${DB_PASSWORD}" -Nse \
"SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='${DB_NAME}';")


if [ "$TABLE_COUNT" -eq 0 ]; then

    echo "Importing schema.sql..."

    mysql \
    -u root \
    -p"${DB_PASSWORD}" \
    "${DB_NAME}" < /docker-entrypoint-initdb/schema.sql

fi


echo "Stopping temporary MySQL..."

mysqladmin \
-u root \
-p"${DB_PASSWORD}" shutdown


echo "Starting Apache and MySQL..."

exec supervisord \
-c /etc/supervisor/conf.d/supervisord.conf