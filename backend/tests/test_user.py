import os
import pytest

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.mark.django_db
def test_get_user_me(user_client):
    """
    Проверка, что запрос от авторизованного пользователя
    возвращает информацию о текущем пользователе.
    """

    response = user_client.get('/api/users/me/')

    data = response.data
    print(response.data)
    
    assert response.status_code == 200
    assert 'username' in data and 'email' in data
    assert data['profile'] is not None
    assert data['profile']['cats_meeted'] == 0


@pytest.mark.django_db
def test_user_set_password(user_client):
    """
    Проверка, что авторизованный пользователь может успешно поменять пароль,
    так же проверка, что с неверным старым паролем пароль не меняется.
    """

    payload = {
        'current_password': 'WRONGPASSWORD',
        'new_password': 'new_pass'
    }

    response = user_client.post('/api/users/set_password/', payload)

    assert response.status_code == 400

    payload = {
        'current_password': 'pass1234',
        'new_password': 'new_pass'
    }

    response = user_client.post('/api/users/set_password/', payload)

    assert response.status_code == 204

@pytest.mark.django_db
def test_user_list(user, user_client):
    """
    Проверка, что список пользователей доступен авторизованному пользователю,
    а неавторизованному - недоступен.
    """

    client = APIClient()

    response = client.get('/api/users/')

    assert response.status_code == 401

    response = client.get('/api/users/1/')

    assert response.status_code == 401

    response = user_client.get('/api/users/')

    assert response.status_code == 200

    response = user_client.get('/api/users/1/')

    assert response.status_code == 200

    response = user_client.get('/api/users/0/')

    assert response.status_code == 404


@pytest.mark.django_db
def test_user_update(user, user_client):
    """
    Проверка, что текущий авторизованный пользователь может редактировать свой
    профиль, чужие - не может.
    """

    User.objects.create_user(
        id=2,
        username='username',
        email='email',
        password='pass1234'
    )

    payload = {
        'username': 'newHarryPottah'
    }

    response = user_client.patch('/api/users/1/', payload)

    assert response.status_code == 200

    user = User.objects.get(id=1)

    assert user.profile.picture.name == ''
    assert user.username == 'newHarryPottah'

    response = user_client.patch('/api/users/2/', payload)

    assert response.status_code == 403

    payload = {
        'picture': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAgMA'
                   'AABieywaAAAACVBMVEUAAAD///9fX1/S0ecCAAAACXBIWXMAAA7EAAAOxA'
                   'GVKw4bAAAACklEQVQImWNoAAAAggCByxOyYQAAAABJRU5ErkJggg=='
    }

    response = user_client.patch('/api/users/change_profile_picture/', payload)

    assert response.status_code == 200

    user = User.objects.get(id=1)

    assert user.profile.picture != ''

    os.remove(user.profile.picture.path)
