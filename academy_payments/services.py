from __future__ import annotations

from django.db import transaction
from django.utils import timezone

from academy_audit.models import AuditLog
from academy_learning.models import CourseProgress, Enrollment, EnrollmentStatus
from academy_learning.services import enroll_user_in_course

from academy_courses.models import Course

from .models import Entitlement, EntitlementSource, PaymentProofSubmission, ProductType, ProofStatus


def submit_course_payment_proof(*, user, course: Course, proof_file, proof_url: str | None, notes: str | None) -> PaymentProofSubmission:
    return PaymentProofSubmission.objects.create(
        user=user,
        product_type=ProductType.COURSE,
        course=course,
        amount=course.price or 0,
        proof_file=proof_file,
        proof_url=proof_url,
        notes=notes or "",
        status=ProofStatus.PENDING,
    )


@transaction.atomic
def approve_course_payment_proof(*, submission: PaymentProofSubmission, admin_user, admin_notes: str | None = None) -> None:
    if submission.status == ProofStatus.APPROVED:
        return

    if submission.product_type != ProductType.COURSE or submission.course_id is None:
        raise ValueError("Submission is not a course payment proof")

    Entitlement.objects.get_or_create(
        user=submission.user,
        product_type=ProductType.COURSE,
        course=submission.course,
        defaults={"source": EntitlementSource.MANUAL, "granted_by": admin_user},
    )

    # Enrollment + progress
    enroll_user_in_course(submission.user, submission.course)
    from academy_courses.models import Lesson
    lesson_qs = Lesson.objects.filter(module__course=submission.course)
    total_lessons = lesson_qs.count()
    CourseProgress.objects.get_or_create(
        user=submission.user,
        course=submission.course,
        defaults={"total_lessons": total_lessons, "progress_percent": 0},
    )
    Enrollment.objects.filter(user=submission.user, course=submission.course).update(status=EnrollmentStatus.ACTIVE)

    submission.status = ProofStatus.APPROVED
    submission.reviewed_by = admin_user
    submission.reviewed_at = timezone.now()
    submission.admin_notes = admin_notes or submission.admin_notes
    submission.save(update_fields=["status", "reviewed_by", "reviewed_at", "admin_notes"])

    AuditLog.objects.create(
        actor=admin_user,
        action="payment_proof.approved",
        subject_type="course",
        subject_id=str(submission.course_id),
        message=f"Approved payment proof submission {submission.id}",
        metadata={
            "submission_id": submission.id,
            "user_id": submission.user_id,
            "course_id": submission.course_id,
        },
    )


@transaction.atomic
def reject_payment_proof(*, submission: PaymentProofSubmission, admin_user, admin_notes: str | None = None) -> None:
    if submission.status == ProofStatus.REJECTED:
        return

    submission.status = ProofStatus.REJECTED
    submission.reviewed_by = admin_user
    submission.reviewed_at = timezone.now()
    submission.admin_notes = admin_notes or submission.admin_notes
    submission.save(update_fields=["status", "reviewed_by", "reviewed_at", "admin_notes"])

    AuditLog.objects.create(
        actor=admin_user,
        action="payment_proof.rejected",
        subject_type=("course" if submission.course_id else "project" if submission.project_id else ""),
        subject_id=str(submission.course_id or submission.project_id or ""),
        message=f"Rejected payment proof submission {submission.id}",
        metadata={
            "submission_id": submission.id,
            "user_id": submission.user_id,
            "course_id": submission.course_id,
            "project_id": submission.project_id,
        },
    )
