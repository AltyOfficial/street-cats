from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.generic import TemplateView
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework.permissions import AllowAny

from .settings import BASE_DIR



urlpatterns = [
    path(  # new
        'redoc/',
        TemplateView.as_view(
            template_name='docs/redoc.html',
        ),
        name='redoc'),
    path('swagger-ui/', TemplateView.as_view(
        template_name='docs/swaggerui.html',
    ), name='swagger-ui'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/', include('users.urls')),
    path('api/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken')),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
