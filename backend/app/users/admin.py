from django.contrib import admin

from .models import Follow, Profile, User


@admin.register(Follow)
class FollowAdmin(admin.ModelAdmin):
    list_display = ('pk', 'follower', 'author',)
    empty_value_display = '-empty-'


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('pk', 'user', 'picture', 'created',)
    empty_value_display = '-empty-'


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email',)
    empty_value_display = '-empty-'
