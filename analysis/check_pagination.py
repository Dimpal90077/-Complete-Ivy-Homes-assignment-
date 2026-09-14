import os
import requests
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("BASE_URL")
API_KEY = os.getenv("API_KEY")
PASSWORD = os.getenv("API_PASSWORD")


def login():
    response = requests.post(
        f"{BASE_URL}/auth/login",
        headers={"X-API-Key": API_KEY},
        json={
            "email": "demo1@ivy.homes",
            "password": PASSWORD
        }
    )
    response.raise_for_status()
    return response.json()["access_token"]


def check(endpoint, token, params):
    response = requests.get(
        f"{BASE_URL}{endpoint}",
        headers={
            "X-API-Key": API_KEY,
            "Authorization": f"Bearer {token}"
        },
        params=params
    )

    print("\nEndpoint:", endpoint)
    print("Params:", params)
    print("Status:", response.status_code)

    data = response.json()

    if isinstance(data, dict):
        print("Response keys:", data.keys())
        print("Total:", data.get("total"))
        print("Page:", data.get("page"))
        print("Page size:", data.get("page_size"))
        print("Results count:", len(data.get("results", [])))
    elif isinstance(data, list):
        print("Response is list")
        print("Count:", len(data))


token = login()

for params in [
    {"limit": 10, "offset": 0},
    {"limit": 10, "offset": 10},
    {"limit": 10, "offset": 20},
    {"limit": 50, "offset": 0},
    {"limit": 50, "offset": 50},
    {"limit": 200, "offset": 0},
    {"limit": 50, "offset": 4200},
]:
    check("/v1/listings", token, params)