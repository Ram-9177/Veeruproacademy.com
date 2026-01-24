from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.html import format_html

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    ordering = ['-date_joined']
    list_display = ['email', 'name', 'status_badge', 'role_badge', 'date_joined']
    search_fields = ['email', 'name']
    list_filter = ('is_staff', 'is_active', 'is_superuser')
    list_per_page = 25
    date_hierarchy = 'date_joined'
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Profile', {'fields': ('name',)}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2', 'is_staff', 'is_superuser'),
        }),
    )
    filter_horizontal = ('groups', 'user_permissions')
    readonly_fields = ('date_joined', 'last_login')
    
    def status_badge(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="background-color: #10b981; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">Active</span>'
            )
        return format_html(
            '<span style="background-color: #ef4444; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">Inactive</span>'
        )
    status_badge.short_description = 'Status'
    
    def role_badge(self, obj):
        if obj.is_superuser:
            return format_html(
                '<span style="background-color: #8b5cf6; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">Admin</span>'
            )
        elif obj.is_staff:
            return format_html(
                '<span style="background-color: #3b82f6; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">Staff</span>'
            )
        return format_html(
            '<span style="background-color: #6b7280; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">Student</span>'
        )
    role_badge.short_description = 'Role'
