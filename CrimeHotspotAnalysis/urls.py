from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('frontend.urls')),
    path('register',include('frontend.urls')),
    path('verifyEmail',include('frontend.urls')),
    path('createUser',include('frontend.urls')),
    path('login',include('frontend.urls')),
    path('test',include('frontend.urls')),
]
