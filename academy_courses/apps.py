from django.apps import AppConfig


class AcademyCoursesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'academy_courses'

    def ready(self):
        # Enable real-time course sync signals
        import academy_courses.signals_realtime  # noqa: F401
