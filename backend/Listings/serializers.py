from rest_framework import serializers
from Listings.models import Listing # for available listing prices

# from django.forms.models import model_to_dict
# from .models import Property
# from Amenities.models import Amenity
# from Reservations.models import Reservation # for property reviews+ratings


class ListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ['id', 'start_dt', 'end_dt', 'price']
