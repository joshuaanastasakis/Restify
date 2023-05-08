from django.db import models
from Properties.models import Property
from django.conf import settings
from django.conf.urls.static import static


def image_upload_path(instance, filename):
    property_id = instance.property.id
    image_num = instance.num
    extension = filename.split('.')[-1]
    # each file will be stored in images/property/_property number_/_image number_
    # example:
    # - user uploads image 1 (big one that's also used as a thumbnail) for their property (property.id==5)
    # - file path = /images/property/5/image1
    # Uploads for image 2 would be as follows:
    # - file path = /images/property/5/image2
    return 'media/images/property-{0}-image-{1}.{2}'.format(property_id, image_num, extension)


NUM_CHOICES = [
    ("1", 1),
    ("2", 2),
    ("3", 3),
    ("4", 4),
    ("5", 5),
]


class Image(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=image_upload_path)
    num = models.IntegerField(choices=NUM_CHOICES, null=False, blank=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['property', 'num'],
                name="unique property image number"
            )
        ]

    def media_url(self):
        return self.image.url
