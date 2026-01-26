from django.contrib import admin
from django.utils.html import format_html

from .models import Project, ProjectStatus


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "status_badge", "price_display", "created_at", "updated_at", "total_projects")
    list_filter = ("status", "created_at")
    search_fields = ("title", "slug", "description")
    prepopulated_fields = {'slug': ('title',)}
    list_per_page = 25
    list_editable = []
    date_hierarchy = 'created_at'
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description')
        }),
        ('Project Details', {
            'fields': ('thumbnail', 'price')
        }),
        ('Status', {
            'fields': ('status',),
        }),
        ('Metadata', {
            'fields': ('metadata', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        colors = {
            ProjectStatus.DRAFT: ('#6b7280', 'Draft'),
            ProjectStatus.PUBLISHED: ('#10b981', 'Published'),
            ProjectStatus.ARCHIVED: ('#ef4444', 'Archived'),
        }
        color, label = colors.get(obj.status, ('#6b7280', obj.status))
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">{}</span>',
            color, label
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'
    
    def price_display(self, obj):
        if obj.price and obj.price > 0:
            return format_html('<strong style="color: #2563eb;">₹{}</strong>', int(obj.price))
        return format_html('<span style="color: #10b981; font-weight: bold;">FREE</span>')
    price_display.short_description = 'Price'
    price_display.admin_order_field = 'price'
    
    def total_projects(self, obj):
        return Project.objects.filter(status=ProjectStatus.PUBLISHED).count()
    total_projects.short_description = 'Published'

