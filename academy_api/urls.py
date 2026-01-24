from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from academy_courses.views import CourseCategoryViewSet, CourseViewSet, LessonViewSet, ModuleViewSet
from academy_learning.views import EnrollmentViewSet, CourseProgressViewSet, LessonProgressViewSet

from .views import health

router = DefaultRouter()
router.register('course-categories', CourseCategoryViewSet, basename='course-category')
router.register('courses', CourseViewSet, basename='course')
router.register('modules', ModuleViewSet, basename='module')
router.register('lessons', LessonViewSet, basename='lesson')
router.register('enrollments', EnrollmentViewSet, basename='enrollment')
router.register('course-progress', CourseProgressViewSet, basename='course-progress')
router.register('lesson-progress', LessonProgressViewSet, basename='lesson-progress')

urlpatterns = [
    path('health/', health),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]
