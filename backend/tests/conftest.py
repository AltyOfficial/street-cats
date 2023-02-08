import pytest


pytest_plugins = [
    'tests.fixtures.fixture_data',
    'tests.fixtures.fixture_user',
]

# @pytest.fixture
# def user(user_model):
#     return user_model.objects.create_user(
#         username='HarryPottah2014',
#         email='GARRI@POTNIY.COM',
#         password='pass1234'
#     )