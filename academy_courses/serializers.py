from rest_framework import serializers

from .models import Course, CourseCategory, Lesson, Module


class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = ['id', 'slug', 'name', 'description', 'order']


class CourseSerializer(serializers.ModelSerializer):
    category = CourseCategorySerializer(read_only=True)

    class Meta:
        model = Course
        fields = [
            'id',
            'slug',
            'title',
            'description',
            'thumbnail',
            'level',
            'duration',
            'price',
            'status',
            'published_at',
            'scheduled_at',
            'order',
            'metadata',
            'category',
            'instructor_id',
        ]


class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = ['id', 'course_id', 'slug', 'title', 'description', 'order', 'metadata']


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = [
            'id',
            'course_id',
            'module_id',
            'slug',
            'title',
            'description',
            'body',
            'youtube_url',
            'estimated_minutes',
            'difficulty',
            'order',
            'status',
            'published_at',
            'scheduled_at',
            'metadata',
        ]
