from django.apps import AppConfig


class AcademyLearningConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "academy_learning"

    def ready(self):
        from . import signals
