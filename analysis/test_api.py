import os
import requests
from dotenv import load_dotenv

# .env project root mein hai
load_dotenv()

BASE_URL = os.getenv("BASE_URL")
API_KEY = os.getenv("API_KEY")
PASSWORD = os.getenv("API_PASSWORD")

print("BASE_URL:", BASE_URL)
print("API_KEY loaded:", API_KEY is not None)
print("PASSWORD loaded:", PASSWORD is not None)

# 1. Health check
response = requests.get(f"{BASE_URL}/health")

print("\nHealth status:", response.status_code)
print(response.text)

# 2. Login
login_data = {
    "email": "demo1@ivy.homes",
    "password": PASSWORD
}

headers = {
    "X-API-Key": API_KEY
}

response = requests.post(
    f"{BASE_URL}/auth/login",
    headers=headers,
    json=login_data
)

print("\nLogin status:", response.status_code)
print(response.text)