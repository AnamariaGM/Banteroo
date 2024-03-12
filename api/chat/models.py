from django.contrib.auth.models import AbstractUser
from django.db import models
import os
import uuid

def upload_thumbnail(instance, filename):
    path = f'thumbnails/{instance.username}'
    if filename:
        return os.path.join(path, filename)
    else:
        # Generate a random filename if the provided filename is None
        return os.path.join(path, f'{uuid.uuid4().hex}.jpg')




# def upload_thumbnail(instance, filename):
#     path = f'thumbnails/{instance.username}'
#     extension = filename.split('.')[-1]
#     if extension:
#         path = path + '.' + extension
#     return path

class User(AbstractUser):
    thumbnail = models.ImageField(
        upload_to= upload_thumbnail,
        null = True,
        blank=True
    )

# Create your models here.

class Connection(models.Model):
    sender= models.ForeignKey(
        User,
        related_name='sent_connections',
        on_delete=models.CASCADE
    )
    receiver= models.ForeignKey(
        User,
        related_name='received_connections',
        on_delete=models.CASCADE
    )
    accepted = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.sender.username + ' -> ' + self.receiver.username