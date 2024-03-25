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

#? Email regex
regex = re.compile("([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+")

#? Set up Google Sheets API credentials
# scope = ["https://spreadsheets.google.com/feeds", "https://www.googleapis.com/auth/drive"]
# path = "../static/js/credentials.json"
# creds = ServiceAccountCredentials.from_json_keyfile_name('D:/VScode/CrimeHotspotAnalysis/static/js/credentials.json', scope)
# client = gspread.authorize(creds)

def custom_data_converter(df):
  """Converts DataFrame to a list of dictionaries, replacing 'NA' with 'NA'."""
  data_list = []
  for index, row in df.iterrows():
    if (index == 40):
        print(data_dict)
    data_dict = row.replace('nan', 'NA').to_dict()  # Replace 'NA' before conversion
    if (index == 40):
        print(data_dict)
    print()
    data_list.append(data_dict)
  return data_list

def fetch_google_sheets_data(worksheet_name):
    # Open the worksheet
    worksheet = client.open('CrimeDataset').worksheet(worksheet_name)

    # Get all records from the worksheet
    records = worksheet.get_all_records()

    # Convert records to Pandas DataFrame
    df = pd.DataFrame(records)

    return df['crime Location']

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
                    otp = GenOtpAndStore(email)
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
    filename = 'frontend/files/ProcessedData_2.csv'
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
        # data = custom_data_converter(df)
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
