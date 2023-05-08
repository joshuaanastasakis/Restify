from django.db import models
from Properties.models import Property
from .constants import AMENITY_TYPES

# AMENITY_CHOICES = [(x, x) for x in AMENITY_TYPES]
# ("gym", "gym"),
# ("laundry", "laundry"),
# ("dryer", "dryer"),
# ("kitchen", "kitchen"),
# ("AC", "AC"),
# ("heat", "heat"),
# ("BBQ", "BBQ"),
# ("sauna", "sauna"),
# ("hot tub", "hot tub"),
# ("fireplace", "fireplace"),
#]


class Amenity(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='amenities')
    title = models.CharField(max_length=200, choices=[(x, x) for x in AMENITY_TYPES])
