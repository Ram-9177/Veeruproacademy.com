from __future__ import annotations

from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.http import HttpRequest, HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils.http import url_has_allowed_host_and_scheme

from academy_courses.models import ContentStatus, Course
from academy_learning.services import enroll_user_in_course
from academy_payments.forms import CoursePaymentProofForm
from academy_payments.models import PaymentProofSubmission, ProofStatus
from academy_payments.services import submit_course_payment_proof
from academy_payments.models import Entitlement, ProductType
from academy_projects.models import Project, ProjectStatus

from .forms import LoginForm, SignupForm, ContactForm, PasswordResetRequestForm, PasswordResetConfirmForm
from .forms_feedback import FeedbackForm


def home(request: HttpRequest) -> HttpResponse:
    return render(request, "academy_web/home.html")


def signup_view(request: HttpRequest) -> HttpResponse:
    if request.user.is_authenticated:
        return redirect("academy_web:dashboard")

    next_url = request.GET.get("next") or request.POST.get("next") or ""

    if request.method == "POST":
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            # Log them in immediately (simple UX). If you want approval gating,
            # flip this to create inactive users and show a pending page.
            login(request, user)
            messages.success(request, "Account created")
            if next_url and url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}, require_https=request.is_secure()):
                return redirect(next_url)
            return redirect("academy_web:dashboard")
    else:
        form = SignupForm()

    return render(request, "academy_web/signup.html", {"form": form, "next": next_url})


def login_view(request: HttpRequest) -> HttpResponse:
    if request.user.is_authenticated:
        return redirect("academy_web:dashboard")

    next_url = request.GET.get("next") or request.POST.get("next") or ""

    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid() and form.user is not None:
            login(request, form.user)
            # If the user didn't opt into "Remember me", expire the session on browser close.
            # When checked, Django will use SESSION_COOKIE_AGE.
            if not request.POST.get("remember"):
                request.session.set_expiry(0)
            if next_url and url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}, require_https=request.is_secure()):
                return redirect(next_url)
            return redirect("academy_web:dashboard")
    else:
        form = LoginForm()

    return render(request, "academy_web/login.html", {"form": form, "next": next_url})


def logout_view(request: HttpRequest) -> HttpResponse:
    if request.user.is_authenticated:
        logout(request)
        messages.success(request, "You have been logged out successfully.")
    return redirect("academy_web:home")


def course_list(request: HttpRequest) -> HttpResponse:
    qs = Course.objects.select_related('category', 'instructor').order_by("order", "title")
    # Staff sees all drafts; users see only published
    if not request.user.is_staff:
        qs = qs.filter(status=ContentStatus.PUBLISHED)
    courses = qs
    return render(request, "academy_web/course_list.html", {"courses": courses})


def course_detail(request: HttpRequest, slug: str) -> HttpResponse:
    qs = Course.objects.select_related('category', 'instructor')
    if not request.user.is_staff:
        qs = qs.filter(status=ContentStatus.PUBLISHED)
    course = get_object_or_404(qs, slug=slug)
    modules = course.modules.order_by("order", "title").prefetch_related("lessons")

    has_entitlement = False
    is_enrolled = False
    latest_submission = None
    if request.user.is_authenticated:
        has_entitlement = Entitlement.objects.filter(
            user=request.user,
            product_type=ProductType.COURSE,
            course=course,
        ).exists()

        is_enrolled = request.user.enrollments.filter(course=course).exists()

        latest_submission = (
            PaymentProofSubmission.objects.filter(
                user=request.user,
                product_type=ProductType.COURSE,
                course=course,
            )
            .order_by("-submitted_at")
            .first()
        )
    return render(
        request,
        "academy_web/course_detail.html",
        {
            "course": course,
            "modules": modules,
            "has_entitlement": has_entitlement,
            "is_enrolled": is_enrolled,
            "latest_submission": latest_submission,
        },
    )


