"""
Business logic services for learning features.
"""
import logging
from dataclasses import dataclass
from typing import Optional
from django.db import transaction
from django.db import models
from django.utils import timezone
from django.core.cache import cache
from academy_courses.models import Course
from academy_learning.models import Enrollment, EnrollmentStatus, CourseProgress
from academy_users.models import User


logger = logging.getLogger(__name__)


@dataclass
class EnrollmentResult:
    success: bool
    message: str
    enrollment: Optional[Enrollment] = None


def enroll_user_in_course(user: User, course: Course) -> EnrollmentResult:
    """
    Enroll a user in a course with proper validation and caching.
    """
    # Calculate lesson count once for progress initialization or refresh.
    def _compute_total_lessons() -> int:
        return course.modules.aggregate(total=models.Count("lessons"))['total'] or 0

    # Check if already enrolled
    existing = Enrollment.objects.filter(user=user, course=course).first()
    if existing:
        if existing.status == EnrollmentStatus.ACTIVE:
            # Already active; avoid duplicate create and integrity errors.
            # Ensure progress exists even if enrollment was created elsewhere.
            CourseProgress.objects.get_or_create(
                user=user,
                course=course,
                defaults={
                    "total_lessons": _compute_total_lessons(),
                    "completed_lessons": 0,
                    "progress_percent": 0,
                },
            )
            return EnrollmentResult(
                success=False,
                message="You are already enrolled in this course",
                enrollment=existing,
            )
        if existing.status == EnrollmentStatus.CANCELLED:
            # Reactivate cancelled enrollment
            with transaction.atomic():
                existing.status = EnrollmentStatus.ACTIVE
                existing.started_at = timezone.now()
                existing.save(update_fields=["status", "started_at"])

                # Ensure progress exists
                CourseProgress.objects.get_or_create(
                    user=user,
                    course=course,
                    defaults={
                        "total_lessons": _compute_total_lessons(),
                        "completed_lessons": 0,
                        "progress_percent": 0,
                    },
                )

            cache.delete(f"user_enrollments_{user.id}")

            _safe_send_enrollment_email(user.id, course.id)

            return EnrollmentResult(
                success=True,
                message="Enrollment reactivated successfully",
                enrollment=existing,
            )

    # Create new enrollment
    with transaction.atomic():
        enrollment, _ = Enrollment.objects.get_or_create(
            user=user,
            course=course,
            defaults={"status": EnrollmentStatus.ACTIVE},
        )

        # Initialize or reconcile course progress
        CourseProgress.objects.get_or_create(
            user=user,
            course=course,
            defaults={
                "total_lessons": _compute_total_lessons(),
                "completed_lessons": 0,
                "progress_percent": 0,
            },
        )

    cache.delete(f"user_enrollments_{user.id}")
    cache.delete(f"course_enrollments_{course.id}")

    _safe_send_enrollment_email(user.id, course.id)

    return EnrollmentResult(
        success=True,
        message="Enrolled successfully",
        enrollment=enrollment,
    )


def get_user_enrollments(user: User, use_cache: bool = True):
    """Get user enrollments with caching."""
    cache_key = f'user_enrollments_{user.id}'
    
    if use_cache:
        cached = cache.get(cache_key)
        if cached is not None:
            return cached
    
    enrollments = list(
        Enrollment.objects
        .filter(user=user)
        .select_related('course', 'course__category', 'course__instructor')
        .order_by('-started_at')
    )
    
    cache.set(cache_key, enrollments, timeout=300)  # 5 minutes
    return enrollments


def get_course_progress(user: User, course: Course, use_cache: bool = True):
    """Get course progress with caching."""
    cache_key = f'course_progress_{user.id}_{course.id}'
    
    if use_cache:
        cached = cache.get(cache_key)
        if cached is not None:
            return cached
    
    try:
        progress = CourseProgress.objects.get(user=user, course=course)
        cache.set(cache_key, progress, timeout=300)  # 5 minutes
        return progress
    except CourseProgress.DoesNotExist:
        return None


def invalidate_progress_cache(user_id: int, course_id: int):
    """Invalidate progress-related caches."""
    cache.delete(f'course_progress_{user_id}_{course_id}')
    cache.delete(f'user_enrollments_{user_id}')
    cache.delete(f'course_enrollments_{course_id}')


def _safe_send_enrollment_email(user_id: int, course_id: int) -> None:
    """Queue enrollment email without breaking the request if Celery/Redis is down."""
    try:
        from academy_learning.tasks import send_enrollment_email
        send_enrollment_email.apply_async(args=[user_id, course_id], ignore_result=True)
    except Exception as exc:  # pragma: no cover - defensive guard for runtime outages
        logger.warning("Enrollment email could not be queued", exc_info=exc)
