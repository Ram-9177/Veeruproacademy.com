from django.contrib import admin
from django.utils.html import format_html

from .models import Certificate, CourseProgress, Enrollment, LessonProgress


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user_email", "course", "status_badge", "started_at", "completed_at")
    list_filter = ("status", "course")
    search_fields = ("user__email", "user__name", "course__slug", "course__title")
    list_per_page = 25
    date_hierarchy = 'started_at'
    ordering = ['-started_at']
    list_select_related = ['user', 'course']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'
    
    def status_badge(self, obj):
        colors = {
            'ACTIVE': '#10b981',
            'COMPLETED': '#3b82f6',
            'CANCELLED': '#ef4444',
        }
        color = colors.get(obj.status, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">{}</span>',
            color, obj.status
        )
    status_badge.short_description = 'Status'


@admin.register(CourseProgress)
class CourseProgressAdmin(admin.ModelAdmin):
    list_display = ("user_email", "course", "progress_bar", "updated_at")
    search_fields = ("user__email", "user__name", "course__slug", "course__title")
    list_filter = ("course",)
    list_per_page = 25
    ordering = ['-updated_at']
    list_select_related = ['user', 'course']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'
    
    def progress_bar(self, obj):
        percent = obj.progress_percent or 0
        color = '#10b981' if percent >= 80 else '#3b82f6' if percent >= 40 else '#f59e0b'
        return format_html(
            '<div style="width: 100px; background-color: #e5e7eb; border-radius: 10px; overflow: hidden;">'
            '<div style="width: {}%; height: 20px; background-color: {}; text-align: center; color: white; font-size: 11px; line-height: 20px;">{}%</div>'
            '</div>',
            percent, color, percent
        )
    progress_bar.short_description = 'Progress'


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("user_email", "lesson", "completed_badge", "completed_at", "updated_at")
    list_filter = ("completed",)
    search_fields = ("user__email", "lesson__title")
    list_per_page = 30
    ordering = ['-updated_at']
    list_select_related = ['user', 'lesson']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    
    def completed_badge(self, obj):
        if obj.completed:
            return format_html(
                '<span style="background-color: #10b981; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">✓ Done</span>'
            )
        return format_html(
            '<span style="background-color: #6b7280; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">In Progress</span>'
        )
    completed_badge.short_description = 'Status'


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ("certificate_number", "user_email", "course", "issued_at")
    search_fields = ("certificate_number", "user__email", "user__name", "course__slug", "course__title")
    list_filter = ("course",)
    list_per_page = 25
    date_hierarchy = 'issued_at'
    ordering = ['-issued_at']
    list_select_related = ['user', 'course']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'
