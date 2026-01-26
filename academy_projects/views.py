from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Project, ProjectStatus
from .serializers import ProjectSerializer


class ProjectViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
    API endpoint for projects.
    Only published projects are visible to non-staff users.
    """
    serializer_class = ProjectSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Project.objects.all()
        # Non-staff users can only see published projects
        if not self.request.user.is_staff:
            queryset = queryset.filter(status=ProjectStatus.PUBLISHED)
        return queryset
