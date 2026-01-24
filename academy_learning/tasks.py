"""
Celery tasks for background processing.
"""
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


@shared_task(bind=True, max_retries=3)
def send_enrollment_email(self, user_id, course_id):
    """Send enrollment confirmation email."""
    try:
        from academy_users.models import User
        from academy_courses.models import Course
        
        user = User.objects.get(id=user_id)
        course = Course.objects.get(id=course_id)
        
        subject = f'Welcome to {course.title}!'
        message = f"""
        Hi {user.name or 'there'},
        
        You've successfully enrolled in {course.title}!
        
        Start learning now: {settings.SITE_URL}/courses/{course.slug}/
        
        Happy learning!
        - Veeru's Pro Academy Team
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        # Send real-time notification
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{user_id}',
            {
                'type': 'notification',
                'data': {
                    'type': 'enrollment_success',
                    'message': f'Successfully enrolled in {course.title}',
                    'course_id': course_id,
                    'timestamp': timezone.now().isoformat(),
                }
            }
        )
        
        return f'Email sent to {user.email}'
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3)
def send_payment_approval_email(self, user_id, course_id):
    """Send payment approval notification."""
    try:
        from academy_users.models import User
        from academy_courses.models import Course
        
        user = User.objects.get(id=user_id)
        course = Course.objects.get(id=course_id)
        
        subject = 'Payment Approved - Course Unlocked!'
        message = f"""
        Hi {user.name or 'there'},
        
        Great news! Your payment for {course.title} has been approved.
        
        You can now enroll and start learning: {settings.SITE_URL}/courses/{course.slug}/
        
        - Veeru's Pro Academy Team
        """
        
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        # Send real-time notification
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'notifications_{user_id}',
            {
                'type': 'notification',
                'data': {
                    'type': 'payment_approved',
                    'message': f'Payment approved for {course.title}',
                    'course_id': course_id,
                    'timestamp': timezone.now().isoformat(),
                }
            }
        )
        
        return f'Payment approval email sent to {user.email}'
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@shared_task
def update_course_progress_cache(user_id, course_id):
    """Update cached course progress data."""
    from academy_learning.models import CourseProgress, LessonProgress
    from django.core.cache import cache
    
    try:
        progress = CourseProgress.objects.get(user_id=user_id, course_id=course_id)
        cache_key = f'course_progress_{user_id}_{course_id}'
        cache.set(cache_key, {
            'completed_lessons': progress.completed_lessons,
            'total_lessons': progress.total_lessons,
            'progress_percent': progress.progress_percent,
        }, timeout=3600)  # 1 hour
        
        return f'Progress cached for user {user_id}, course {course_id}'
    except CourseProgress.DoesNotExist:
        return f'No progress found for user {user_id}, course {course_id}'


@shared_task
def cleanup_old_sessions():
    """Clean up expired sessions."""
    from django.core.management import call_command
    call_command('clearsessions')
    return 'Old sessions cleaned up'


@shared_task
def generate_certificate(user_id, course_id):
    """Generate course completion certificate."""
    from academy_learning.models import Certificate, CourseProgress
    from academy_users.models import User
    from academy_courses.models import Course
    import uuid
    
    try:
        user = User.objects.get(id=user_id)
        course = Course.objects.get(id=course_id)
        progress = CourseProgress.objects.get(user=user, course=course)
        
        if progress.progress_percent >= 100:
            certificate, created = Certificate.objects.get_or_create(
                user=user,
                course=course,
                defaults={
                    'certificate_number': f'VPA-{uuid.uuid4().hex[:12].upper()}',
                    'metadata': {
                        'completion_date': timezone.now().isoformat(),
                        'progress_percent': progress.progress_percent,
                    }
                }
            )
            
            if created:
                # Send notification
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                    f'notifications_{user_id}',
                    {
                        'type': 'notification',
                        'data': {
                            'type': 'certificate_issued',
                            'message': f'Certificate issued for {course.title}',
                            'certificate_number': certificate.certificate_number,
                            'timestamp': timezone.now().isoformat(),
                        }
                    }
                )
                
                return f'Certificate generated: {certificate.certificate_number}'
            else:
                return f'Certificate already exists: {certificate.certificate_number}'
        else:
            return f'Course not completed yet ({progress.progress_percent}%)'
    except Exception as e:
        return f'Error generating certificate: {str(e)}'


@shared_task
def broadcast_course_update(course_id, update_type, message):
    """Broadcast course content updates to all connected users."""
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f'course_updates_{course_id}',
        {
            'type': 'course_update',
            'data': {
                'update_type': update_type,
                'message': message,
                'timestamp': timezone.now().isoformat(),
            }
        }
    )
    return f'Course update broadcasted for course {course_id}'
