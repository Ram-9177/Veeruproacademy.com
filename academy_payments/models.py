from __future__ import annotations

from django.conf import settings
from django.db import models

from academy_courses.models import Course
from academy_projects.models import Project


class ProductType(models.TextChoices):
    COURSE = "COURSE", "Course"
    PROJECT = "PROJECT", "Project"


class ProofStatus(models.TextChoices):
    PENDING = "PENDING", "Pending"
    APPROVED = "APPROVED", "Approved"
    REJECTED = "REJECTED", "Rejected"


class PaymentProofSubmission(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payment_proofs")
    product_type = models.CharField(max_length=16, choices=ProductType.choices)
    course = models.ForeignKey(Course, null=True, blank=True, on_delete=models.CASCADE, related_name="payment_proofs")
    project = models.ForeignKey(Project, null=True, blank=True, on_delete=models.CASCADE, related_name="payment_proofs")

    amount = models.FloatField(default=0)
    proof_file = models.FileField(upload_to="payment_proofs/", null=True, blank=True)
    proof_url = models.URLField(max_length=2048, null=True, blank=True)
    notes = models.TextField(blank=True)

    status = models.CharField(max_length=16, choices=ProofStatus.choices, default=ProofStatus.PENDING)
    submitted_at = models.DateTimeField(auto_now_add=True)

    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="reviewed_payment_proofs")
    reviewed_at = models.DateTimeField(null=True, blank=True)
    admin_notes = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["product_type", "status"]),
            models.Index(fields=["user", "submitted_at"]),
        ]

    def __str__(self) -> str:
        return f"{self.product_type}:{self.status}:{self.id}"


class EntitlementSource(models.TextChoices):
    MANUAL = "MANUAL", "Manual"
    FREE = "FREE", "Free"


class Entitlement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="entitlements")
    product_type = models.CharField(max_length=16, choices=ProductType.choices)
    course = models.ForeignKey(Course, null=True, blank=True, on_delete=models.CASCADE, related_name="entitlements")
    project = models.ForeignKey(Project, null=True, blank=True, on_delete=models.CASCADE, related_name="entitlements")

    source = models.CharField(max_length=16, choices=EntitlementSource.choices, default=EntitlementSource.MANUAL)
    granted_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="granted_entitlements")
    granted_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(null=True, blank=True)

    class Meta:
        unique_together = [("user", "product_type", "course", "project")]

    def __str__(self) -> str:
        return f"{self.user_id}:{self.product_type}"
