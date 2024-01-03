from rest_framework import serializers

from api.models.todo import Todo


class TodoSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Todo
        fields = '__all__'
