from django.contrib.auth import get_user_model
from django.db import models


User = get_user_model()


class Season(models.Model):
    """Seasong for creating a post."""

    title = models.CharField(verbose_name='title', max_length=255, unique=True)
    color = models.CharField(verbose_name='color', max_length=7,)
    slug = models.SlugField(verbose_name='slug', max_length=50, unique=True)

    class Meta:
        ordering = ('title',)
        verbose_name = 'Season'
        verbose_name_plural = 'Seasons'

    def __str__(self):
        return self.title


class Post(models.Model):
    """Post Model."""

    CHOICES = (
        ('Outdoors', 'Outdoors'),
        ('Indoors', 'Indoors'),
        ('Mixed', 'Mixed')
    )

    author = models.ForeignKey(
        User, verbose_name='author',
        on_delete=models.CASCADE, related_name='posts'
    )
    caption = models.CharField(max_length=200, verbose_name='caption')
    text = models.TextField(verbose_name='text', blank=True)
    image = models.ImageField(verbose_name='image', upload_to='posts/images/',)
    meeted_at = models.CharField(max_length=20, choices=CHOICES)
    season = models.ForeignKey(
        Season, verbose_name='season', on_delete=models.SET_NULL,
        related_name='posts', null=True
    )
    feeded = models.BooleanField(default=False)
    upvotes = models.ManyToManyField(
        User, related_name='posts_upvoted', blank=True
    )
    downvotes = models.ManyToManyField(
        User, related_name='posts_downvoted', blank=True
    )
    pub_date = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ('-pub_date',)
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    def __str__(self):
        return self.caption
