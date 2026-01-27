from __future__ import annotations

from django.contrib.auth import get_user_model
from django.test import TestCase
from unittest.mock import patch
from django.urls import reverse

from academy_audit.models import AuditLog
from academy_courses.models import ContentStatus, Course, CourseCategory, Lesson
from academy_learning.models import CourseProgress, Enrollment
from academy_payments.models import Entitlement, PaymentProofSubmission, ProductType, ProofStatus
from academy_payments.services import approve_course_payment_proof



class SmokeFlowTests(TestCase):
    def setUp(self) -> None:
        # Patch Celery tasks to prevent Redis errors during tests
        patcher = patch('academy_learning.services._safe_send_enrollment_email', lambda *a, **kw: None)
        self.addCleanup(patcher.stop)
        patcher.start()
        self.User = get_user_model()
        self.password = "StrongPass123!"

        self.student = self.User.objects.create_user(
            email="student@example.com",
            password=self.password,
            name="Student",
        )
        self.admin = self.User.objects.create_superuser(
            email="admin@example.com",
            password=self.password,
            name="Admin",
        )

        self.category = CourseCategory.objects.create(slug="cat", name="Category")

        self.free_course = Course.objects.create(
            slug="free-course",
            title="Free Course",
            status=ContentStatus.PUBLISHED,
            price=0,
            category=self.category,
        )
        self.paid_course = Course.objects.create(
            slug="paid-course",
            title="Paid Course",
            status=ContentStatus.PUBLISHED,
            price=999,
            category=self.category,
        )

        self.paid_module = self.paid_course.modules.create(
            slug="paid-module-1",
            title="Paid Module 1",
            description="",
            order=1,
        )
        Lesson.objects.create(
            module=self.paid_module,
            slug="paid-lesson-1",
            title="Paid Lesson 1",
            status=ContentStatus.PUBLISHED,
        )

    def _get(self, name: str, **kwargs):
        return self.client.get(reverse(name, kwargs=kwargs), secure=True)

    def _post(self, name: str, data: dict, **kwargs):
        return self.client.post(reverse(name, kwargs=kwargs), data=data, secure=True)

    def test_payment_proof_submission_feedback(self):
        self.client.login(email=self.student.email, password=self.password)
        resp = self._post(
            "academy_web:course_payment_proof",
            slug=self.paid_course.slug,
            data={
                "proof_url": "https://example.com/proof2.png",
                "notes": "Paid via UPI",
            },
        )
        self.assertEqual(resp.status_code, 302)
        # After submission, user should see a feedback message on dashboard
        dash = self._get("academy_web:dashboard")
        self.assertContains(dash, "Under Review")

    def _get(self, name: str, **kwargs):
        return self.client.get(reverse(name, kwargs=kwargs), secure=True)

    def _post(self, name: str, data: dict, **kwargs):
        return self.client.post(reverse(name, kwargs=kwargs), data=data, secure=True)

    def test_public_pages(self):
        resp = self.client.get("/", secure=True)
        self.assertEqual(resp.status_code, 200)
        # Check for key elements in home page
        self.assertContains(resp, "Veeru")

        resp = self._get("academy_web:course_list")
        self.assertContains(resp, "Courses")
        self.assertContains(resp, self.free_course.title)

        resp = self._get("academy_web:course_detail", slug=self.free_course.slug)
        self.assertContains(resp, self.free_course.title)

    def test_language_switch_sets_cookie(self):
        resp = self.client.post(
            reverse("set_language"),
            data={"language": "hi", "next": reverse("academy_web:home")},
            secure=True,
        )
        self.assertEqual(resp.status_code, 302)
        self.assertIn("django_language", resp.cookies)

    def test_auth_redirects_use_login_path(self):
        resp = self._get("academy_web:dashboard")
        self.assertEqual(resp.status_code, 302)
        self.assertIn("/login/", resp["Location"])

    def test_signup_and_login(self):
        signup_resp = self._post(
            "academy_web:signup",
            data={
                "email": "newuser@example.com",
                "name": "New User",
                "password1": self.password,
                "password2": self.password,
            },
        )
        self.assertEqual(signup_resp.status_code, 302)

        dash = self._get("academy_web:dashboard")
        self.assertEqual(dash.status_code, 200)

        self.client.get(reverse("academy_web:logout"), secure=True)

        login_resp = self._post(
            "academy_web:login",
            data={"email": "newuser@example.com", "password": self.password},
        )
        self.assertEqual(login_resp.status_code, 302)

        dash2 = self._get("academy_web:dashboard")
        self.assertEqual(dash2.status_code, 200)

    def test_login_respects_next_param(self):
        target = reverse("academy_web:course_detail", kwargs={"slug": self.free_course.slug})

        resp = self.client.get(reverse("academy_web:login") + f"?next={target}", secure=True)
        self.assertEqual(resp.status_code, 200)
        self.assertContains(resp, "name=\"next\"")

        login_resp = self.client.post(
            reverse("academy_web:login"),
            data={"email": self.student.email, "password": self.password, "next": target},
            secure=True,
        )
        self.assertEqual(login_resp.status_code, 302)
        self.assertEqual(login_resp["Location"], target)

    def test_free_course_enroll_works(self):
        self.client.login(email=self.student.email, password=self.password)

        resp = self._post("academy_web:course_enroll", data={}, slug=self.free_course.slug)
        self.assertEqual(resp.status_code, 302)

        self.assertTrue(Enrollment.objects.filter(user=self.student, course=self.free_course).exists())

    def test_paid_course_requires_payment_proof_then_admin_approval_unlocks(self):
        self.client.login(email=self.student.email, password=self.password)

        detail = self._get("academy_web:course_detail", slug=self.paid_course.slug)
        # Check for payment-related elements
        self.assertContains(detail, "Enroll now")
        self.assertContains(detail, "payment proof")

        # Enroll should be blocked for paid courses until entitlement exists
        enroll_resp = self._post("academy_web:course_enroll", data={}, slug=self.paid_course.slug)
        self.assertEqual(enroll_resp.status_code, 302)
        self.assertIn(reverse("academy_web:course_payment_proof", kwargs={"slug": self.paid_course.slug}), enroll_resp["Location"])
        self.assertFalse(Enrollment.objects.filter(user=self.student, course=self.paid_course).exists())

        # Submit payment proof
        proof_resp = self._post(
            "academy_web:course_payment_proof",
            slug=self.paid_course.slug,
            data={
                "proof_url": "https://example.com/proof.png",
                "notes": "Paid via UPI",
            },
        )
        self.assertEqual(proof_resp.status_code, 302)

        submission = PaymentProofSubmission.objects.get(user=self.student, course=self.paid_course)
        self.assertEqual(submission.status, ProofStatus.PENDING)

        dash_pending = self._get("academy_web:dashboard")
        self.assertContains(dash_pending, "Under Review")

        detail_pending = self._get("academy_web:course_detail", slug=self.paid_course.slug)
        self.assertContains(detail_pending, "Payment under review")

        # Admin approves
        approve_course_payment_proof(submission=submission, admin_user=self.admin)

        submission.refresh_from_db()
        self.assertEqual(submission.status, ProofStatus.APPROVED)

        self.assertTrue(
            Entitlement.objects.filter(
                user=self.student,
                product_type=ProductType.COURSE,
                course=self.paid_course,
            ).exists()
        )

        self.assertTrue(Enrollment.objects.filter(user=self.student, course=self.paid_course).exists())
        self.assertTrue(CourseProgress.objects.filter(user=self.student, course=self.paid_course).exists())
        self.assertTrue(AuditLog.objects.filter(action="payment_proof.approved").exists())

        dash = self._get("academy_web:dashboard")
        self.assertEqual(dash.status_code, 200)
        self.assertContains(dash, self.paid_course.title)
