from django.db import models
from Users.models import User

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    dt = models.DateTimeField(auto_now=True)
    url = models.URLField()
    message = models.TextField(max_length=200, )
    is_read = models.BooleanField(default=False)

# Host: Cancel Request  - GET /reservations/<id>
# Host: New Reservation - GET /reservations/<id>/
# User: Approved Reservation  - GET /reservations/<id>
# User: Cancelled Reservation - GET /reservations/<id>/

