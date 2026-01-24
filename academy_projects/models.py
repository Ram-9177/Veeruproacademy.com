from django.db import models


class ProjectStatus(models.TextChoices):
    DRAFT = "DRAFT", "Draft"
    PUBLISHED = "PUBLISHED", "Published"
    ARCHIVED = "ARCHIVED", "Archived"


class Project(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    thumbnail = models.CharField(max_length=1024, blank=True)
    price = models.FloatField(default=0)
    status = models.CharField(max_length=16, choices=ProjectStatus.choices, default=ProjectStatus.DRAFT)
    metadata = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]
        indexes = [models.Index(fields=["status"]) ]

    def __str__(self) -> str:
        return self.title
