from django.contrib import admin
from django.utils.html import format_html

from .models import Role, UserRole


@admin.register(Role)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['key', 'name', 'user_count', 'created_at']
    search_fields = ['key', 'name', 'description']
    ordering = ['name']
    list_per_page = 20
    
    fieldsets = (
        ('Role Information', {
            'fields': ('key', 'name', 'description')
        }),
        ('Permissions', {
            'fields': ('permissions',),
            'classes': ('collapse',)
        }),
    )
    
    def user_count(self, obj):
        count = obj.user_roles.count()
        return format_html(
            '<span style="background-color: #3b82f6; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">{} users</span>',
            count
        )
    user_count.short_description = 'Users'


@admin.register(UserRole)
class UserRoleAdmin(admin.ModelAdmin):
    list_display = ['user_email', 'role_badge', 'is_primary_badge', 'assigned_at', 'assigned_by_display']
    list_filter = ['role', 'is_primary']
    search_fields = ['user__email', 'user__name', 'role__key', 'role__name']
    autocomplete_fields = ['user', 'role']
    list_per_page = 25
    date_hierarchy = 'assigned_at'
    ordering = ['-assigned_at']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'
    
    def role_badge(self, obj):
        colors = {
            'admin': '#8b5cf6',
            'instructor': '#10b981',
            'student': '#3b82f6',
            'moderator': '#f59e0b',
        }
        color = colors.get(obj.role.key.lower() if obj.role else '', '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">{}</span>',
            color, obj.role.name if obj.role else '—'
        )
    role_badge.short_description = 'Role'
    role_badge.admin_order_field = 'role__name'
    
    def is_primary_badge(self, obj):
        if obj.is_primary:
            return format_html(
                '<span style="background-color: #10b981; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">✓ Primary</span>'
            )
        return format_html(
            '<span style="background-color: #6b7280; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">Secondary</span>'
        )
    is_primary_badge.short_description = 'Primary'
    is_primary_badge.admin_order_field = 'is_primary'
    
    def assigned_by_display(self, obj):
        if hasattr(obj, 'assigned_by') and obj.assigned_by:
            return obj.assigned_by.email
        return format_html('<span style="color: #6b7280;">System</span>')
    assigned_by_display.short_description = 'Assigned By'
