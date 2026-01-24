from django.contrib import admin
from django.utils.html import format_html

from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("created_at", "action_badge", "actor_display", "subject_type", "subject_id", "message_preview")
    list_filter = ("action", "subject_type", "created_at")
    search_fields = ("action", "subject_type", "subject_id", "message", "actor__email")
    readonly_fields = ("created_at", "action", "actor", "subject_type", "subject_id", "message", "metadata")
    list_per_page = 50
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    
    def has_add_permission(self, request):
        return False  # Audit logs should not be manually created
    
    def has_change_permission(self, request, obj=None):
        return False  # Audit logs should not be edited
    
    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser  # Only superusers can delete
    
    def action_badge(self, obj):
        colors = {
            'CREATE': '#10b981',
            'UPDATE': '#3b82f6',
            'DELETE': '#ef4444',
            'LOGIN': '#8b5cf6',
            'LOGOUT': '#6b7280',
            'APPROVE': '#10b981',
            'REJECT': '#ef4444',
        }
        color = colors.get(obj.action.upper() if obj.action else '', '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">{}</span>',
            color, obj.action
        )
    action_badge.short_description = 'Action'
    action_badge.admin_order_field = 'action'
    
    def actor_display(self, obj):
        if obj.actor:
            return obj.actor.email
        return format_html('<span style="color: #6b7280;">System</span>')
    actor_display.short_description = 'Actor'
    actor_display.admin_order_field = 'actor__email'
    
    def message_preview(self, obj):
        if obj.message:
            return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
        return '—'
    message_preview.short_description = 'Message'
