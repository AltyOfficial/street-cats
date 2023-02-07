from django.contrib.auth import get_user_model
from django_filters import rest_framework as django_filters
from posts.models import Post, Season

User = get_user_model()


class PostFilter(django_filters.FilterSet):
    """Post Filter."""

    author = django_filters.ModelMultipleChoiceFilter(
        queryset=User.objects.all(),
        field_name='author__username',
        to_field_name='username',
    )
    season = django_filters.ModelMultipleChoiceFilter(
        queryset=Season.objects.all(),
        field_name='season__slug',
        to_field_name='slug',
    )
    place = django_filters.MultipleChoiceFilter(
        choices=Post.CHOICES,
        field_name='meeted_at',
    )

    class Meta:
        model = Post
        fields = ['author', 'season', 'place']
