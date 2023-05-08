from django.contrib import admin
from .models import User
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

# taken from tutorial: https://rb.gy/1wcvfd

admin.site.register(User)