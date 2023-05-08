from rest_framework import serializers
from django.forms.models import model_to_dict
from Properties.models import Property
from .models import Image
from django.db.models import Min, Max


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['property', 'image', 'num']