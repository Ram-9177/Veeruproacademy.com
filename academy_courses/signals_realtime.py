"""
Django signal to broadcast course updates via WebSocket when admin makes changes.
Add this to academy_courses/signals.py
"""
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import Course


@receiver(post_save, sender=Course)
def broadcast_course_created_or_updated(sender, instance, created, **kwargs):
    """
    Broadcast course updates to all connected clients via WebSocket.
    This enables real-time updates without page refresh.
    """
    channel_layer = get_channel_layer()
    
    # Only broadcast if course is published
    if instance.status != 'PUBLISHED':
        return
    
    update_type = 'course_created' if created else 'course_updated'
    
    # Broadcast to all clients listening to course updates
    async_to_sync(channel_layer.group_send)(
        'course_updates',
        {
            'type': 'course_update',
            'update_type': update_type,
            'course': {
                'id': instance.id,
                'slug': instance.slug,
                'title': instance.title,
                'category': instance.category.name if instance.category else None,
            }
        }
    )


@receiver(post_delete, sender=Course)
def broadcast_course_deleted(sender, instance, **kwargs):
    """
    Broadcast course deletion to all connected clients.
    """
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        'course_updates',
        {
            'type': 'course_update',
            'update_type': 'course_deleted',
            'course': {
                'id': instance.id,
                'slug': instance.slug,
            }
        }
    )
