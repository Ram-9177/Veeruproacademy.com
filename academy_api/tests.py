from django.test import TestCase


class ApiSmokeTests(TestCase):
	def test_health_endpoint(self):
		resp = self.client.get("/api/health/", secure=True)
		self.assertEqual(resp.status_code, 200)
		self.assertEqual(resp.json().get("ok"), True)
