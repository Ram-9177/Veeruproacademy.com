from django.contrib import admin
from django.utils.html import format_html

from .models import Course, CourseCategory, Lesson, Module, ContentStatus


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0
    fields = ['order', 'title', 'status', 'estimated_minutes']
    ordering = ['order']


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 0
    fields = ['order', 'title', 'slug']
    ordering = ['order']
    show_change_link = True


@admin.register(CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order', 'course_count', 'created_at']
    search_fields = ['name', 'slug', 'description']
    ordering = ['order', 'name']
    prepopulated_fields = {'slug': ('name',)}
    list_per_page = 25
    list_editable = ['order']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Category Info', {
            'fields': ('name', 'slug', 'description', 'order')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def course_count(self, obj):
        count = obj.courses.count()
        return format_html('<span style="background: #e3f2fd; padding: 2px 6px; border-radius: 3px;">{}</span>', count)
    course_count.short_description = 'Courses'


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ['title', 'status_badge', 'category', 'price_display', 'level', 'module_count', 'lesson_count', 'order', 'created_at']
    list_filter = ['status', 'level', 'category', 'created_at', 'published_at']
    search_fields = ['title', 'slug', 'description']
    ordering = ['order', 'title']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['order']
    list_per_page = 20
    inlines = [ModuleInline]
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'description', 'category', 'instructor')
        }),
        ('Course Details', {
            'fields': ('level', 'duration', 'price', 'thumbnail')
        }),
        ('Status & Ordering', {
            'fields': ('status', 'order'),
            'classes': ('collapse',)
        }),
    )
    
    def status_badge(self, obj):
        colors = {
            'DRAFT': 'gray',
            'PUBLISHED': 'green',
            'ARCHIVED': 'red'
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">{}</span>',
            {'gray': '#6b7280', 'green': '#10b981', 'red': '#ef4444'}[color],
            obj.status
        )
    status_badge.short_description = 'Status'
    
    def price_display(self, obj):
        if obj.price and obj.price > 0:
            return format_html('<strong>₹{}</strong>', int(obj.price))
        return format_html('<span style="color: #10b981; font-weight: bold;">FREE</span>')
    price_display.short_description = 'Price'
    
    def module_count(self, obj):
        return obj.modules.count()
    module_count.short_description = 'Modules'
    
    def lesson_count(self, obj):
        return Lesson.objects.filter(module__course=obj).count()
    lesson_count.short_description = 'Lessons'


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ['title', 'course', 'lesson_count', 'order']
    list_filter = ['course']
    search_fields = ['title', 'slug', 'course__title']
    ordering = ['course', 'order']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['order']
    list_select_related = ['course']
    inlines = [LessonInline]
    
    def lesson_count(self, obj):
        return obj.lessons.count()
    lesson_count.short_description = 'Lessons'


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'status_badge', 'module', 'has_video', 'estimated_minutes', 'order']
    list_filter = ['status', 'module']
    search_fields = ['title', 'slug', 'module__title']
    ordering = ['module', 'order']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['order']
    list_per_page = 30
    list_select_related = ['module']
    
    def status_badge(self, obj):
        colors = {
            'DRAFT': 'gray',
            'PUBLISHED': 'green',
            'ARCHIVED': 'red'
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">{}</span>',
            {'gray': '#6b7280', 'green': '#10b981', 'red': '#ef4444'}[color],
            obj.status
        )
    status_badge.short_description = 'Status'
    
    def has_video(self, obj):
        if obj.youtube_url:
            return format_html('<span style="color: #ef4444;">▶</span> Yes')
        return '—'
    has_video.short_description = 'Video'
