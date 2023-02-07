<a href="" target="blank"><img align="center" style="background-color-white;" src="https://raw.githubusercontent.com/AltyOfficial/street-cats/4a3e2f696f2c80833a01ba9a9fe2b66eef4792b2/backend/media/StreetCatsLogo.svg" alt="StreetCatsLogo" width="480" /></a>

# SPA Проект с уличными котиками Street Cats

В проекте можно делиться историями и изображениями встреченных котиков (не своих), подписываться на других авторов, оценивать посты. В профиле каждого пользователя ведется статистика по встреченным и покормленным котикам. Можно фильтровать посты по месту встречи котика, автору и времени года. У списка постов реализована пагинация и фильтрация по автору, месту встречи котика и времени года.

P.S. В клиентской части React функционал ограничен, подробнее об этом [в конце readme файла](#об-ограничении-функционала-в-клиентской-части-react-проекта). 

<hr>

## Проект можно запустить в двух вариантах: на локальном сервере и в Docker контейнерах.

- [Запуск проекта локально](#установка-проекта-локально)
- [Запуск проекта в Docker контейнерах](#установка-проекта-в-docker-контейнерах)

<hr>

### К проекту написана документация на Redoc. Расположена по адресу:

```http://127.0.0.1:8000/redoc/``` - при развертывании локально
<br>
```http://127.0.0.1/redoc/``` - при развертывании в контейнерах Docker

<hr>

### В проекте используется база данных PostgreSQL, следует создать и наполнить файл "```.env```" в директории "```/infra/```"

#### Шаблон наполнения env-файла (кавычки убрать)
```sh
SECRE_KEY=*СЕКРЕТНЫЙ КЛЮЧ ДЖАНГО ПРОЕКТА*
DB_ENGINE='DB_ENGINE'
DB_NAME='DB_NAME'
POSTGRES_USER='USER'
POSTGRES_PASSWORD='PASSWORD'
DB_HOST='HOST'
DB_PORT='PORT'
```

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
<br>

## Установка проекта локально 
#### Клонировать проект
```sh
git clone https://github.com/AltyOfficial/street-cats.git
```
#### Перейти в директорию с backend частью проекта
```sh
cd backend/
```
#### Создать и установить виртуальное окружение, установить зависимости
```sh
python -m venv venv
source venv/Scripts/activate
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

#### В файле ```/backend/app/app_config/settings.py``` изменить 14-ую строку на
```sh
DEBUG = True
```

#### Backend часть проекта будет доступна по адресу http://127.0.0.1:8000/ и http://localhost:8000/

<hr>

#### В файле ```/frontend/src/settings.py``` изменить 12-ую строку на
```sh
const BASE_URL = 'http://127.0.0.1:8000/
```

#### Открыть второе окно терминала, из базовой директории перейти в директорию с Frontend частью, запустить сервер
```sh
cd frontend/
npm start
```

#### Frontend часть проекта будет доступна по адресу http://localhost:3000/

<hr>
<br>

## Установка проекта в Docker контейнерах

#### В файле ```/frontend/src/settings.py``` изменить 12-ую строку на
```sh
const BASE_URL = 'http://127.0.0.1/
```

#### В файле ```/backend/app/app_config/settings.py``` изменить 14-ую строку на
```sh
DEBUG = False
```

#### В окне терминала из базовой директории перейти в директорию с файлом docker-compose, выполнить команды для запуска контейнеров
```sh
cd infra/
docker-compose up -d --build
```
- Команда ```-d``` нужна для фоновой работы контейнера
- Файлы конфигурации описаны в ```/infra/nginx.conf``` и ```/infra/docker-compose.yml```, при необходимости изменить

#### После запуска контейнеров выполнить команды миграции, сбора статики и загрузки данных в базу
```sh
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py collectstatic --no-input
docker-compose exec backend python manage.py load_seasons
```
#### Для создания суперпользователя выполнить команду
```sh
docker-compose exec backend python manage.py createsuperuser
```

#### Проект будет доступен по адресу http://127.0.0.1/

<hr>
<br>

## Об ограничении функционала в клиентской части React проекта:

#### Этот проект я полностью написал сам, в том числе фронтенд часть на React. Я многого не знаю, скорее всего часть кода написана неэффективно. Так как это мой первый опыт использования React, я не знаю как выполнить тот или иной функционал, который есть в backend части. Фронтенд часть тут планировалась как визуализация написанного мной в backend части. 

#### Так же в клиентской части иногда могут возникать ошибки, например после редактирования пользователя нужно разлогиниться и вновь залогиниться, чтоб изменения вступили в силу.