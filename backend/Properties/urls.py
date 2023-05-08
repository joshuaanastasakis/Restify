from django.urls import path
from .views import listview, editview, detailview, createview, listingcreateview, listinglistview, listingdetailview, listingupdateview, uploadImage

app_name = 'properties'

urlpatterns = [
    path('list/<int:pagenum>/', listview),
    path('<int:pk>/details/', detailview),
    path('<int:pk>/', editview),
    path('create/', createview),
    path('<int:propid>/listings/create/', listingcreateview),
    path('<int:propid>/listings/list/<int:pagenum>/', listinglistview),
    path('<int:propid>/listings/<int:listid>/details/', listingdetailview),
    path('<int:propid>/listings/<int:listid>/', listingupdateview),
    path('<int:propid>/uploadimage/<int:imagenum>/', uploadImage),
]