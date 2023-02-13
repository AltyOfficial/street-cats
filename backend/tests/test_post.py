import os
import pytest

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from posts.models import Post, Season
from users.models import Follow, Profile

User = get_user_model()


@pytest.mark.django_db
def test_post_create(user_client, season):
    """
    Проверка, что создание поста успешно проходит
    со всеми нужными заполненными полями.
    """

    client = APIClient()

    payload = {
        'caption': 'test title',
        'image': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAgMA'
                  'AABieywaAAAACVBMVEUAAAD///9fX1/S0ecCAAAACXBIWXMAAA7EAAAOxA'
                  'GVKw4bAAAACklEQVQImWNoAAAAggCByxOyYQAAAABJRU5ErkJggg==',
        'season': 'Winter',
        'feeded': True,
        'meeted_at': 'Outdoors',
    }

    assert Post.objects.count() == 0

    response = client.post('/api/v1/posts/', payload)

    assert response.status_code == 401

    response = user_client.post('/api/v1/posts/', payload)

    assert response.status_code == 201
    assert Post.objects.count() == 1
    assert response.data['image'].startswith('http') is True

    post = Post.objects.get(id=response.data['id'])

    os.remove(post.image.path)


@pytest.mark.django_db
def test_post_list(few_posts, client):
    """Проверка доступа к списку постов."""

    response = client.get('/api/v1/posts/')

    assert response.status_code == 200
    assert response.data['count'] == 10
    assert response.data['next'] is not None
    assert response.data['previous'] is None

    response = client.get('/api/v1/posts/?page=2')

    assert response.data['next'] is None
    assert response.data['previous'] is not None
    assert response.data['results'] is not None


@pytest.mark.django_db
def test_post_detail(post_by_author, user_client, post_by_another_user):
    """
    Проверка доступа к конкретному посту
    и возможность его редактировать от имени автора поста.
    """

    client = APIClient()

    assert Post.objects.count() == 2

    response = user_client.get('/api/v1/posts/1/')

    assert response.status_code == 200
    assert response.data['author']['username'] == 'HarryPottah2014'
    assert response.data['caption'] == 'test post 1'

    response = user_client.get('/api/v1/posts/2/')

    assert response.status_code == 200
    assert response.data['author']['username'] == 'TestUser'

    # At this moment rating is 0
    rating = response.data['rating']

    user_client.post('/api/v1/posts/2/upvote/')
    response = user_client.get('/api/v1/posts/2/')

    assert int(response.data['rating']) == int(rating) + 1

    user_client.delete('/api/v1/posts/2/upvote/')
    response = user_client.get('/api/v1/posts/2/')

    assert int(response.data['rating']) == int(rating)

    user_client.post('/api/v1/posts/2/downvote/')
    response = user_client.get('/api/v1/posts/2/')

    assert int(response.data['rating']) == int(rating) - 1

    user_client.delete('/api/v1/posts/2/downvote/')
    response = user_client.get('/api/v1/posts/2/')

    assert int(response.data['rating']) == int(rating)

    payload = {
        'caption': 'updated post 1'
    }

    response = user_client.patch('/api/v1/posts/2/', payload)

    assert response.status_code == 403

    response = user_client.patch('/api/v1/posts/1/', payload)

    assert response.status_code == 200
    assert response.data['caption'] == 'updated post 1'
    assert Post.objects.count() == 2

    response = user_client.delete('/api/v1/posts/1/')

    assert response.status_code == 204
    assert Post.objects.count() == 1





