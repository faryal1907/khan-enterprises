# Docker in Khan Enterprises

## What Docker is doing here

Docker is used for exactly one purpose in this project: **running the local development database**. Nothing else runs in Docker — not the NestJS API, not the Next.js apps. Those run directly on your machine with `npm run dev`.

The reason is simple. PostgreSQL is a server process that needs to be installed, configured, and running before your app can talk to it. Without Docker, every developer on the project would need to install Postgres manually, create the right database, set the right user and password, and make sure it doesn't conflict with any other Postgres instance they might have. Docker eliminates all of that — one command and the database is running, identically, on every machine.

---

## What's actually running

The file `docker/docker-compose.yml` defines two services:

### Service 1: `postgres`

```yaml
postgres:
  image: postgres:15-alpine
  container_name: khan-postgres
  ports:
    - "5435:5432"
  environment:
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    POSTGRES_DB: khan_db
  volumes:
    - postgres_data:/var/lib/postgresql/data
  networks:
    - khan_network
  restart: unless-stopped
```

This is the actual PostgreSQL database server. Breaking down each line:

- `image: postgres:15-alpine` — uses the official Postgres 15 image, Alpine variant (smaller footprint)
- `container_name: khan-postgres` — gives the container a fixed name so you can reference it by name instead of a random ID
- `ports: "5435:5432"` — maps port 5435 on your machine to port 5432 inside the container. Postgres always listens on 5432 internally. We expose it on 5435 externally to avoid conflicts with any other Postgres you might have installed locally on the default port
- `environment` — sets the database credentials and database name that Postgres creates on first startup. These match exactly what's in your `.env` file: `postgresql://postgres:postgres@localhost:5435/khan_db`
- `volumes: postgres_data` — this is critical. Without a volume, all your data would be deleted every time the container stops. The volume persists the database files on your machine's disk, outside the container. Your data survives restarts
- `restart: unless-stopped` — the container automatically restarts if it crashes, or when Docker Desktop starts up, unless you explicitly stopped it yourself

### Service 2: `pgadmin`

```yaml
pgadmin:
  image: dpage/pgadmin4
  container_name: khan-pgadmin
  ports:
    - "8080:80"
  environment:
    PGADMIN_DEFAULT_EMAIL: admin@khan.com
    PGADMIN_DEFAULT_PASSWORD: admin
  networks:
    - khan_network
  depends_on:
    - postgres
  restart: unless-stopped
```

pgAdmin is a web-based GUI for browsing and querying your PostgreSQL database. It runs in a browser at `http://localhost:8080`. You use it to inspect tables, run SQL queries, check what the seed script actually wrote, and debug data issues without writing code.

- `depends_on: postgres` — Docker won't start pgAdmin until the Postgres container is running
- `ports: "8080:80"` — pgAdmin's web server runs on port 80 inside the container, exposed on 8080 on your machine

### The network

```yaml
networks:
  khan_network:
    driver: bridge
```

Both containers are on the same private network (`khan_network`). This means pgAdmin can reach Postgres by its container name (`khan-postgres`) as the hostname — no IP address needed. Your machine connects to both via the mapped ports (5435 and 8080).

---

## The volume — why your data persists

```yaml
volumes:
  postgres_data:
    driver: local
```

This is a named Docker volume. Docker manages it on your machine's filesystem (usually inside `C:\Users\<you>\AppData\Local\Docker\` on Windows). When the Postgres container writes data, it writes to this volume. When the container stops or is removed, the volume stays. When the container starts again, it mounts the same volume and all your data is still there.

The only time data is lost is when you explicitly delete the volume — which happens with `docker-compose down -v` (the `-v` flag). A plain `docker-compose down` stops and removes the containers but leaves the volume intact.

---

## Commands

All commands run from the repo root.

```bash
# Start both containers in the background
npm run db:up

# Stop and remove containers (data is preserved in the volume)
npm run db:down

# Stop and remove containers AND delete all data
docker-compose -f docker/docker-compose.yml down -v
```

The `db:up` and `db:down` scripts in root `package.json` are just shortcuts:

```json
"db:up":   "docker-compose -f docker/docker-compose.yml up -d",
"db:down": "docker-compose -f docker/docker-compose.yml down"
```

The `-d` flag in `up -d` means "detached" — runs in the background so your terminal is free.

---

## Connecting to the database

### From your app (NestJS / Prisma)

The connection string in `.env`:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5435/khan_db?schema=public"
```

Broken down:
- `postgres:postgres` — username:password (set in docker-compose `environment`)
- `localhost:5435` — your machine's address, port 5435 (the mapped port)
- `khan_db` — the database name (created automatically on first startup)
- `?schema=public` — use the default `public` schema

### From pgAdmin (browser GUI)

1. Open `http://localhost:8080`
2. Log in: `admin@khan.com` / `admin`
3. Right-click "Servers" → "Register" → "Server"
4. In the "General" tab: give it any name (e.g. "Khan Local")
5. In the "Connection" tab:
   - Host: `khan-postgres` (the container name — works because pgAdmin is on the same Docker network)
   - Port: `5432` (the internal port, not 5435 — you're connecting container-to-container)
   - Database: `khan_db`
   - Username: `postgres`
   - Password: `postgres`
6. Save — you'll see all your tables under `khan_db → Schemas → public → Tables`

---

## The full local startup sequence

```bash
# 1. Start the database
npm run db:up

# 2. Apply schema migrations (first time, or after schema changes)
npx prisma migrate dev --name <description>

# 3. Regenerate Prisma client (after schema changes)
npm run prisma:generate

# 4. Seed the database with test data
npm run db:seed

# 5. Start all dev servers
npm run dev
```

After step 1, give Postgres about 5 seconds to initialize before running migrations. You can check it's ready by opening pgAdmin or running:

```bash
docker logs khan-postgres
```

Look for the line: `database system is ready to accept connections`

---

## What Docker is NOT doing here

To be explicit about scope:

- **The NestJS API does not run in Docker.** It runs directly with `nest start --watch` on your machine.
- **The Next.js apps do not run in Docker.** They run with `next dev` on your machine.
- **There is no Dockerfile** in this project yet. Docker Compose is the only Docker configuration.

In production, the API and frontend apps will be deployed to managed hosting (Render/Railway for the API, Vercel for the frontends). The production database will be a managed Postgres service (Neon.tech for staging, dedicated VPS for production). Docker is purely a local development convenience.

---

## Troubleshooting

**Port 5435 already in use**

Another process is using port 5435. Either stop that process, or change the port mapping in `docker-compose.yml` and update `DATABASE_URL` in `.env` to match.

**`docker-compose` command not found**

Docker Desktop must be installed and running. Download from [docker.com](https://www.docker.com/products/docker-desktop/).

**Container starts but Prisma can't connect**

Wait a few seconds after `npm run db:up` — Postgres takes a moment to initialize on first run. Then retry.

**Data is gone after restart**

You ran `docker-compose down -v` (with the `-v` flag) which deletes volumes. Run `npm run db:seed` to repopulate.

**pgAdmin shows no tables**

Migrations haven't been applied yet. Run `npx prisma migrate dev --name init` first.
