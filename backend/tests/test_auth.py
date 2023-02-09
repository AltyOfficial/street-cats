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

    assert response.status_code == 201, (
        'Код в ответе должен быть 201 Created.'
    )
    assert data.get('username') == payload['username'], (
        'Поле `username` должно быть в ответе пользователю.'
    )
    assert data.get('email') == payload['email'], (
        'Поле `email` должно быть в ответе пользователю.'
    )
    assert 'password' not in data, (
        'Пароль не должен отображаться в ответе пользователю.'
    )
    assert data.get('profile') is not None, (
        'Модель профиля должна создаваться после регистрации пользователя.'
    )

@pytest.mark.django_db
def test_user_login(user, client):
    """Тест на аутентификацию пользователя и получение токена."""

    payload = {
        'username': 'HarryPottah2014',
        'password': 'pass1234',
    }

    response = client.post('/api/auth/token/login/', payload)

    assert response.status_code == 200, (
        'При успешной авторизации пользователю должен отправляться код 200.'
    )
    assert 'auth_token' in response.data, (
        'Пользователь должен получать в ответе Токен для аутентификации.'
    )


@pytest.mark.django_db
def test_user_login_failure(user, client):
    """Тест на аутентификацию пользователя с неверными данными."""

    payload = {
        'username': 'WRONGUSERNAME',
        'password': 'pass1234',
    }

    response = client.post('/api/auth/token/login/', payload)

    assert response.status_code == 400, (
        'Пользователю, который ввел неверные данные, '
        'должен возвращаться код 400.'
    )


@pytest.mark.django_db
def test_user_logout(user_client):
    """
    Проверка, что авторизованный пользователь успешно разлогинился
    """

    response = user_client.post('/api/auth/token/logout/')

    assert response.status_code == 204, (
        'При успешном выходе должен возвращаться код 204.'
    )