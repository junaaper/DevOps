from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ArticleViewSet, health_check

router = DefaultRouter()
router.register(r'articles', ArticleViewSet)

urlpatterns = [
    path('health', health_check),
    path('', include(router.urls)),
]