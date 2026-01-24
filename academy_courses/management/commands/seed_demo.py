
from django.core.management.base import BaseCommand
from academy_courses.models import Course  # Example model, adjust as needed

class Command(BaseCommand):
	help = 'Seeds demo data for development.'

	def handle(self, *args, **options):
		# Example: create a demo course if none exist
		if not Course.objects.exists():
			Course.objects.create(title='Demo Course', description='This is a demo course.')
			self.stdout.write(self.style.SUCCESS('Demo course created.'))
		else:
			self.stdout.write(self.style.WARNING('Demo data already exists.'))

