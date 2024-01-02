from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from api.models import User


class RegisterSerializer(serializers.ModelSerializer):
    
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    
    password2 = serializers.CharField(
        write_only=True, required=True
    )
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2']

        def validate(self, attrs):
            if attrs['password'] != attrs['password2']:
                raise serializers.ValidationError(
                    {'password': 'Passwwords do not match!'}
                )
            return attrs
        
        def create(self, validated_data):
            user = User.objects.create(
                username=validated_data['username'],
                email=validated_data['email']
            )
            user.set_password(validated_data['password'])
            user.save()
            
            return user
