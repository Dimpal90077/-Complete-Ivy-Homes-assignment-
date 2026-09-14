import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("BASE_URL")
API_KEY = os.getenv("API_KEY")
PASSWORD = os.getenv("API_PASSWORD")
EMAIL = "demo1@ivy.homes"

DATA_DIR = Path(__file__).resolve().parent / "data"
DATA_DIR.mkdir(exist_ok=True)


def login():
    response = requests.post(
        f"{BASE_URL}/auth/login",
        headers={
            "X-API-Key": API_KEY
        },
        json={
            "email": EMAIL,
            "password": PASSWORD
        },
        timeout=30
    )

    response.raise_for_status()
    data = response.json()

    print("Login successful")
    print("Token expires in:", data.get("expires_in"), "seconds")

    return data["access_token"]


def fetch_all(endpoint, token):
    headers = {
        "X-API-Key": API_KEY,
        "Authorization": f"Bearer {token}"
    }

    all_records = []
    offset = 0
    limit = 50
    total = None

    while True:
        response = requests.get(
            f"{BASE_URL}{endpoint}",
            headers=headers,
            params={
                "limit": limit,
                "offset": offset
            },
            timeout=30
        )

        print(
            f"{endpoint} | offset={offset} | "
            f"status={response.status_code}"
        )

        response.raise_for_status()
        data = response.json()

        records = data.get("results", [])
        total = data.get("total")
        has_more = data.get("has_more")

        print(
            f"Received={len(records)}, "
            f"Total={total}, "
            f"Has more={has_more}, "
            f"API offset={data.get('offset')}"
        )

        # No records means stop
        if not records:
            break

        all_records.extend(records)

        print("Collected so far:", len(all_records))

        # Stop once expected total has been collected
        if total is not None and len(all_records) >= total:
            break

        # Stop if API says no more records
        if not has_more:
            break

        # Move to next page
        offset += len(records)

    # Remove extra records returned by final page
    if total is not None:
        all_records = all_records[:total]

    print(
        f"Final records from {endpoint}: "
        f"{len(all_records)}"
    )

    return all_records


def save_json(filename, records):
    path = DATA_DIR / filename

    with open(path, "w", encoding="utf-8") as file:
        json.dump(
            records,
            file,
            indent=2,
            ensure_ascii=False
        )

    print("Saved:", path)


def main():
    token = login()

    print("\nDownloading listings...")
    listings = fetch_all("/v1/listings", token)

    print("\nDownloading rentals...")
    rentals = fetch_all("/v1/rentals", token)

    print("\nDownloading projects...")
    projects = fetch_all("/v1/projects", token)

    print("\nSaving files...")
    save_json("listings.json", listings)
    save_json("rentals.json", rentals)
    save_json("projects.json", projects)

    print("\nDownload completed successfully!")


if __name__ == "__main__":
    main()