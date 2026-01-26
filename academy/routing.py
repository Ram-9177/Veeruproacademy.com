"""
WebSocket URL routing for real-time features.
"""
from django.urls import path
from academy_learning.consumers import (
    ProgressConsumer,
    NotificationConsumer,
    CourseUpdateConsumer,
)
from academy_courses.consumers import CourseUpdatesConsumer

websocket_urlpatterns = [
    path('ws/progress/<int:course_id>/', ProgressConsumer.as_asgi()),
    path('ws/notifications/', NotificationConsumer.as_asgi()),
    path('ws/course-updates/<int:course_id>/', CourseUpdateConsumer.as_asgi()),
    path('ws/courses/', CourseUpdatesConsumer.as_asgi()),  # Real-time course updates
]
