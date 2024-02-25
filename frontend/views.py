from django.shortcuts import render,HttpResponse
import re
from frontend.models import User
from django.core.cache import cache
import random
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
import json
# from django.http import JsonResponse

#? Email regex
regex = re.compile("([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+")

#? function for otp generation
def GenOtpAndStore(email):
# Generate a 6-digit random OTP
    otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])

    # Store the OTP in the cache with a TTL (time-to-live) of 5 minutes (300 seconds)
    cache_key = f'otp_{email}'
    cache.set(cache_key, otp, timeout=600)
    return otp

def passwordHashing(password):
    hashedPassword = make_password(password)
    return hashedPassword

#? Create your views here.
def index(request):
    return render(request,'index.html')

#? Redirect
def register(request):
    return render(request,"register.html")

#? Email verification and otp generation
def verify_email(request):
    if request.method == "POST":
        email = request.POST.get("email")
        try:
            if re.fullmatch(regex,email):
                #? proccessing email
                users = User.objects.filter(email).values().first()
                if users:
                    return HttpResponse("Email already exists !")
                else:
                    otp = GenOtpAndStore(email)
                    # mailing the OTP
            else:
                return HttpResponse("Invalid Email")
        except Exception as e:
            return HttpResponse("Some error Occured !")
    else:
        return HttpResponse("Unable to process! Please try again")
    
#? OTP verification
def verifyOtp(request):
    if request.method == "POST":
        email = request.POST.get("email")
        otp = request.POST.get("otp")
        try:
            cache_key = f'otp_{email}'
            CachedOtp = cache.get(cache_key)
            if CachedOtp == otp:
                return HttpResponse("OTP verified Succesfully !")
        except Exception as e:
            return HttpResponse("Some error Occured !")
    else:
        return HttpResponse("Unable to process! Please try again")
    
#? Account Creation
@csrf_exempt
def accountCreation(request):
    if request.method == "POST":
        print(request.body)
        json_data = request.body.decode('utf-8')
        data = json.loads(json_data)
        email = data.get("email")
        name = data.get("name")
        username = data.get("username")
        gender = data.get("gender")
        password = data.get("password")
        try:
            # Hashing password
            hashedPassword = passwordHashing(password)
            # creating a new entry
            newUser = User(
                email=email,
                name=name,
                gender=gender,
                username=username,
                password=hashedPassword,
            )
            newUser.save()
            return HttpResponse("Account created succesfully")
        except Exception as e:
            return HttpResponse(
                "Unable to process! Please try again"
                # e
                )

    else:
        return HttpResponse("Unable to process! Please try again")

def test(Request):
    # otp test
    email = Request.GET.get("email")
    otp = GenOtpAndStore(email)
    cache_key = f'otp_{email}'
    return HttpResponse(cache.get(cache_key))