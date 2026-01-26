from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'slug', 'title', 'description', 'thumbnail', 'price', 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
