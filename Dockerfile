FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    gettext \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . /app

# Collect static assets during build (best effort)
RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

# Use entrypoint to run migrations, collectstatic, then start Daphne
RUN chmod +x /app/entrypoint.sh
CMD ["/app/entrypoint.sh"]
