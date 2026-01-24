"""
URL configuration for academy project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.http import HttpResponse
from django.shortcuts import render
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static

# Configure Admin Site
admin.site.site_header = getattr(settings, 'ADMIN_SITE_HEADER', "Veeru's Pro Academy Admin")
admin.site.site_title = getattr(settings, 'ADMIN_SITE_TITLE', "VPA Admin Portal")
admin.site.index_title = getattr(settings, 'ADMIN_INDEX_TITLE', "Welcome to the Admin Dashboard")
admin.site.site_url = "/"  # Link to view site


def web_health(_request):
    return HttpResponse('ok', content_type='text/plain')


def custom_404(request, exception):
    return render(request, '404.html', status=404)


def custom_500(request):
    return render(request, '500.html', status=500)


urlpatterns = [
    path('healthz/', web_health),
    path('admin/', admin.site.urls),
    path('api/', include('academy_api.urls')),
    path('i18n/', include('django.conf.urls.i18n')),
    path('', include('academy_web.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    # Debug toolbar
    try:
        import debug_toolbar
        urlpatterns = [path('__debug__/', include(debug_toolbar.urls))] + urlpatterns
    except ImportError:
        pass
    # Silk profiling
    try:
        urlpatterns += [path('silk/', include('silk.urls', namespace='silk'))]
    except ImportError:
        pass


# Custom error handlers
handler404 = 'academy.urls.custom_404'
handler500 = 'academy.urls.custom_500'
