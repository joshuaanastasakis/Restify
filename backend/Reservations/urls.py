from django.urls import path
from .views import listview, editview, createreviewview, createview, detailview

app_name = 'reservations'

urlpatterns = [
    # list reservations, pagenum used for pagination
    path('list/<int:pagenum>/', listview),
    path('<int:id>/details/', detailview),
    path('<int:id>/edit/', editview),
    path('<int:id>/review/create/', createreviewview),
    path('create/', createview),
]