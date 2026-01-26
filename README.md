# Veeru's Pro Academy (Django Monolith)
This repository is a Django 4.2 templates-first monolith. The Django Admin is the operational control plane.

Project docs live under [docs/README.md](docs/README.md).
Live deployment guidance: [docs/deploy-live.md](docs/deploy-live.md).

## Local development

### 1) Create a virtualenv + install deps

```bash
python -m venv .venv
source .venv/bin/activate

python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 2) Configure environment

Create a `.env` at the repo root (you can start from `.env.example`). At minimum you should set a secret key and a database.

### 3) Migrate + create an admin user

```bash
python manage.py migrate
python manage.py createsuperuser
```

Optional: seed demo courses/modules/lessons

```bash
python manage.py seed_demo
```

### 4) Run the server

```bash
python manage.py runserver 0.0.0.0:8000
```

- App: http://127.0.0.1:8000/
- Admin: http://127.0.0.1:8000/admin/

### 5) Run tests

```bash
python manage.py test
```

**Note:** Tests run without requiring Redis or external services. The test suite uses in-memory alternatives for channels, cache, and Celery.

## Repo structure

- `academy/`: Django project (settings/urls/wsgi/asgi)
- `academy_web/`: template-based web UI
- `academy_courses/`, `academy_learning/`, `academy_payments/`, `academy_users/`, `academy_rbac/`, `academy_audit/`: core domain apps
- `templates/`: shared templates
- `static/`: static assets (branding lives in `static/branding/`)

## Deployment (high level)

Typical production setup:

1. Set environment variables (database URL, secret key, allowed hosts, etc.)
2. Run `python manage.py migrate`
3. Run `python manage.py collectstatic`
4. Serve via Gunicorn (and WhiteNoise for static)

See [docs/deploy-live.md](docs/deploy-live.md) for a production checklist and environment variables.
