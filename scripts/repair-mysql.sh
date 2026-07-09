#!/bin/bash
set -euo pipefail

MYSQL_PREFIX="/opt/homebrew/opt/mysql"
DATADIR="/opt/homebrew/var/mysql"
SOCKET="/tmp/mysql.sock"
INIT_FILE="/tmp/mysql-init-root.sql"
ROOT_PASSWORD="${MYSQL_ROOT_PASSWORD:-root123456}"

echo "==> Stopping MySQL..."
brew services stop mysql 2>/dev/null || true
pkill -9 mysqld 2>/dev/null || true
sleep 2

cat > "$INIT_FILE" <<SQL
SET GLOBAL validate_password.policy = LOW;
SET GLOBAL validate_password.length = 6;
SET GLOBAL validate_password.mixed_case_count = 0;
SET GLOBAL validate_password.number_count = 0;
SET GLOBAL validate_password.special_char_count = 0;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '${ROOT_PASSWORD}';
CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '${ROOT_PASSWORD}';
ALTER USER 'root'@'localhost' IDENTIFIED BY '${ROOT_PASSWORD}';
ALTER USER 'root'@'127.0.0.1' IDENTIFIED BY '${ROOT_PASSWORD}';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SQL

echo "==> Starting MySQL with init-file (create root)..."
"$MYSQL_PREFIX/bin/mysqld" \
  --datadir="$DATADIR" \
  --init-file="$INIT_FILE" \
  --user="$(whoami)" &

MYSQLD_PID=$!
for i in $(seq 1 40); do
  if mysql -u root -p"${ROOT_PASSWORD}" -h 127.0.0.1 -e "SELECT 1" &>/dev/null; then
    echo "==> Root login OK"
    break
  fi
  if ! kill -0 "$MYSQLD_PID" 2>/dev/null; then
    echo "mysqld exited early. Check: $DATADIR/*.err"
    tail -30 "$DATADIR"/*.local.err 2>/dev/null || tail -30 "$DATADIR/repair.err" 2>/dev/null
    exit 1
  fi
  sleep 1
done

if ! mysql -u root -p"${ROOT_PASSWORD}" -h 127.0.0.1 -e "SELECT 1" &>/dev/null; then
  echo "==> Init-file login failed, trying skip-grant-tables..."
  kill "$MYSQLD_PID" 2>/dev/null || true
  pkill -9 mysqld 2>/dev/null || true
  sleep 2

  "$MYSQL_PREFIX/bin/mysqld" \
    --datadir="$DATADIR" \
    --skip-grant-tables \
    --user="$(whoami)" &
  sleep 8

  mysql -u root <<EOSQL
FLUSH PRIVILEGES;
SET GLOBAL validate_password.policy = LOW;
SET GLOBAL validate_password.length = 6;
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY '${ROOT_PASSWORD}';
CREATE USER IF NOT EXISTS 'root'@'127.0.0.1' IDENTIFIED BY '${ROOT_PASSWORD}';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOSQL

  mysqladmin -u root shutdown 2>/dev/null || pkill -9 mysqld || true
  sleep 3
  brew services start mysql
  sleep 6
else
  kill "$MYSQLD_PID" 2>/dev/null || mysqladmin -u root -p"${ROOT_PASSWORD}" shutdown 2>/dev/null || true
  sleep 3
  brew services start mysql
  sleep 6
fi

echo "==> Verifying..."
mysql -u root -p"${ROOT_PASSWORD}" -h 127.0.0.1 -e "SELECT VERSION() AS version; SHOW DATABASES;"

if mysql -u root -p"${ROOT_PASSWORD}" -h 127.0.0.1 -e "USE authority; SHOW TABLES;" &>/dev/null; then
  echo "==> authority database OK"
  mysql -u root -p"${ROOT_PASSWORD}" -h 127.0.0.1 -e "USE authority; SHOW TABLES;"
fi

echo ""
echo "MySQL repaired. Navicat settings:"
echo "  Host: 127.0.0.1"
echo "  Port: 3306"
echo "  User: root"
echo "  Password: ${ROOT_PASSWORD}"