@login_required
def course_enroll(request: HttpRequest, slug: str) -> HttpResponse:
    course = get_object_or_404(Course, slug=slug, status=ContentStatus.PUBLISHED)
    if request.method != "POST":
        return redirect("academy_web:course_detail", slug=slug)

    # Paid courses require an entitlement (granted by admin after payment proof approval).
    if (course.price or 0) > 0:
        has_entitlement = Entitlement.objects.filter(
            user=request.user,
            product_type=ProductType.COURSE,
            course=course,
        ).exists()
        if not has_entitlement and not request.user.is_staff:
            messages.info(request, "This is a paid course. Submit payment proof to unlock it.")
            return redirect("academy_web:course_payment_proof", slug=slug)

    result = enroll_user_in_course(request.user, course)
    if not result.success:
        messages.error(request, result.message)
        return redirect("academy_web:course_detail", slug=slug)

    messages.success(request, "Enrolled successfully")
    return redirect("academy_web:dashboard")


@login_required
def course_payment_proof(request: HttpRequest, slug: str) -> HttpResponse:
    course = get_object_or_404(Course, slug=slug, status=ContentStatus.PUBLISHED)

    # Free courses don't need proof.
    if (course.price or 0) <= 0:
        return redirect("academy_web:course_detail", slug=slug)

    # Already unlocked.
    if Entitlement.objects.filter(user=request.user, product_type=ProductType.COURSE, course=course).exists():
        messages.info(request, "This course is already unlocked.")
        return redirect("academy_web:dashboard")

    # Avoid duplicate pending submissions for the same course.
    if PaymentProofSubmission.objects.filter(
        user=request.user,
        product_type=ProductType.COURSE,
        course=course,
        status=ProofStatus.PENDING,
    ).exists():
        messages.info(request, "Your payment proof is already pending review.")
        return redirect("academy_web:dashboard")

    if request.method == "POST":
        form = CoursePaymentProofForm(request.POST, request.FILES)
        if form.is_valid():
            with transaction.atomic():
                submit_course_payment_proof(
                    user=request.user,
                    course=course,
                    proof_file=form.cleaned_data.get("proof_file"),
                    proof_url=form.cleaned_data.get("proof_url"),
                    notes=form.cleaned_data.get("notes"),
                )
            messages.success(request, "Payment proof submitted for review")
            return redirect("academy_web:dashboard")
    else:
        form = CoursePaymentProofForm()

    return render(request, "academy_web/course_payment_proof.html", {"course": course, "form": form})


@login_required
def dashboard(request: HttpRequest) -> HttpResponse:
    enrollments = (
        request.user.enrollments.select_related("course", "course__category", "course__instructor")
        .prefetch_related("course__modules")
        .order_by("-started_at")
    )
    progress = (
        request.user.course_progress.select_related("course")
        .order_by("-updated_at")
    )

    payment_proofs = (
        request.user.payment_proofs.select_related("course")
        .order_by("-submitted_at")
    )
    entitlements = (
        request.user.entitlements.select_related("course")
        .order_by("-granted_at")
    )

    has_pending_payment_proof = payment_proofs.filter(status=ProofStatus.PENDING).exists()

    # Use real-time dashboard template
    return render(
        request,
        "academy_web/dashboard_realtime.html",
        {
            "enrollments": enrollments,
            "progress": progress,
            "payment_proofs": payment_proofs,
            "entitlements": entitlements,
            "has_pending_payment_proof": has_pending_payment_proof,
        },
    )


def about(request: HttpRequest) -> HttpResponse:
    return render(request, "academy_web/about.html")


def privacy(request: HttpRequest) -> HttpResponse:
    return render(request, "academy_web/privacy.html")


def terms(request: HttpRequest) -> HttpResponse:
    return render(request, "academy_web/terms.html")


def projects_list(request: HttpRequest) -> HttpResponse:
    """BTech Projects listing page."""
    projects = Project.objects.filter(status=ProjectStatus.PUBLISHED).order_by("title")
    return render(request, "academy_web/projects_list.html", {"projects": projects})


def project_detail(request: HttpRequest, slug: str) -> HttpResponse:
    """BTech Project detail page."""
    project = get_object_or_404(Project, slug=slug, status=ProjectStatus.PUBLISHED)
    return render(request, "academy_web/project_detail.html", {"project": project})


def contact(request: HttpRequest) -> HttpResponse:
    """Contact us page."""
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            # In production, you would send an email here
            messages.success(request, "Thank you for your message! We'll get back to you within 24 hours.")
            return redirect("academy_web:contact")
    else:
        form = ContactForm()
    return render(request, "academy_web/contact.html", {"form": form})


def faq(request: HttpRequest) -> HttpResponse:
    """FAQ page."""
    return render(request, "academy_web/faq.html")


