#!/bin/bash

python3 -m virtualenv venv

sleep 1

source venv/bin/activate

sleep 1

pip install django

sleep 1

pip install Pillow

sleep 1

pip install djangorestframework

sleep 1

pip install djangorestframework-simplejwt

sleep 1

pip install django-cors-headers

sleep 1

pip install cookies

sleep 1

python3 backend/manage.py makemigrations

sleep 1

python3 backend/manage.py migrate