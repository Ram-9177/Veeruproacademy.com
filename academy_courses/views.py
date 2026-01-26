from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import ContentStatus, Course, CourseCategory, Lesson, Module
from .serializers import CourseCategorySerializer, CourseSerializer, LessonSerializer, ModuleSerializer


class CourseCategoryViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
	queryset = CourseCategory.objects.all()
	serializer_class = CourseCategorySerializer
	lookup_field = 'slug'
	permission_classes = [IsAuthenticatedOrReadOnly]


class CourseViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
	"""
	API endpoint for courses.
	Only published courses are visible to non-staff users.
	"""
	serializer_class = CourseSerializer
	lookup_field = 'slug'
	permission_classes = [IsAuthenticatedOrReadOnly]
	
	def get_queryset(self):
		queryset = Course.objects.select_related('category').all()
		# Non-staff users can only see published courses
		if not self.request.user.is_staff:
			queryset = queryset.filter(status=ContentStatus.PUBLISHED)
		return queryset


class ModuleViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
	"""
	API endpoint for modules.
	Only modules of published courses are visible to non-staff users.
	"""
	serializer_class = ModuleSerializer
	permission_classes = [IsAuthenticatedOrReadOnly]
	
	def get_queryset(self):
		queryset = Module.objects.select_related('course').all()
		# Non-staff users can only see modules from published courses
		if not self.request.user.is_staff:
			queryset = queryset.filter(course__status=ContentStatus.PUBLISHED)
		return queryset


class LessonViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
	"""
	API endpoint for lessons.
	Only lessons of published courses are visible to non-staff users.
	"""
	serializer_class = LessonSerializer
	lookup_field = 'slug'
	permission_classes = [IsAuthenticatedOrReadOnly]
	
	def get_queryset(self):
		queryset = Lesson.objects.select_related('module', 'module__course').all()
		# Non-staff users can only see lessons from published courses
		if not self.request.user.is_staff:
			queryset = queryset.filter(
				status=ContentStatus.PUBLISHED,
				module__course__status=ContentStatus.PUBLISHED
			)
		return queryset
