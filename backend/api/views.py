from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from api.models import Profile, User, Todo
from api.serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserSerializer, TodoSerializer


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = ([AllowAny])
    serializer_class = RegisterSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = "Hello buddy"
        data = f'Congratulation your API just responded to POST request with text: {text}'
        return Response({'response': data}, status=status.HTTP_200_OK)
    return Response({}, status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/token/refresh/',
        '/api/register'
    ]
    return Response(routes)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def dashboard(request):
    if request.method == 'GET':
        context = f'Hey {request.user}, you are seeing a GET response'
        
        return Response({'response': response}, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        text = request.POST.get('text')
        response = f'Hey {request.user}, your text is {text}'
        
        return Response({'response': response}, status=status.HTTP_200_OK)
        
    return Response({}, status=status.HTTP_400_BAD_REQUEST)


class TodoListView(generics.ListCreateAPIView):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer
    
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)
        
        todo = Todo.objects.filter(user=user)
        return todo


class TodoDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    
    def get_object(self):
        user_id = self.kwargs['user_id']
        todo_id = self.kwargs['todo_id']
        
        user = User.objects.get(id=user_id)
        todo = Todo.objects.get(id=todo_id, user=user)
