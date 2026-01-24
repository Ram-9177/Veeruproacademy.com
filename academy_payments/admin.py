from django.contrib import admin
from django.utils.html import format_html

from .models import Entitlement, PaymentProofSubmission, ProofStatus
from .services import approve_course_payment_proof, reject_payment_proof


@admin.action(description="✅ Approve selected proofs")
def approve_selected(modeladmin, request, queryset):
    approved = 0
    for submission in queryset.select_related("course", "user").filter(status=ProofStatus.PENDING):
        approve_course_payment_proof(submission=submission, admin_user=request.user)
        approved += 1
    modeladmin.message_user(request, f"Successfully approved {approved} payment proof(s).")


@admin.action(description="❌ Reject selected proofs")
def reject_selected(modeladmin, request, queryset):
    rejected = 0
    for submission in queryset.select_related("course", "user").filter(status=ProofStatus.PENDING):
        reject_payment_proof(submission=submission, admin_user=request.user)
        rejected += 1
    modeladmin.message_user(request, f"Rejected {rejected} payment proof(s).")


@admin.register(PaymentProofSubmission)
class PaymentProofSubmissionAdmin(admin.ModelAdmin):
    list_display = ("id", "user_email", "product_type", "status_badge", "course", "amount_display", "submitted_at", "reviewed_at")
    list_filter = ("status", "product_type")
    search_fields = ("user__email", "user__name", "course__slug", "course__title")
    actions = [approve_selected, reject_selected]
    readonly_fields = ("submitted_at", "reviewed_at", "reviewed_by")
    list_per_page = 20
    date_hierarchy = 'submitted_at'
    ordering = ['-submitted_at']
    list_select_related = ['user', 'course', 'reviewed_by']
    
    fieldsets = (
        ('Submission Details', {
            'fields': ('user', 'product_type', 'course', 'project')
        }),
        ('Payment Information', {
            'fields': ('amount', 'proof_file', 'proof_url', 'notes')
        }),
        ('Status', {
            'fields': ('status', 'admin_notes', 'submitted_at', 'reviewed_at', 'reviewed_by')
        }),
    )
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'
    
    def status_badge(self, obj):
        colors = {
            ProofStatus.PENDING: ('#f59e0b', 'Pending'),
            ProofStatus.APPROVED: ('#10b981', 'Approved'),
            ProofStatus.REJECTED: ('#ef4444', 'Rejected'),
        }
        color, label = colors.get(obj.status, ('#6b7280', obj.status))
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">{}</span>',
            color, label
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'
    
    def amount_display(self, obj):
        return format_html('<strong>₹{}</strong>', int(obj.amount) if obj.amount else 0)
    amount_display.short_description = 'Amount'
    amount_display.admin_order_field = 'amount'


@admin.register(Entitlement)
class EntitlementAdmin(admin.ModelAdmin):
    list_display = ("user_email", "product_type", "course", "project", "source_badge", "granted_at")
    list_filter = ("product_type", "source")
    search_fields = ("user__email", "user__name", "course__slug", "project__slug")
    list_per_page = 25
    date_hierarchy = 'granted_at'
    ordering = ['-granted_at']
    list_select_related = ['user', 'course', 'project']
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User'
    user_email.admin_order_field = 'user__email'
    
    def source_badge(self, obj):
        colors = {
            'PAYMENT': '#10b981',
            'ADMIN': '#8b5cf6',
            'PROMO': '#f59e0b',
        }
        color = colors.get(obj.source, '#6b7280')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 12px; font-size: 11px;">{}</span>',
            color, obj.source
        )
    source_badge.short_description = 'Source'
