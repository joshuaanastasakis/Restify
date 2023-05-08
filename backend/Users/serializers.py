from rest_framework import serializers
from .models import User
from django.db import models
from rest_framework_simplejwt.serializers import TokenObtainSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.core.validators import validate_email as email_is_valid

#serializers adapted from https://rb.gy/24sjql

class RegistrationSerializer(serializers.ModelSerializer[User]):
	"""Serializers registration requests and creates a new user."""

	password1 = serializers.CharField(max_length=128, min_length=8, write_only=True)
	password2 = serializers.CharField(max_length=128, min_length=8, write_only=True)

	class Meta:
		model = User
		fields = ('username', 'email', 'password1', 'password2', 'first_name', 'last_name', 'phone', 'is_host')

	def validate(self, data):
		data = super().validate(data)
		password1 = data.get('password1')
		password2 = data.get('password2')
		if not password1:
			raise serializers.ValidationError({'password1': 'This field is required'})
		else:
			if len(password1) < 8:
				raise serializers.ValidationError({'password1': 'This password is too short. It must contain at least 8 characters'})
		if not password2:
			raise serializers.ValidationError({'password2': 'This field is required'})
		if password1 != password2:
			raise serializers.ValidationError({'password1': 'The passwords didn\'t match'})

		return super(RegistrationSerializer, self).validate(data)

	def create(self, validated_data):  # type: ignore
		"""Return user after creation."""

		user = User.objects.create_user(
			username=validated_data['username'], password=validated_data['password1'], email=validated_data['email'], phone=validated_data['phone'], first_name=validated_data['first_name'], last_name=validated_data['last_name']
		)
		print(user.password)
		return user
	
class UserSerializer(serializers.ModelSerializer[User]):
	"""Handle serialization and deserialization of User objects."""

	password = serializers.CharField(max_length=128, min_length=8, write_only=True)

	class Meta:
		model = User
		fields = ('email', 'password', 'first_name', 'last_name', 'phone')

	def update(self, instance, validated_data):  # type: ignore
		"""Perform an update on a User."""
		
		password = validated_data.pop('password', None)
		for (key, value) in validated_data.items():
			setattr(instance, key, value)

		if password is not None:
			instance.set_password(password)

		instance.save()

		return instance
	