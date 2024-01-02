from django.db import models


class Profile(models.Model):
    user = models.OneToOneField(to='api.User', on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200)
    bio = models.CharField(max_length=300)
    image = models.ImageField(default='default.jpg', upload_to='user_images')
    verified = models.BooleanField(default=False)
    
    def __str__(self):
        return self.full_name
