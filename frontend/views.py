from django.shortcuts import render,HttpResponse
import re
from frontend.models import User
from django.core.cache import cache
import random
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse

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
# def register(request):
#     return render(request,"register.html")

#? Email verification and otp generation
def verify_email(request):
    if request.method == "POST":
        print(request.body)
        json_data = request.body.decode('utf-8')
        data = json.loads(json_data)
        email = data.get("email")
        try:
            if re.fullmatch(regex,email):
                #? proccessing email
                users = User.objects.filter(email).values().first()
                if users:
                    return JsonResponse({
                        "status":False,
                        "message":"EmailID already exists"
                    })
                else:
                    otp = GenOtpAndStore(email)
                    return JsonResponse({
                        "status":True,
                        "message":"OTP sent succesfully"
                    })
            else:
                return JsonResponse({
                    "status":False,
                    "message":"Invalid EMAIL"
                })
        except Exception as e:
            return JsonResponse({
                "status":True,
                "message":"Some error Occured !"
            })
    else:
        return JsonResponse({
            "status":True,
            "message":"Unable to process! Please try again"
        })
    
#? OTP verification
def verifyOtp(request):
    if request.method == "POST":
        json_data = request.body.decode('utf-8')
        data = json.loads(json_data)
        email = data.get("email")
        otp = data.get("otp")
        try:
            cache_key = f'otp_{email}'
            CachedOtp = cache.get(cache_key)
            if CachedOtp == otp:
                return JsonResponse({
                    "status":True,
                    "message":"OTP verified Succesfully !"
                })
        except Exception as e:
            return JsonResponse({
                "status":False,
                "message":"Some error Occured"
            })
    else:
        return JsonResponse({
            "status":False,
            "message":"Unable to process! Please try again"
        })
    
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
            return JsonResponse({
                "status":True,
                "message":"Account Created successfully"
            })
        except Exception as e:
            return JsonResponse({
                "status":False,
                "message":"Unable to proccess, Please try again later"
            })

    else:
        return JsonResponse({
            "status":False,
            "message":"Unable to proccess, Please try again later"
        })

#? Login endppoint
@csrf_exempt
def login(request):
    if request.method == "POST":
        json_data = request.body.decode('utf-8')
        data = json.loads(json_data)
        username = data.get("username")
        password = data.get("password")
        print(f'{username}_{password}')
        try:
            user = User.objects.filter(username=username).first()
            res = {
                "status":False,
                "message":"Login Successfull"
            }
            if check_password(password,user.password):
                res['status'] = True
                res['message'] = "Login Successfull"
                return JsonResponse(res)
            else:
                res['status'] = False
                res['message'] = "Invalid Credentials"
                return JsonResponse(res)
        except Exception as e:
            return HttpResponse(e)
    else:
        return JsonResponse({
            "status":False,
            "message":"Unable to proccess, Please try again later"
        })

#**************************************************************
#*                            MAP                             *
#**************************************************************

def map(request):
    return render(request,'Map.html')

def fetchData(request):
    return JsonResponse({
        "message":"hi"
    })

def test(Request):
    # otp test
    email = Request.GET.get("email")
    otp = GenOtpAndStore(email)
    cache_key = f'otp_{email}'
    return HttpResponse(cache.get(cache_key))


#? registeration page
def registration(request):
    return render(request,'registration_page.html')

#? registeration/details page
def details(request):
    return render(request,'details.html')
