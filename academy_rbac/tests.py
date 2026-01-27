
from django.test import TestCase
from unittest.mock import patch


class CeleryMockedTestCase(TestCase):
	@classmethod
	def setUpClass(cls):
		super().setUpClass()
		cls._celery_patcher = patch('academy_learning.services._safe_send_enrollment_email', lambda *a, **kw: None)
		cls._celery_patcher.start()

	@classmethod
	def tearDownClass(cls):
		cls._celery_patcher.stop()
		super().tearDownClass()
