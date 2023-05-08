from django.db import models
from Users.models import User


# def image_upload_path(instance, filename):
#     property_id = instance.property.id
#     image_num = instance.num
#     extension = filename.split('.')[-1]
#     # each file will be stored in images/property/_property number_/_image number_
#     # example:
#     # - user uploads image 1 (big one that's also used as a thumbnail) for their property (property.id==5)
#     # - file path = /images/property/5/image1
#     # Uploads for image 2 would be as follows:
#     # - file path = /images/property/5/image2
#     return 'images/property/{0}/image/{1}.{2}'.format(property_id, image_num, extension)


class Property(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=200, )
    city = models.CharField(max_length=200, )
    province = models.CharField(max_length=200, )
    postal = models.CharField(max_length=200, )
    country = models.CharField(max_length=200, )
    description = models.TextField()
    name = models.CharField(max_length=200, )
    max_guests = models.IntegerField()
    num_bed = models.IntegerField()
    num_bath = models.IntegerField()
#     img1 = models.ImageField(upload_to=image_upload_path, )
#     img2 = models.ImageField(upload_to=image_upload_path, )
#     img3 = models.ImageField(upload_to=image_upload_path, )
#     img4 = models.ImageField(upload_to=image_upload_path, )
#     img5 = models.ImageField(upload_to=image_upload_path, )

