## Realtime deployment (free-tier friendly options)

This document covers running the realtime stack (Daphne + Channels + Redis + Celery) locally with Docker Compose, and deploying to low-cost/free hosts like Fly.io and Railway. Free tiers have limits — review each provider's quotas.

Summary of what I added to the repo:
- `Dockerfile` — image that runs the Django project with `daphne`.
- `docker-compose.realtime.yml` — local stack: `redis`, `web` (daphne), `celery-worker`, `celery-beat`.
- `deploy/realtime.service` and `deploy/celery.service` — example `systemd` units for self-hosted servers.

Prerequisites (local):
- Docker & Docker Compose installed
- `.env` file in project root with required env vars (see section below)

Common environment variables (put in `.env`):
```
SECRET_KEY=replace-me
DEBUG=False
ALLOWED_HOSTS=your.domain.com,localhost
DATABASE_URL=sqlite:///db.sqlite3
REDIS_URL=redis://redis:6379/0
DJANGO_SETTINGS_MODULE=academy.settings
```

Local Docker Compose (fast, free):
1. Copy `.env.realtime.example` to `.env` and edit values.
2. Start the stack:
```bash
docker compose -f docker-compose.realtime.yml up --build
```
3. The site (Daphne) will be at `http://localhost:8000`.

Deploy to Fly.io (recommended free-process host for ASGI services):
1. Install `flyctl`: https://fly.io/docs/getting-started/installing-flyctl/
2. Login and create an app:
```bash
flyctl auth login
flyctl apps create veeru-academy
```
3. Set secrets (on Fly, set `DATABASE_URL`, `SECRET_KEY`, `REDIS_URL`):
```bash
flyctl secrets set SECRET_KEY="$(openssl rand -hex 32)" DEBUG=False
flyctl secrets set REDIS_URL=redis://<managed-redis-host>:6379/0
```
4. Deploy using Dockerfile:
```bash
flyctl deploy --remote-only
```
Notes: Fly.io offers small free VMs that work well for persistent Daphne processes. You will likely need an external managed Redis (or run Redis on Fly as another app).

Deploy to Railway (quick but watch free quota):
1. Connect your GitHub repo in Railway and create a new service using Dockerfile.
2. Set environment variables in Railway project settings (`SECRET_KEY`, `REDIS_URL`, `DATABASE_URL`, `DJANGO_SETTINGS_MODULE`).
3. Railway will build and deploy on push.

Self-host with Docker Compose + systemd (free if you have a server):
1. Copy example systemd units from `deploy/` to `/etc/systemd/system/` and update paths.
2. Create a Python virtualenv (or use Docker) and ensure `.env` exists at the working directory.
3. Enable & start services:
```bash
sudo systemctl daemon-reload
sudo systemctl enable realtime.service
sudo systemctl start realtime.service
sudo systemctl enable celery.service
sudo systemctl start celery.service
```

Production notes & limitations on free tiers:
- Free tiers may sleep or have resource limits — realtime workloads (long-lived sockets) prefer providers that allow persistent processes (Fly.io, Railway paid, Render paid).
- Use managed Postgres / managed DB in production (Railway/Fly have addons). SQLite is fine for testing but not for multi-instance.
- Secure `SECRET_KEY` and other secrets — use provider secret stores.

If you want, I can:
- Wire a `fly.toml` and example `Dockerfile` tweaks specific to Fly.io and push them.
- Create GitHub Actions to build/test and auto-deploy to Railway or Fly on push.
