""" restify URLs

/accounts/register
/accounts/login
/accounts/logout
/accounts/

"""
from django.contrib import admin
from django.urls import path, include
from .views import logoutview, RegistrationAPIView, UserRetrieveUpdateAPIView
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('logout/', logoutview),
    path('register/', RegistrationAPIView.as_view(), name='register'),
    path('profile/', UserRetrieveUpdateAPIView.as_view(), name='profile'),
    path('api/token/', jwt_views.TokenObtainPairView().as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
