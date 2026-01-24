from django.conf import settings
from django.db import models


class RoleKey(models.TextChoices):
	ADMIN = 'ADMIN', 'Admin'
	INSTRUCTOR = 'INSTRUCTOR', 'Instructor'
	STUDENT = 'STUDENT', 'Student'
	SUPPORT = 'SUPPORT', 'Support'


class Role(models.Model):
	key = models.CharField(max_length=32, choices=RoleKey.choices, unique=True)
	name = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	permissions = models.JSONField(default=list, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		indexes = [models.Index(fields=['key'])]

	def __str__(self) -> str:
		return f'{self.key}'


class UserRole(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_roles')
	role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name='user_roles')
	is_primary = models.BooleanField(default=False)
	assigned_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = [('user', 'role')]
		indexes = [models.Index(fields=['role'])]

	def __str__(self) -> str:
		return f'{self.user_id}:{self.role.key}'
