-- Migration: add_realtime_events

CREATE TABLE IF NOT EXISTS realtime_events (
  id BIGSERIAL PRIMARY KEY,
  channel TEXT NOT NULL DEFAULT 'default',
  type TEXT NOT NULL,
  entity TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_realtime_events_created_at ON realtime_events (created_at DESC);
