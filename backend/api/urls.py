from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from api import views


urlpatterns = [
    # Authentication URL's
    path('test/', views.testEndPoint, name='test'),
    path('', views.getRoutes, name='get_routes'),
    path('token/', views.MyTokenObtainPairView.as_view(), name='obtain_token_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    
    # Dashborad URL
    path('dashboard/', views.dashboard, name='dashboard'),
    
    # Todo URLs
    path('todo/<user_id>', views.TodoListView.as_view(), name='todo_listing'),
    path('todo-detail/<user_id>/<todo_id>', views.TodoDetailView.as_view(), name='todo_detail'),
    path('todo-mark/<user_id>/<todo_id>', views.TodoMarkAsCompleted.as_view(), name='todo_mark_completed')
]
