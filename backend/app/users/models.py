from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """User Model."""

    REQUIRED_FIELDS = ['email']

    class Meta:
        ordering = ['id']
        verbose_name = 'User'
        verbose_name_plural = 'Users'


class Profile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE
    )
    picture = models.ImageField(
        upload_to='users/profile_pictures/',
        blank=True, null=True
    )
    cats_meeted = models.IntegerField()
    cats_feeded = models.IntegerField()
    created = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ('-created',)
        verbose_name = 'Profile'
        verbose_name_plural = 'Profiles'
    
    def __str__(self) -> str:
        return self.user.username
