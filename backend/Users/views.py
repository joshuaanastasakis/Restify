from urllib.request import Request
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware import csrf
from rest_framework.parsers import JSONParser

from Properties.models import Property
from .models import User
from .serializers import RegistrationSerializer, UserSerializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, get_user_model
from rest_framework_simplejwt import settings

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
        
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class RegistrationAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer

    def post(self, request: Request) -> Response:
        """Return user response after a successful registration."""
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED) 

@api_view(['GET'])
def logoutview(request):
    if request.method == 'GET':
        return Response({})
    else:
        return Response("METHOD NOT ALLOWED", status=405)

#view adapted from https://rb.gy/24sjql

class UserRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def retrieve(self, request: Request, *args: dict[str, any], **kwargs: dict[str, any]) -> Response:
        """Return user on GET request."""
        serializer = self.serializer_class(request.user, context={'request': request})

        data = serializer.data

        properties = Property.objects.filter(host=request.user.id)

        isHost = len(properties) > 0

        data['isHost'] = isHost

        return Response(data, status=200)


    def update(self, request: Request, *args: dict[str, any], **kwargs: dict[str, any]) -> Response:
        """Return updated user."""

        serializer = self.serializer_class(
            request.user, data=request.data, partial=True, context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=200)

