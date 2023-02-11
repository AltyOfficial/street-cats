import pytest

from django.contrib.auth import get_user_model

from posts.models import Post, Season
from users.models import Follow, Profile

User = get_user_model()


@pytest.mark.django_db
def test_post_create(user_client, season):
    """
    Проверка, что создание поста успешно проходит
    со всеми нужными заполненными полями.
    """

    payload = {
        'caption': 'test title',
        'image': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAgMA'
                  'AABieywaAAAACVBMVEUAAAD///9fX1/S0ecCAAAACXBIWXMAAA7EAAAOxA'
                  'GVKw4bAAAACklEQVQImWNoAAAAggCByxOyYQAAAABJRU5ErkJggg==',
        'season': 'Winter',
        'feeded': True,
        'meeted_at': 'Outdoors',
    }

    response = user_client.post('/api/v1/posts/', payload)

    assert response.data == 'hey'