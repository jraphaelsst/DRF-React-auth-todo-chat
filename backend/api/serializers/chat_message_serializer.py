from rest_framework import serializers

from api.models import ChatMessage
from api.serializers import ProfileSerializer


class ChatMessageSerializer(serializers.ModelSerializer):
    receiver_profile = ProfileSerializer(read_only=True)
    sender_profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = ChatMessage
        fields = ['id', 'user', 'sender', 'sender_profile', 'receiver_profile', 'message', 'is_read', 'date']
