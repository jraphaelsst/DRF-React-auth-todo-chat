from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from api import views


urlpatterns = [
    path('', views.getRoutes),
    path('token/', views.MyTokenObtainPairView.as_view()),
    path('token/refresh', TokenRefreshView.as_view()),
    path('register/', views.RegisterView.as_view()),
    path('dashboard/', views.dashboard)
]