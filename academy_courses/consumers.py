"""
WebSocket consumer for real-time course updates.
Add this to academy_courses/consumers.py
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer


class CourseUpdatesConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer that broadcasts course updates to all connected clients.
    This enables real-time updates when admin makes changes.
    """
    
    async def connect(self):
        # Join course updates group
        self.group_name = 'course_updates'
        
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        # Leave course updates group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    
    async def course_update(self, event):
        """
        Send course update to WebSocket client.
        Called when a course is created, updated, or deleted in admin.
        """
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': event['update_type'],
            'course': event['course']
        }))