def careers(request: HttpRequest) -> HttpResponse:
    """Careers page."""
    return render(request, "academy_web/careers.html")


def blog(request: HttpRequest) -> HttpResponse:
    """Blog page."""
    return render(request, "academy_web/blog.html")


def refund_policy(request: HttpRequest) -> HttpResponse:
    """Refund policy page."""
    return render(request, "academy_web/refund_policy.html")


def password_reset_request(request: HttpRequest) -> HttpResponse:
    """Request a password reset email."""
    if request.user.is_authenticated:
        return redirect("academy_web:dashboard")

    if request.method == "POST":
        form = PasswordResetRequestForm(request.POST)
        if form.is_valid():
            from academy_users.models import User
            from django.contrib.auth.tokens import default_token_generator
            from django.utils.http import urlsafe_base64_encode
            from django.utils.encoding import force_bytes
            from django.core.mail import send_mail
            from django.conf import settings
            from django.template.loader import render_to_string

            email = form.cleaned_data["email"]
            try:
                user = User.objects.get(email__iexact=email, is_active=True)
                # Generate token
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                
                # Build reset URL
                reset_path = reverse(
                    "academy_web:password_reset_confirm",
                    kwargs={"uidb64": uid, "token": token},
                )
                reset_url = request.build_absolute_uri(reset_path)
                
                # Send email (configured in settings)
                subject = "Password Reset - Veeru's Pro Academy"
                message = f"""Hello {user.name or 'there'},

You requested a password reset for your Veeru's Pro Academy account.

Click the link below to reset your password:
{reset_url}

This link will expire in 24 hours.

If you didn't request this, please ignore this email.

- Veeru's Pro Academy Team
"""
                try:
                    send_mail(
                        subject,
                        message,
                        settings.DEFAULT_FROM_EMAIL,
                        [user.email],
                        fail_silently=False,
                    )
                except Exception:
                    # Log error but don't reveal if email exists
                    pass
            except User.DoesNotExist:
                # Don't reveal whether email exists
                pass

            # Always show success message to prevent email enumeration
            messages.success(
                request,
                "If an account with that email exists, we've sent password reset instructions."
            )
            return redirect("academy_web:login")
    else:
        form = PasswordResetRequestForm()

    return render(request, "academy_web/password_reset_request.html", {"form": form})


def password_reset_confirm(request: HttpRequest, uidb64: str, token: str) -> HttpResponse:
    """Confirm password reset with token."""
    from academy_users.models import User
    from django.contrib.auth.tokens import default_token_generator
    from django.utils.http import urlsafe_base64_decode
    from django.utils.encoding import force_str

    if request.user.is_authenticated:
        return redirect("academy_web:dashboard")

    # Validate token
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is None or not default_token_generator.check_token(user, token):
        messages.error(request, "This password reset link is invalid or has expired.")
        return redirect("academy_web:password_reset_request")

    if request.method == "POST":
        form = PasswordResetConfirmForm(request.POST)
        if form.is_valid():
            user.set_password(form.cleaned_data["password1"])
            user.save()
            messages.success(request, "Your password has been reset successfully. Please log in.")
            return redirect("academy_web:login")
    else:
        form = PasswordResetConfirmForm()

    return render(request, "academy_web/password_reset_confirm.html", {"form": form})


def feedback(request):
    from django.contrib import messages
    if request.method == "POST":
        form = FeedbackForm(request.POST)
        if form.is_valid():
            # In production, send email or store feedback in DB
            messages.success(request, "Thank you for your feedback! We appreciate your input.")
            return redirect("academy_web:dashboard")
    else:
        form = FeedbackForm()
    return render(request, "academy_web/feedback.html", {"form": form})


