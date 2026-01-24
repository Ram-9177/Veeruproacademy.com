from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Enrollment, CourseProgress, LessonProgress
from .serializers import EnrollmentSerializer, CourseProgressSerializer, LessonProgressSerializer

class EnrollmentViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)

class CourseProgressViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = CourseProgressSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return CourseProgress.objects.filter(user=self.request.user)

class LessonProgressViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    serializer_class = LessonProgressSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return LessonProgress.objects.filter(user=self.request.user)
