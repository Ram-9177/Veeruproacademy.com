# Roadmap (Django Monolith Baseline)
## Immediate (Baseline)

- Confirm admin approval → entitlement → enrollment works.
- Replace any remaining API needs with Django views (templates-first).
- Add admin workflows for content creation (courses/modules/lessons).

## Next (Parity)

- Projects unlock flow + proof review (mirror courses).
- CMS pages + optional revision history.
- Notifications (admin broadcast + user read state).
- Audit logging coverage for admin actions.

## Later (Hardening)

- Add proper role/permission enforcement across views.
- Add automated tests for:
  - payment proof approve/reject
  - enroll/progress/certificate issuance
- Add production deployment pipeline (Docker or Procfile + gunicorn + whitenoise).
