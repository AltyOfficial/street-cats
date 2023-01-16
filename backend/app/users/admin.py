from django.contrib import admin

from .models import Follow, Profile, User


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    empty_value_display = '-empty-'


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    empty_value_display = '-empty-'


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    empty_value_display = '-empty-'

