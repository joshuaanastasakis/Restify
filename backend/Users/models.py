'''
    Tutorial for subclassing user object:
        https://testdriven.io/blog/django-custom-user-model/#:~:text=The%20default%20user%20model%20in,either%20subclassing%20AbstractUser%20or%20AbstractBaseUser%20.
'''
from django.contrib.auth.models import AbstractUser, BaseUserManager

from django.db import models

# taken from tutorial: https://rb.gy/1wcvfd

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, username, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('phone', 9999999999)
        email = 'superuser@gmail.com'

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(username, email, password, **extra_fields)
    

class User(AbstractUser):
    username = models.CharField(max_length=200, unique=True, default='deprecatedUser')
    REQUIRED_FIELDS = []
    first_name = models.CharField(max_length=200, )
    last_name = models.CharField(max_length=200, )
    email = models.EmailField(max_length=200, unique=True)
    password = models.CharField(max_length=200)
    phone = models.IntegerField()
    avatar = models.ImageField(upload_to='users/avatars', )
    is_host = models.BooleanField(default=False, )

    objects = UserManager()
