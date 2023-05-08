from rest_framework import serializers
from django.forms.models import model_to_dict
from .models import Property
from Amenities.models import Amenity
from Images.models import Image
from Listings.models import Listing # for available listing prices
from Reservations.models import Reservation # for property reviews+ratings
from django.db.models import Min, Max



class PropertyAmenities(serializers.RelatedField):
    def to_representation(self, instance):
        # return model_to_dict(instance)
        return instance.title

    def to_internal_value(self, data):
        return Amenity.objects.get(id=data['id']).title


class PropertyListings(serializers.RelatedField):
    def to_representation(self, instance):
        return instance

    def to_internal_value(self, data):
        return Listing.objects.get(id=data['id'])


class PropertyImages(serializers.RelatedField):
    def to_representation(self, instance):
        # return model_to_dict(instance)
        return (instance.num, 'http://localhost:8000'+instance.image.url)

    def to_internal_value(self, data):
        img = Image.objects.get(id=data['id'])
        return (img.num, img.image.url)


class PropertySerializer(serializers.ModelSerializer):
    amenities = PropertyAmenities(many=True, queryset=Amenity.objects.all())
    # listings = PropertyListings(many=True, queryset=Listing.objects.all())
    # min_price = PropertyListings(many=False, queryset=Listing.objects.all())
    min_price = serializers.SerializerMethodField()
    images = PropertyImages(many=True, queryset=Image.objects.all())
#     images = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = '__all__'

    def get_min_price(self, obj):
        # minprice = Listing.objects.filter(property__id=obj.id).aggregate(min_price=Min('price'))
        minprice = Property.objects.filter(id=obj.id).aggregate(min_price=Min('listings__price'))
        return minprice['min_price']

#     def images(self, property):
#         request = self.context.get('request')
#         photo_url = [x.url for x in property.images]
#         return request.build_absolute_uri(photo_url)
