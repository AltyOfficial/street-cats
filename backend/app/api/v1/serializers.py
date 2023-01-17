from django.contrib.auth import get_user_model
from rest_framework import serializers

from posts.models import Post, Season
from users.models import Follow, Profile, User
from utils.fields import Base64ImageField


User = get_user_model()


class ProfileSeaizlizrt(serializers.ModelSerializer):
    pass


class PostCreationSerializer(serializers.ModelSerializer):
    """Сериализатор для модели поста."""

    season = serializers.PrimaryKeyRelatedField(
        queryset=Season.objects.all()
    )
    image = Base64ImageField()
    feeded = serializers.BooleanField(required=True)

    class Meta:
        model = Post
        fields = (
            'author', 'caption', 'text', 'image', 'season', 'feeded',
            'meeted_at', 'season', 'pub_date'
        )
        read_only_fields = ('author', 'pub_date')

    def create(self, validated_data):
        author = self.context.get('request').user
        post = Post.objects.create(author=author, **validated_data)
        return post