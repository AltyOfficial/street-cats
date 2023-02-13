import pytest

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from users.models import Profile

User = get_user_model()


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def user(client):
    user = User.objects.create_user(
        id=1,
        username='HarryPottah2014',
        email='HP2014@gmail.com',
        password='pass1234'
    )

    Profile.objects.create(user=user, cats_meeted=0, cats_feeded=0)

    return user


@pytest.fixture
def another_user():
    user = User.objects.create_user(
        id=2,
        username='TestUser01',
        email='test@user01.com',
        password='pass1234'
    )

    Profile.objects.create(user=user, cats_meeted=0, cats_feeded=0)

    return user


@pytest.fixture
def user_client(user, client):

        payload = {
            'username': 'HarryPottah2014',
            'password': 'pass1234',
        }

        response = client.post('/api/auth/token/login/', payload)

        client.credentials(HTTP_AUTHORIZATION=f'Token {response.data.get("auth_token")}')

        return client
