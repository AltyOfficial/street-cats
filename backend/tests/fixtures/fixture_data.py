import pytest

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from posts.models import Season

User = get_user_model()


@pytest.fixture
def season():
        season = Season.objects.create(
            title='Winter',
            color='#000111',
            slug='winter'
        )

        return season
