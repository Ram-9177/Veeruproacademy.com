"""
WebSocket consumers for real-time learning features.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.core.cache import cache


class ProgressConsumer(AsyncWebsocketConsumer):
    """Real-time course progress updates."""
    
    async def connect(self):
        self.course_id = self.scope['url_route']['kwargs']['course_id']
        self.user = self.scope['user']
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.room_group_name = f'progress_{self.user.id}_{self.course_id}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send current progress on connect
        progress = await self.get_progress()
        await self.send(text_data=json.dumps({
            'type': 'progress_update',
            'progress': progress
        }))
    
    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle incoming progress updates from client."""
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'mark_complete':
                lesson_id = data.get('lesson_id')
                await self.mark_lesson_complete(lesson_id)
            elif action == 'update_checkpoint':
                lesson_id = data.get('lesson_id')
                checkpoint = data.get('checkpoint')
                await self.update_checkpoint(lesson_id, checkpoint)
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))
    
    async def progress_update(self, event):
        """Send progress update to WebSocket."""
        await self.send(text_data=json.dumps(event['data']))
    
    @database_sync_to_async
    def get_progress(self):
        from academy_learning.models import CourseProgress
        try:
            progress = CourseProgress.objects.get(
                user=self.user,
                course_id=self.course_id
            )
            return {
                'completed_lessons': progress.completed_lessons,
                'total_lessons': progress.total_lessons,
                'progress_percent': progress.progress_percent,
            }
        except CourseProgress.DoesNotExist:
            return {
                'completed_lessons': 0,
                'total_lessons': 0,
                'progress_percent': 0,
            }
    
    @database_sync_to_async
    def mark_lesson_complete(self, lesson_id):
        from academy_learning.models import LessonProgress, CourseProgress
        from academy_courses.models import Lesson
        from django.utils import timezone
        
        try:
            lesson = Lesson.objects.get(id=lesson_id, module__course_id=self.course_id)
            lesson_progress, created = LessonProgress.objects.get_or_create(
                user=self.user,
                lesson=lesson,
                defaults={'completed': True, 'completed_at': timezone.now()}
            )
            
            if not lesson_progress.completed:
                lesson_progress.completed = True
                lesson_progress.completed_at = timezone.now()
                lesson_progress.save()
            
            # Update course progress
            course_progress, _ = CourseProgress.objects.get_or_create(
                user=self.user,
                course_id=self.course_id
            )
            
            completed_count = LessonProgress.objects.filter(
                user=self.user,
                lesson__module__course_id=self.course_id,
                completed=True
            ).count()
            
            total_lessons = Lesson.objects.filter(
                module__course_id=self.course_id
            ).count()
            
            course_progress.completed_lessons = completed_count
            course_progress.total_lessons = total_lessons
            course_progress.progress_percent = (completed_count / total_lessons * 100) if total_lessons > 0 else 0
            course_progress.last_viewed_lesson = lesson
            course_progress.save()
            
            return True
        except Exception:
            return False
    
    @database_sync_to_async
    def update_checkpoint(self, lesson_id, checkpoint):
        from academy_learning.models import LessonProgress
        from academy_courses.models import Lesson
        
        try:
            lesson = Lesson.objects.get(id=lesson_id)
            lesson_progress, _ = LessonProgress.objects.get_or_create(
                user=self.user,
                lesson=lesson
            )
            
            if not lesson_progress.checkpoints:
                lesson_progress.checkpoints = []
            
            lesson_progress.checkpoints.append(checkpoint)
            lesson_progress.save()
            return True
        except Exception:
            return False


class NotificationConsumer(AsyncWebsocketConsumer):
    """Real-time notifications for users."""
    
    async def connect(self):
        self.user = self.scope['user']
        
        if not self.user.is_authenticated:
            await self.close()
            return
        
        self.room_group_name = f'notifications_{self.user.id}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send unread count on connect
        unread_count = await self.get_unread_count()
        await self.send(text_data=json.dumps({
            'type': 'unread_count',
            'count': unread_count
        }))
    
    async def disconnect(self, close_code):
        if hasattr(self, 'room_group_name'):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        """Handle incoming messages from client."""
        try:
            data = json.loads(text_data)
            action = data.get('action')
            
            if action == 'mark_read':
                notification_id = data.get('notification_id')
                await self.mark_notification_read(notification_id)
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))
    
    async def notification(self, event):
        """Send notification to WebSocket."""
        await self.send(text_data=json.dumps(event['data']))
    
    @database_sync_to_async
    def get_unread_count(self):
        # Placeholder - implement when notification model is created
        return cache.get(f'unread_notifications_{self.user.id}', 0)
    
    @database_sync_to_async
    def mark_notification_read(self, notification_id):
        # Placeholder - implement when notification model is created
        pass


class CourseUpdateConsumer(AsyncWebsocketConsumer):
    """Real-time course content updates."""
    
    async def connect(self):
        self.course_id = self.scope['url_route']['kwargs']['course_id']
        self.room_group_name = f'course_updates_{self.course_id}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def course_update(self, event):
        """Send course update to WebSocket."""
        await self.send(text_data=json.dumps(event['data']))
