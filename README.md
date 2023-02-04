<a href="mailto:alty.official.prim@gmail.com" target="blank"><img align="center" bgcolor="white" src="https://raw.githubusercontent.com/AltyOfficial/street-cats/4a3e2f696f2c80833a01ba9a9fe2b66eef4792b2/backend/media/StreetCatsLogo.svg" alt="StreetCatsLogo" width="480" /></a>

# SPA Проект с уличными котиками Street Cats

## К проекту написана документация на Redoc. Расположена по адресу:

```http://127.0.0.1:8000/redoc/``` - при развертывании локально
<br>
```http://127.0.0.1/redoc/``` - при развертывании в контейнерах Docker

<hr>

В проекте можно делиться историями и изображениями встреченных котиков (не своих), подписываться на других авторов, оценивать посты. В профиле каждого пользователя ведется статистика по встреченным и покормленным котикам. Можно фильтровать посты по месту встречи котика, автору и времени года. У списка постов реализована пагинация и фильтрация по автору, месту встречи котика и времени года.

P.S. В клиентской части React функционал ограничен, подробнее об этом в конце файла README. 

<hr>

### В проекте используется база данных PostgreSQL, при необходимости следует изменить файл ```.env``` в директории ```/infra/```

<hr>

<br>

## Интсрументы и технологии
![](https://img.shields.io/badge/python-3.11-blue)
![](https://img.shields.io/badge/django-4.1.5-yellowgreen)
![](https://img.shields.io/badge/django--rest--framework-3.14-important)
![](https://img.shields.io/badge/djoser-2.1.0-green)
![](https://img.shields.io/badge/gunicorn-20.1-%20%2320bdb0)
![](https://img.shields.io/badge/psycopg2--binary-2.9.5-%20%235220bd)
![](https://img.shields.io/badge/node-16.19.0-%20%23de45d9)
![](https://img.shields.io/badge/docker-20.10.22-%20%232a37a3)
![](https://img.shields.io/badge/nginx-1.23.3-%20%23a17828)

<hr>

## Установка проекта локально
#### Клонировать проект
```sh
git clone https://github.com/AltyOfficial/street-cats.git
```
#### Создать и установить виртуальное окружение
```sh
python -m venv venv
source venv/Scripts/activate
```
#### Перейти в директорию с backend частью проекта и установить зависимости
```sh
cd backend/
pip install -r requirements.txt
```
#### Перейти в директорию с manage.py, выполнить миграции и загрузить данные в базу, запустить веб-сервер
```sh
cd app/
python manage.py makemigrations
python manage.py migrate
python manage.py load_seasons
python manage.py runserver
```
#### Backend часть проекта будет доступна по адресу http://127.0.0.1:8000/ и http://localhost:8000/

<hr>
<br>

#### Открыть второе окно терминала, из базовой директории перейти в директорию с Frontend частью, запустить сервер
```sh
cd frontend/
npm start
```

#### Frontend часть проекта будет доступна по адресу http://localhost:3000/

<hr>
<br>

## Установка проекта в Docker контейнерах
#### В файле "```App.js```" по адресу ```frontend/src/``` изменить 12-ю строку с 
"```const BASE_URL = 'http://127.0.0.1:8000/'```"
<br>
 на "```const BASE_URL = 'http://127.0.0.1/'```"
- BASE_URL используется с портом 8000 по умолчанию для запуска проекта локально, но при запуске в контейнерах порт нужно убрать.

<br>

#### В окне терминала из базовой директории перейти в директорию с файлом docker-compose, выполнить команды для запуска контейнеров
```sh
cd infra/
docker-compose up -d --build
```
- Команда ```-d``` нужна для фоновой работы контейнера
- Файлы конфигурации описаны в ```/infra/nginx.conf``` и ```/infra/docker-compose.yml```, при необходимости изменить

<br>

#### После запуска контейнеров выполнить команды миграции и загрузки данных в базу
```sh
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py load_seasons
```
#### Для создания суперпользователя выполнить команду
```sh
docker-compose exec backend python manage.py createsuperuser
```