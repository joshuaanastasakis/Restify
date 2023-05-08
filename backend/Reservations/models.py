from django.db import models
from Properties.models import Property
from Users.models import User
from .constants import RESERVATION_STATUS_TYPES

class Reservation(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    start_dt = models.DateTimeField()
    end_dt = models.DateTimeField()
    cost = models.FloatField()
    status = models.CharField(max_length=200, choices=[(x, x) for x in RESERVATION_STATUS_TYPES])
    # Host review of user
    host_review_rating = models.IntegerField(null=True, )
    host_review_comment = models.CharField(max_length=200, null=True, )
    host_review_dt = models.DateTimeField(auto_now=True, null=True, )
    # User review of host
    user_review_rating = models.IntegerField(null=True, )
    user_review_comment = models.CharField(max_length=200, null=True, )
    user_review_dt = models.DateTimeField(auto_now=True, null=True, )
    # Host reply (1) to user review
    host_reply_comment = models.CharField(max_length=200, null=True, )
    host_reply_dt = models.DateTimeField(auto_now=True, null=True, )
    # User reply (2) to host reply
    user_reply_comment = models.CharField(max_length=200, null=True, )
    user_reply_dt = models.DateTimeField(auto_now=True, null=True, )

