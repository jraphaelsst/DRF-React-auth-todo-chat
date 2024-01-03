from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from api import views


urlpatterns = [
    path('test/', views.testEndPoint, name='test'),
    path('', views.getRoutes, name='get_routes'),
    path('token/', views.MyTokenObtainPairView.as_view(), name='obtain_token_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('dashboard/', views.dashboard, name='dashboard')
]
