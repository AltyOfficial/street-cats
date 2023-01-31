from django.contrib import admin

from .forms import SeasonForm
from .models import Post, Season


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'author', 'caption', 'meeted_at', 'season', 'pub_date'
    )
    empty_value_display = '-empty-'


@admin.register(Season)
class SeasonAdmin(admin.ModelAdmin):
    form = SeasonForm
    empty_value_display = '-empty-'
