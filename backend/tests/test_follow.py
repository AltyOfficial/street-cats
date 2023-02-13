import os
import pytest

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()


@pytest.mark.django_db
def test_follow(user_client, another_user):
    """
    Проверка, что авторизованный пользователь может подписаться на другого
    авторизованного пользователя (но не на себя), так же проверка,
    что пользователь может посмотреть список своих подписок.
    """

    response = user_client.get('/api/users/subscriptions/')

    assert response.status_code == 200
    assert len(response.data) == 0

    response = user_client.post('/api/users/2/follow/')

    assert response.status_code == 201
    assert response.data == "you followed TestUser01"

    response = user_client.get('/api/users/subscriptions/')

    assert len(response.data) == 1

    response = user_client.delete('/api/users/2/follow/')

    assert response.status_code == 204
    assert response.data == "you unfollowed TestUser01"

    response = user_client.get('/api/users/subscriptions/')

    assert len(response.data) == 0
