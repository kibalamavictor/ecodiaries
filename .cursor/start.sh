#!/usr/bin/env bash
# Per-boot startup for EcoDiaries: bring up the Postgres daemon and wait until it is ready.
# Idempotent: exits cleanly if the cluster is already running.
set -euo pipefail

PG_VERSION=16
PGBIN="/usr/lib/postgresql/${PG_VERSION}/bin"
export PGDATA="${PGDATA:-$HOME/pgdata}"
PGPORT=5432
PGLOG="$HOME/pg.log"

if "$PGBIN/pg_isready" -q -h 127.0.0.1 -p "$PGPORT"; then
  echo "[start] Postgres already accepting connections."
else
  # A snapshot may carry a stale postmaster.pid from when it was captured. If the
  # server is not actually accepting connections, that pid is stale — clear it so
  # the daemon starts cleanly.
  rm -f "$PGDATA/postmaster.pid"
  echo "[start] Starting Postgres..."
  "$PGBIN/pg_ctl" -D "$PGDATA" -o "-p ${PGPORT} -k /tmp" -l "$PGLOG" -w start
fi

"$PGBIN/pg_isready" -h 127.0.0.1 -p "$PGPORT" -U postgres
echo "[start] Postgres is ready on port ${PGPORT}."
