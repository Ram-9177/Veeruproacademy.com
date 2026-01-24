from django.urls import path

from . import views

app_name = "academy_web"

urlpatterns = [
    path("", views.home, name="home"),
    path("signup/", views.signup_view, name="signup"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("password-reset/", views.password_reset_request, name="password_reset_request"),
    path("password-reset-confirm/<str:uidb64>/<str:token>/", views.password_reset_confirm, name="password_reset_confirm"),
    path("courses/", views.course_list, name="course_list"),
    path("courses/<slug:slug>/", views.course_detail, name="course_detail"),
    path("courses/<slug:slug>/enroll/", views.course_enroll, name="course_enroll"),
    path("courses/<slug:slug>/payment-proof/", views.course_payment_proof, name="course_payment_proof"),
    path("courses/<slug:course_slug>/lesson/<slug:lesson_slug>/", views.lesson_view, name="lesson_view"),
    path("courses/<slug:course_slug>/lesson/<slug:lesson_slug>/complete/", views.mark_lesson_complete, name="mark_lesson_complete"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("projects/", views.projects_list, name="projects_list"),
    path("projects/<slug:slug>/", views.project_detail, name="project_detail"),
    path("about/", views.about, name="about"),
    path("contact/", views.contact, name="contact"),
    path("faq/", views.faq, name="faq"),
    path("careers/", views.careers, name="careers"),
    path("blog/", views.blog, name="blog"),
    path("privacy/", views.privacy, name="privacy"),
    path("terms/", views.terms, name="terms"),
    path("refund-policy/", views.refund_policy, name="refund_policy"),
    path("feedback/", views.feedback, name="feedback"),
]
