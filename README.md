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

For detailed test instructions and CI/CD setup, see the [Testing Guide](#testing).

## Testing

To run tests locally:

```bash
# Set up environment for tests
export DJANGO_SECRET_KEY=test-secret-key
export DJANGO_DEBUG=False

# Run all tests
python manage.py test

# Run specific app tests
python manage.py test academy_web
python manage.py test academy_learning
```

The test suite uses SQLite by default and falls back to in-memory cache when Redis is not available, making it easy to run in CI/CD environments.

## Deployment

See [docs/deploy-live.md](docs/deploy-live.md) for production deployment instructions.
