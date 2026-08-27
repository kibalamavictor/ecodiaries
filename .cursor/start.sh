#!/usr/bin/env bash
# Per-boot startup for EcoDiaries: bring up the Postgres daemon and wait until it is ready.
# Idempotent: exits cleanly if the cluster is already running.
set -euo pipefail

PG_VERSION=16
PGBIN="/usr/lib/postgresql/${PG_VERSION}/bin"
export PGDATA="${PGDATA:-$HOME/pgdata}"
PGPORT=5432
PGLOG="$HOME/pg.log"

if "$PGBIN/pg_ctl" -D "$PGDATA" status >/dev/null 2>&1; then
  echo "[start] Postgres already running."
else
  echo "[start] Starting Postgres..."
  "$PGBIN/pg_ctl" -D "$PGDATA" -o "-p ${PGPORT} -k /tmp" -l "$PGLOG" -w start
fi

# Readiness check.
"$PGBIN/pg_isready" -h 127.0.0.1 -p "$PGPORT" -U postgres
echo "[start] Postgres is ready on port ${PGPORT}."
