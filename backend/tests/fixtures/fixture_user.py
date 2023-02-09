import pytest

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def client():
    return APIClient()


@pytest.fixture
def user(client):

    payload = {
        'username': 'HarryPottah2014',
        'email': 'HP2014@gmail.com',
        'password': 'pass1234'
    }

    response = client.post('/api/users/', payload)

    return response.data


@pytest.fixture
def user_client(user, client):

        payload = {
            'username': 'HarryPottah2014',
            'password': 'pass1234',
        }

        response = client.post('/api/auth/token/login/', payload)

        client.credentials(HTTP_AUTHORIZATION=f'Token {response.data.get("auth_token")}')

        return client
