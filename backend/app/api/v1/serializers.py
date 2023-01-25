from django.contrib.auth import get_user_model
from rest_framework import serializers

from posts.models import Post, Season
from users.models import Follow, Profile
from utils.fields import Base64ImageField


User = get_user_model()


class ProfileSeriazlizer(serializers.ModelSerializer):
    """Profile serailizer for display only."""

    followers = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = (
            'picture', 'cats_meeted', 'cats_feeded', 'created', 'followers'
        )

    def get_followers(self, obj):
        return Follow.objects.filter(author=obj.user).count()


class UserSerializer(serializers.ModelSerializer):
    """Main User Serializer."""

    profile = ProfileSeriazlizer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'profile', 'password'
        )
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        Profile.objects.create(user=user, cats_meeted=0, cats_feeded=0)

        return user


class PostCreationSerializer(serializers.ModelSerializer):
    """Seraizlier for creating a post."""

    author = UserSerializer(read_only=True)
    season = serializers.CharField(required=True)
    image = Base64ImageField()
    feeded = serializers.BooleanField(required=True)
    rating = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id', 'author', 'caption', 'text', 'image', 'season', 'feeded',
            'meeted_at', 'season', 'pub_date', 'rating'
        )
        read_only_fields = ('author', 'pub_date')

    def create(self, validated_data):
        author = self.context.get('request').user
        profile = Profile.objects.get(user=author)
        profile.cats_meeted += 1

        if validated_data.get('feeded') is True:
            profile.cats_feeded += 1

        profile.save()

        season_input = validated_data.pop('season')

        try:
            season = Season.objects.get(title=season_input)
        except Season.DoesNotExist:
            raise serializers.ValidationError('no such season.')

        post = Post.objects.create(
            author=author, season=season, **validated_data
        )
        return post
    
    def update(self, instance, validated_data):
        season_input = validated_data.pop('season')
        validated_data['season'] = Season.objects.get(title=season_input)
        return super().update(instance, validated_data)
    
    def get_rating(self, obj):
        return str(obj.upvotes.count() - obj.downvotes.count())
