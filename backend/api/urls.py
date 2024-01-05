from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from api import views


urlpatterns = [
    # Authentication
    path('test/', views.testEndPoint, name='test'),
    path('', views.getRoutes, name='get_routes'),
    path('token/', views.MyTokenObtainPairView.as_view(), name='obtain_token_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    
    # Dashborad
    path('dashboard/', views.dashboard, name='dashboard'),
    
    # Todo
    path('todo/<user_id>/', views.TodoListView.as_view(), name='todo_listing'),
    path('todo-detail/<user_id>/<todo_id>/', views.TodoDetailView.as_view(), name='todo_detail'),
    path('todo-mark/<user_id>/<todo_id>/', views.TodoMarkAsCompleted.as_view(), name='todo_mark_completed'),
    
    # Chat Message
    path('my-messages/<user_id>/', views.MyInbox.as_view()),
    path('get-messages/<sender_id>/<receiver_id>/', views.GetMessages.as_view()),
    path('send-message/', views.SendMessage.as_view()),
    
    # Get / Filter Data
    path('profile/<int:pk>/', views.ProfileDetail.as_view()),
    path('search/<username>/', views.SearchUser.as_view()),
]
