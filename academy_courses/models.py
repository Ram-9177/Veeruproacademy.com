from django.conf import settings
from django.db import models


class ContentStatus(models.TextChoices):
	DRAFT = 'DRAFT', 'Draft'
	PUBLISHED = 'PUBLISHED', 'Published'
	ARCHIVED = 'ARCHIVED', 'Archived'


class CourseCategory(models.Model):
	slug = models.SlugField(unique=True)
	name = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	order = models.IntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['order', 'name']

	def __str__(self) -> str:
		return self.name


class Course(models.Model):
	slug = models.SlugField(unique=True)
	title = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	thumbnail = models.CharField(max_length=1024, blank=True)
	level = models.CharField(max_length=64, blank=True)
	duration = models.CharField(max_length=64, blank=True)
	price = models.FloatField(default=0)
	status = models.CharField(max_length=16, choices=ContentStatus.choices, default=ContentStatus.DRAFT)
	published_at = models.DateTimeField(null=True, blank=True)
	scheduled_at = models.DateTimeField(null=True, blank=True)
	order = models.IntegerField(default=0)
	metadata = models.JSONField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	category = models.ForeignKey(CourseCategory, null=True, blank=True, on_delete=models.SET_NULL, related_name='courses')
	instructor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name='courses')

	class Meta:
		ordering = ['order', 'title']
		indexes = [
			models.Index(fields=['status']),
			models.Index(fields=['order']),
		]

	def __str__(self) -> str:
		return self.title


class Module(models.Model):
	course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
	slug = models.SlugField()
	title = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	order = models.IntegerField(default=0)
	metadata = models.JSONField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		unique_together = [('course', 'slug')]
		ordering = ['order', 'title']
		indexes = [models.Index(fields=['course', 'order'])]

	def __str__(self) -> str:
		return f'{self.course.slug}:{self.slug}'


class Lesson(models.Model):
	module = models.ForeignKey(Module, null=True, blank=True, on_delete=models.CASCADE, related_name='lessons')
	slug = models.SlugField(unique=True)
	# course is now always derived from module
	title = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	body = models.TextField(blank=True)
	youtube_url = models.CharField(max_length=2048, blank=True)
	estimated_minutes = models.IntegerField(null=True, blank=True)
	difficulty = models.CharField(max_length=64, blank=True)
	order = models.IntegerField(default=0)
	status = models.CharField(max_length=16, choices=ContentStatus.choices, default=ContentStatus.DRAFT)
	published_at = models.DateTimeField(null=True, blank=True)
	scheduled_at = models.DateTimeField(null=True, blank=True)
	metadata = models.JSONField(null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ['order', 'title']
		unique_together = [('module', 'slug')]
		indexes = [
			models.Index(fields=['module']),
			models.Index(fields=['slug']),
			models.Index(fields=['status']),
		]

	def __str__(self) -> str:
		return self.title
