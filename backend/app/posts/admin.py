from django.contrib import admin

from .forms import SeasonForm
from .models import Post, Season


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    empty_value_display = '-empty-'


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    form = SeasonForm
    empty_value_display = '-empty-'
