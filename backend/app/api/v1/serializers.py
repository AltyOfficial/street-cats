import os

from django.contrib.auth import get_user_model, password_validation
from rest_framework import serializers

from posts.models import Post, Season
from users.models import Follow, Profile
from utils.fields import Base64ImageField


User = get_user_model()


class ProfileSeriazlizer(serializers.ModelSerializer):
    """Profile serailizer for display only."""

    picture = Base64ImageField(required=False)
    cats_meeted = serializers.IntegerField(read_only=True)
    cats_feeded = serializers.IntegerField(read_only=True)
    followers = serializers.SerializerMethodField()
    following_you = serializers.SerializerMethodField()
    
    class Meta:
        model = Profile
        fields = (
            'picture', 'cats_meeted', 'cats_feeded',
            'created', 'followers', 'following_you'
        )

    def get_followers(self, obj):
        return Follow.objects.filter(author=obj.user).count()
    
    def get_following_you(self, obj):
        return Follow.objects.filter(
            follower=obj.user, author=self.context.get('request').user.id
        ).exists()
    
    def update(self, instance, validated_data):

        if instance.picture != '':
            os.remove(instance.picture.path)

        return super().update(instance, validated_data)


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

        if len(validated_data.get('password')) < 8:
            raise serializers.ValidationError(
                'Passowrd is too short. It must contain at least 8 symbols.'
            )

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
        if 'season' in validated_data:
            season_input = validated_data.pop('season')
            validated_data['season'] = Season.objects.get(title=season_input)
        return super().update(instance, validated_data)
    
    def get_rating(self, obj):
        return str(obj.upvotes.count() - obj.downvotes.count())


class ChangePassowrdValidator(serializers.Serializer):
    """Change user's password."""

    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        password_validation.validate_password(value)
        return value
