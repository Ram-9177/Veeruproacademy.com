-- SQL helpers to persist DB changes into realtime_events table

CREATE OR REPLACE FUNCTION notify_table_change() RETURNS trigger AS $$
DECLARE
  payload JSON;
BEGIN
  IF (TG_OP = 'INSERT') THEN
    payload := json_build_object('new', row_to_json(NEW));
    INSERT INTO realtime_events (channel, type, entity, payload) VALUES ('db', 'CREATE', TG_TABLE_NAME, payload);
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    payload := json_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW));
    INSERT INTO realtime_events (channel, type, entity, payload) VALUES ('db', 'UPDATE', TG_TABLE_NAME, payload);
    RETURN NEW;
  ELSIF (TG_OP = 'DELETE') THEN
    payload := json_build_object('old', row_to_json(OLD));
    INSERT INTO realtime_events (channel, type, entity, payload) VALUES ('db', 'DELETE', TG_TABLE_NAME, payload);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Example triggers for lessons and courses (uncomment and run if desired)
-- CREATE TRIGGER lessons_notify AFTER INSERT OR UPDATE OR DELETE ON public.lessons FOR EACH ROW EXECUTE FUNCTION notify_table_change();
-- CREATE TRIGGER courses_notify AFTER INSERT OR UPDATE OR DELETE ON public.courses FOR EACH ROW EXECUTE FUNCTION notify_table_change();
