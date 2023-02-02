FROM python:3.10

WORKDIR /backend

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt --no-cache-dir

COPY app/ .

COPY . .