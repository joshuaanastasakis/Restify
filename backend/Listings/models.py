from django.db import models
from Properties.models import Property


class Listing(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='listings')
    start_dt = models.DateField()
    end_dt = models.DateField()
    price = models.FloatField()
