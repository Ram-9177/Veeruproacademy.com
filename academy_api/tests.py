
from django.test import TestCase
from unittest.mock import patch


class ApiSmokeTests(TestCase):
	@classmethod
	def setUpClass(cls):
		super().setUpClass()
		cls._celery_patcher = patch('academy_learning.services._safe_send_enrollment_email', lambda *a, **kw: None)
		cls._celery_patcher.start()

	@classmethod
	def tearDownClass(cls):
		cls._celery_patcher.stop()
		super().tearDownClass()
	def test_health_endpoint(self):
		resp = self.client.get("/api/health/", secure=True)
		self.assertEqual(resp.status_code, 200)
		self.assertEqual(resp.json().get("ok"), True)
