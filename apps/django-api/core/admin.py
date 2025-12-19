from django.contrib import admin
from .models import User, Dashboard, Widget


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']


@admin.register(Dashboard)
class DashboardAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'owner__email']


@admin.register(Widget)
class WidgetAdmin(admin.ModelAdmin):
    list_display = ['name', 'widget_type', 'dashboard', 'is_active', 'created_at']
    list_filter = ['widget_type', 'is_active', 'created_at']
    search_fields = ['name', 'dashboard__name']