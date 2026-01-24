from django.apps import AppConfig


class AcademyWebConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "academy_web"

    def ready(self):
        from django.contrib import admin
        admin.site.site_header = "Veeru's Pro Academy Admin"
        admin.site.site_title = "Academy Admin Portal"
        admin.site.index_title = "Welcome to Veeru's Pro Academy Administration"
