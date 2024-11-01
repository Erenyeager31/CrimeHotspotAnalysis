from django.shortcuts import render,HttpResponse
import re
from frontend.models import User
from django.core.cache import cache
import random
from django.contrib.auth.hashers import make_password, check_password
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
import gspread
import pandas as pd
from oauth2client.service_account import ServiceAccountCredentials
from django.conf import settings
from django.core.mail import send_mail
import pickle
from sklearn.preprocessing import OneHotEncoder, LabelEncoder
import numpy as np

auth = False
uname = None

#? Email regex
regex = re.compile("([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+")

#? Set up Google Sheets API credentials
# scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
# path = "../static/js/credentials.json"
# creds = ServiceAccountCredentials.from_json_keyfile_name('D:/VScode/CrimeHotspotAnalysis/static/js/credentials.json', scope)
# client = gspread.authorize(creds)

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

#? Sending OTP
def sendOTP(email,otp):
    subject = 'welcome to Crime Hotspot Analyser'
    message = f'Hi your OTP for registering on Crime Analyser is : {otp}'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail( subject, message, email_from, recipient_list )

#? Email verification and otp generation
@csrf_exempt
def verify_email(request):
    if request.method == "POST":
        print(request.body)
        json_data = request.body.decode('utf-8')
        data = json.loads(json_data)
        email = data.get("email")
        print(email)
        try:
            print("0")
            if re.fullmatch(regex,email):
                #? proccessing email
                print("-1")
                users = User.objects.filter(email=email).values().first()
                print("1")
                if users:
                    print("2")
                    return JsonResponse({
                        "status":False,
                        "message":"EmailID already exists"
                    })
                else:
                    print("3")
                    # otpVal = cache.get(f'otp_{email}')
                    # if otpVal:
                    #     return JsonResponse({
                    #     "status":True,
                    #     "message":"OTP already sent succesfully, please wait for 5 minutes"
                    #     })
                    otp = GenOtpAndStore(email)
                    sendOTP(email,otp)
                    return JsonResponse({
                        "status":True,
                        "message":"OTP sent succesfully"
                    })
            else:
                print("4")
                return JsonResponse({
                    "status":False,
                    "message":"Invalid EMAIL"
                })
        except Exception as e:
            return JsonResponse({
                "status":True,
                "message":f"Some error Occured !{e}"
            })
    else:
        return JsonResponse({
            "status":True,
            "message":"Unable to process! Please try again"
        })
    
#? OTP verification
@csrf_exempt
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
            print(e)
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
                response = JsonResponse(res)
                response.set_cookie(key=f'{username}_auth',value=True,max_age=7200)
                global uname
                uname = username
                return response
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
    data = request.COOKIES.get(f'{uname}_auth')
    if data:
        return render(request,'Map.html')
    else:
        return render(request,'index.html')

def fetchData(request):
    filename = 'frontend/files/ProccessedData.csv'
    try:
        df = pd.read_csv(filename)
        print(f"Data fetched from local file '{filename}':")
        # print(df)
        df.fillna('NA',inplace=True)
        selected_df = df[[
            'crime description', 
            'crime Location', 
            'Link/source'
            ]]

        data = selected_df.to_json(orient='records',lines=True)
        # print(data)
        return JsonResponse({
            "status":"True",
            "message":"Data fetched succesfully",
            "Data":data
        })

    except FileNotFoundError:
        print(f"Error: File '{filename}' not found. Please check the file path.")
        return JsonResponse({
            "status":"False",
            "message":"Some error uccured, please try again later"
        })
    except Exception as e:    
        print(f"Error: {e}")
        return JsonResponse({
            "status":"False",
            "message":"Some error uccured, please try again later"
        })

def fetchClusterData(request):
    filename = 'frontend/files/ClusteredData.csv'
    filename2 = 'frontend/files/ClusterCharacter.csv'

    try:
        df = pd.read_csv(filename)
        print(f"Data fetched from local file '{filename}':")
        # print(df)
        df.fillna('NA',inplace=True)
        selected_df = df[[
            'lat',
            'long',
            'Cluster',
            'Type of crime',
            'Link/source',
            'crime description'
            ]]
        data = selected_df.to_json(orient='records',lines=True)
        
        df1 = pd.read_csv(filename2)
        print(f"Data fetched from local file '{filename2}':")
        # print(df1)
        df1.fillna('NA',inplace=True)
        data2 = df1.to_json(orient='records',lines=True)
        return JsonResponse({
            "status":"True",
            "message":"Data fetched succesfully",
            "Data":data,
            "Data2":data2
        })

    except FileNotFoundError:
        print(f"Error: File '{filename}' not found. Please check the file path.")
        return JsonResponse({
            "status":"False",
            "message":"Some error uccured, please try again later"
        })
    except Exception as e:    
        print(f"Error: {e}")
        return JsonResponse({
            "status":"False",
            "message":"Some error uccured, please try again later"
        })

@csrf_exempt
def predict(request):
    reverse_mapping = {0: 'Kidnapping', 1: 'Murder', 2: 'Other', 3: 'Robbery', 4: 'Sexual Harassment', 5: 'Theft'}
    if request.method == 'POST':
        print("request recevied")
        json_data = request.body.decode('utf-8')
        data = json.loads(json_data)
        name = data.get("name")
        age = data.get("age")
        gender = data.get("gender")
        Tday = data.get("Tday")
        Ltype = data.get("Ltype")
        Wcond = data.get("Wcond")
        month = data.get("month")
        day = data.get("day")
        lat = data.get("lat")
        long = data.get("long")

    with open('static/GBmodel.pkl', 'rb') as file:
        model = pickle.load(file)

    # Assuming you have some input data to make predictions
    input_data = [[0, 19, lat, long, Tday, Ltype, Wcond, month, day]]  # Example input data, replace it with your actual input data
    print(input_data)
    # Make predictions using the loaded model
    # le = LabelEncoder()
    predicted_labels = model.predict(input_data)
    # predicted_labels = le.inverse_transform(predicted_labels_encode)
    print(predicted_labels)

    return JsonResponse({
        "status":True,
        "message":"Data received",
        "prediction":reverse_mapping[predicted_labels[0]]
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

def aboutus(request):
    return render(request, 'aboutus.html')

def contactus(request):
    return render(request, 'contactus.html')

def logout(request):
    global uname
    global auth
    uname = None
    auth = False
    return JsonResponse({
        'status':True,
        'message':'User logged out succesfullly'
    })

#*************************** ANALYSIS ***************************
@csrf_exempt
def fetchProcessedData(request):
    filename = 'frontend/files/ProccessedData.csv'
    try:
        df = pd.read_csv(filename)
        print(f"Data fetched from local file '{filename}':")
        df.fillna('NA',inplace=True)
        data = df.to_json(orient='records',lines=True)

        
        return JsonResponse({
            "status":"True",
            "message":"Data fetched succesfully",
            "Data":data
        })

    except FileNotFoundError:
        print(f"Error: File '{filename}' not found. Please check the file path.")
        return JsonResponse({
            "status":"False",
            "message":"Some error occured, please try again later !"
        })
    except Exception as e:    
        print(f"Error: {e}")
        return JsonResponse({
            "status":"False",
            "message":"Some error occured, please try again later !!"
        })
    
def chartPage(request):
    data = request.COOKIES.get(f'{uname}_auth')
    if data:
        return render(request,'Chart.html')
    else:
        return render(request,'index.html')