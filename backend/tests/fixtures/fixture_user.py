import pytest

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def user():
    return User.objects.create_user(
        username='HarryPottah2014',
        email='GARRI@POTNIY.COM',
        password='pass1234'
    )


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def auth_client(user, client):

        payload = {
            'username': 'HarryPottah2014',
            'password': 'pass1234',
        }

        response = client.post('/api/auth/token/login/', payload)

        client.credentials(HTTP_AUTHORIZATION=f'{response.data.get("auth_token")}')

        return client
