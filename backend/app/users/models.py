from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """User Model."""

    email = models.EmailField(max_length=255, unique=True, blank=False)

    REQUIRED_FIELDS = ['email']

    class Meta:
        ordering = ['id']
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return self.username


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name='profile'
    )
    picture = models.ImageField(
        upload_to='users/profile_pictures/',
        blank=True, null=True
    )
    cats_meeted = models.IntegerField()
    cats_feeded = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created']
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'

    def __str__(self):
        return self.user.username


class Follow(models.Model):
    follower = models.ForeignKey(
        User, verbose_name='follower',
        on_delete=models.CASCADE, related_name='follower'
    )
    author = models.ForeignKey(
        User, verbose_name='author',
        on_delete=models.CASCADE, related_name='following'
    )
    created = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['follower']
        verbose_name = 'Follow'
        verbose_name_plural = 'Follows'

    def __str__(self):
        return self.created
