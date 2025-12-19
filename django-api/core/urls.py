from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'dashboards', views.DashboardViewSet)
router.register(r'widgets', views.WidgetViewSet)

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/profile/', views.ProfileView.as_view(), name='profile'),
    path('', include(router.urls)),
]