import pytest


@pytest.mark.django_db
def test_user_signup(client):
    """
    Тест на регистрацию пользователя, 
    проверка того, что модель профиля создается после регистрации.
    """

    payload = {
        'username': 'HarryPottah2014',
        'email': 'HP2014@gmail.com',
        'password': 'pass1234'
    }

    response = client.post('/api/users/', payload)

    data = response.data

    assert response.status_code == 201
    assert data.get('username') == 'HarryPottah2014'
    assert data.get('email') == 'HP2014@gmail.com'
    assert 'password' not in data
    assert data.get('profile') is not None

@pytest.mark.django_db
def test_user_login(user, client):
    """Тест на аутентификацию пользователя и получение токена."""

    payload = {
        'username': 'HarryPottah2014',
        'password': 'pass1234',
    }

    response = client.post('/api/auth/token/login/', payload)

    assert response.status_code == 200
    assert 'auth_token' in response.data


@pytest.mark.django_db
def test_user_login_failure(user, client):
    """Тест на аутентификацию пользователя с неверными данными."""

    payload = {
        'username': 'WRONGUSERNAME',
        'password': 'pass1234',
    }

    response = client.post('/api/auth/token/login/', payload)

    assert response.status_code == 400


@pytest.mark.django_db
def test_user_logout(user_client):
    """
    Проверка, что авторизованный пользователь успешно разлогинился
    """

    response = user_client.post('/api/auth/token/logout/')

    assert response.status_code == 204
