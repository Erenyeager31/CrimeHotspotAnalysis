from django.db import models

# Create your models here.
class User(models.Model):
    email = models.CharField(max_length=128)
    name = models.CharField(max_length=256)
    gender  = models.CharField(max_length=1)
    username = models.CharField(max_length=128)
    password = models.CharField(max_length=128)
    def __str__(self):
        return self.name

