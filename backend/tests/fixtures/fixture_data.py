import pytest

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from posts.models import Post, Season

User = get_user_model()


@pytest.fixture
def season():
    season = Season.objects.create(
        title='Winter',
        color='#000111',
        slug='winter'
    )

    return season


@pytest.fixture
def post_by_author(season, user):
    post = Post.objects.create(
        id=1,
        author=user,
        caption='test post 1',
        text='some text',
        image='data:image/png;base64,iVBORw0KG',
        season=season,
        feeded=False,
        meeted_at='Indoors'
    )

    return post


@pytest.fixture
def post_by_another_user(season):
    user = User.objects.create_user(
        username='TestUser',
        email='test@user.com',
        password='pass1234'
    )

    post = Post.objects.create(
        id=2,
        author=user,
        caption='test post 2',
        text='some text',
        image='data:image/png;base64,iVBORw0KG',
        season=season,
        feeded=False,
        meeted_at='Indoors'
    )

    return post


@pytest.fixture
def few_posts(season, user):
    for _ in range (10):
        post = Post.objects.create(
            author=user,
            caption='test post',
            text='some text',
            image='data:image/png;base64,iVBORw0KG',
            season=season,
            feeded=False,
            meeted_at='Indoors'
        )

    return post
