from django.contrib import admin
from django.urls import path,include
from frontend import views

urlpatterns = [
    path('',views.index,name='home'),
    path('register',views.register,name='register'),
    path('verifyEmail',views.verify_email,name="verifyEmail"),
    path('createUser',views.accountCreation,name="accountCreation"),
    path('login',views.login,name="loginUser"),
    #* Map routing
    path('map',views.map,name="Map"),
    path('fetchData',views.fetchData,name="fetchData"),
    path('test',views.test,name="test")
]