@login_required
def lesson_view(request: HttpRequest, course_slug: str, lesson_slug: str) -> HttpResponse:
    """View a specific lesson."""
    from academy_courses.models import Lesson
    from academy_learning.models import LessonProgress
    
    # Get the lesson
    lesson = get_object_or_404(
        Lesson.objects.select_related('module', 'module__course'),
        slug=lesson_slug,
        module__course__slug=course_slug
    )
    
    course = lesson.module.course
    
    # Check if user is enrolled
    is_enrolled = request.user.enrollments.filter(
        course=course,
        status='ACTIVE'
    ).exists()
    
    if not is_enrolled and not request.user.is_staff:
        messages.error(request, "You must be enrolled in this course to view lessons.")
        return redirect("academy_web:course_detail", slug=course_slug)
    
    # Get or create lesson progress
    lesson_progress, created = LessonProgress.objects.get_or_create(
        user=request.user,
        lesson=lesson
    )
    
    # Get all lessons in the course for navigation
    all_lessons = Lesson.objects.filter(
        module__course=course,
        status=ContentStatus.PUBLISHED
    ).select_related('module').order_by('module__order', 'order')
    
    # Find previous and next lessons
    lesson_list = list(all_lessons)
    current_index = next((i for i, l in enumerate(lesson_list) if l.id == lesson.id), None)
    
    previous_lesson = lesson_list[current_index - 1] if current_index and current_index > 0 else None
    next_lesson = lesson_list[current_index + 1] if current_index is not None and current_index < len(lesson_list) - 1 else None
    
    return render(
        request,
        "academy_web/lesson_view.html",
        {
            "lesson": lesson,
            "course": course,
            "lesson_progress": lesson_progress,
            "all_lessons": all_lessons,
            "previous_lesson": previous_lesson,
            "next_lesson": next_lesson,
        },
    )


@login_required
def mark_lesson_complete(request: HttpRequest, course_slug: str, lesson_slug: str) -> HttpResponse:
    """Mark a lesson as complete."""
    from academy_courses.models import Lesson
    from academy_learning.models import LessonProgress, CourseProgress
    from django.utils import timezone
    
    if request.method != "POST":
        return redirect("academy_web:lesson_view", course_slug=course_slug, lesson_slug=lesson_slug)
    
    lesson = get_object_or_404(
        Lesson.objects.select_related('module', 'module__course'),
        slug=lesson_slug,
        module__course__slug=course_slug
    )
    
    course = lesson.module.course
    
    # Check enrollment
    is_enrolled = request.user.enrollments.filter(
        course=course,
        status='ACTIVE'
    ).exists()
    
    if not is_enrolled and not request.user.is_staff:
        messages.error(request, "You must be enrolled in this course.")
        return redirect("academy_web:course_detail", slug=course_slug)
    
    # Mark lesson complete
    lesson_progress, created = LessonProgress.objects.get_or_create(
        user=request.user,
        lesson=lesson
    )
    
    if not lesson_progress.completed:
        lesson_progress.completed = True
        lesson_progress.completed_at = timezone.now()
        lesson_progress.save()
        
        # Update course progress
        course_progress, _ = CourseProgress.objects.get_or_create(
            user=request.user,
            course=course
        )
        
        completed_count = LessonProgress.objects.filter(
            user=request.user,
            lesson__module__course=course,
            completed=True
        ).count()
        
        total_lessons = Lesson.objects.filter(
            module__course=course,
            status=ContentStatus.PUBLISHED
        ).count()
        
        course_progress.completed_lessons = completed_count
        course_progress.total_lessons = total_lessons
        course_progress.progress_percent = (completed_count / total_lessons * 100) if total_lessons > 0 else 0
        course_progress.last_viewed_lesson = lesson
        course_progress.save()
        
        # Clear cache
        from academy_learning.services import invalidate_progress_cache
        invalidate_progress_cache(request.user.id, course.id)
        
        # Broadcast progress update via WebSocket
        from channels.layers import get_channel_layer
        from asgiref.sync import async_to_sync
        
        channel_layer = get_channel_layer()
        if channel_layer:
            async_to_sync(channel_layer.group_send)(
                f'progress_{request.user.id}_{course.id}',
                {
                    'type': 'progress_update',
                    'data': {
                        'type': 'progress_update',
                        'progress': {
                            'completed_lessons': course_progress.completed_lessons,
                            'total_lessons': course_progress.total_lessons,
                            'progress_percent': course_progress.progress_percent,
                        }
                    }
                }
            )
        
        messages.success(request, f"Lesson '{lesson.title}' marked as complete!")
    
    # Redirect to next lesson or back to current lesson
    next_url = request.POST.get('next')
    if next_url and url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}, require_https=request.is_secure()):
        return redirect(next_url)
    
    return redirect("academy_web:lesson_view", course_slug=course_slug, lesson_slug=lesson_slug)
