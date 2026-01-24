from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import LessonProgress, CourseProgress, Certificate

def get_course_from_lesson(lesson):
    if lesson and lesson.module and hasattr(lesson.module, 'course'):
        return lesson.module.course
    return None

@receiver(post_save, sender=LessonProgress)
def update_course_progress_on_lesson_complete(sender, instance, created, **kwargs):
    if instance.completed:
        lesson = instance.lesson
        course = get_course_from_lesson(lesson)
        if course:
            user = instance.user
            total_lessons = sum(m.lessons.count() for m in course.modules.all())
            completed = LessonProgress.objects.filter(user=user, lesson__module__course=course, completed=True).count()
            percent = (completed / total_lessons) * 100 if total_lessons else 0
            cp, _ = CourseProgress.objects.update_or_create(
                user=user,
                course=course,
                defaults={
                    'completed_lessons': completed,
                    'total_lessons': total_lessons,
                    'progress_percent': percent,
                },
            )
            if percent >= 100:
                Certificate.objects.get_or_create(user=user, course=course)
