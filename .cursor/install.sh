#!/usr/bin/env bash
# Idempotent Cloud Agent install for EcoDiaries (Next.js 15 + Payload CMS 3 + Postgres 16).
# Runs after checkout. Safe to re-run: package installs, cluster init, and seeding are all guarded.
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

PG_VERSION=16
PGBIN="/usr/lib/postgresql/${PG_VERSION}/bin"
export PGDATA="${PGDATA:-$HOME/pgdata}"
PGPORT=5432
PGLOG="$HOME/pg.log"

# 1. System dependency: PostgreSQL 16 (server + client). The default image ships Node 22
#    but not Postgres, so install it here where it is baked into the environment snapshot.
if ! dpkg -s "postgresql-${PG_VERSION}" >/dev/null 2>&1; then
  echo "[install] Installing postgresql-${PG_VERSION}..."
  sudo apt-get update -qq
  sudo DEBIAN_FRONTEND=noninteractive apt-get install -y -qq \
    "postgresql-${PG_VERSION}" "postgresql-client-${PG_VERSION}"
fi

# 2. Node dependencies (respects .npmrc legacy-peer-deps + package-lock.json).
echo "[install] Installing npm dependencies..."
npm ci

# 3. Initialise a user-owned Postgres cluster (no sudo needed to run it at boot).
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  echo "[install] Initialising Postgres cluster at $PGDATA..."
  "$PGBIN/initdb" -D "$PGDATA" -U postgres \
    --auth-local=trust --auth-host=trust --encoding=UTF8 >/dev/null
fi

# 4. Start the cluster (temporarily) so we can create the DB and seed it.
if ! "$PGBIN/pg_isready" -q -h 127.0.0.1 -p "$PGPORT"; then
  rm -f "$PGDATA/postmaster.pid"  # clear any stale pid carried in from a snapshot
  "$PGBIN/pg_ctl" -D "$PGDATA" -o "-p ${PGPORT} -k /tmp" -l "$PGLOG" -w start
fi

# 5. Create the application database and set the expected password (idempotent).
if ! "$PGBIN/psql" -h 127.0.0.1 -p "$PGPORT" -U postgres -lqt | cut -d '|' -f1 | grep -qw ecodiaries; then
  "$PGBIN/createdb" -h 127.0.0.1 -p "$PGPORT" -U postgres ecodiaries
fi
"$PGBIN/psql" -h 127.0.0.1 -p "$PGPORT" -U postgres -c "ALTER USER postgres PASSWORD 'postgres';" >/dev/null

# 6. Local dev environment file (git-ignored). Only create if absent so user edits survive.
if [ ! -f .env ]; then
  echo "[install] Writing default .env..."
  cat > .env <<'EOF'
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/ecodiaries
PAYLOAD_SECRET=dev-secret-min-32-characters-long-000
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
TURNSTILE_SKIP_VERIFY=true
EOF
fi

# 7. Push the Payload schema and seed baseline content (both idempotent).
set -a; . ./.env; set +a
echo "[install] Pushing Payload schema..."
PAYLOAD_DB_PUSH=true npm run db:push
echo "[install] Seeding baseline content..."
npm run seed

echo "[install] Done."
