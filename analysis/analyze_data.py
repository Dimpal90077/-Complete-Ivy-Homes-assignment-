import json
from pathlib import Path
from collections import Counter
from datetime import datetime, timedelta

DATA_DIR = Path(__file__).resolve().parent / "data"
ROOT_DIR = Path(__file__).resolve().parent.parent


def load_json(filename):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as file:
        return json.load(file)


listings = load_json("listings.json")
rentals = load_json("rentals.json")
projects = load_json("projects.json")


# --------------------------------------------------
# 1. Total listing records
# --------------------------------------------------
total_listing_records = len(listings)


# --------------------------------------------------
# 2. Unique properties
# --------------------------------------------------
# Use listing URL as the unique property reference
unique_properties = len(
    set(item.get("listing_url") for item in listings if item.get("listing_url"))
)


# --------------------------------------------------
# 3. Active listings
# --------------------------------------------------
active_listings = sum(
    1 for item in listings
    if item.get("is_live") is True
)


# --------------------------------------------------
# 4. Corrupt listing IDs
# --------------------------------------------------
corrupt_listing_ids = []

for item in listings:
    problems = []

    price = item.get("price")
    bedroom = item.get("bedroom")
    bathroom = item.get("bathroom")
    carpet_area = item.get("carpet_area")
    latitude = item.get("latitude")
    longitude = item.get("longitude")
    floor = item.get("floor")
    total_floors = item.get("total_floors")

    if not item.get("listing_id"):
        problems.append("missing listing_id")

    if not item.get("listing_url"):
        problems.append("missing listing_url")

    if not isinstance(price, (int, float)) or price <= 0:
        problems.append("invalid price")

    if not isinstance(bedroom, (int, float)) or bedroom <= 0:
        problems.append("invalid bedroom")

    if not isinstance(bathroom, (int, float)) or bathroom <= 0:
        problems.append("invalid bathroom")

    if not isinstance(carpet_area, (int, float)) or carpet_area <= 0:
        problems.append("invalid carpet_area")

    if not isinstance(latitude, (int, float)) or not (-90 <= latitude <= 90):
        problems.append("invalid latitude")

    if not isinstance(longitude, (int, float)) or not (-180 <= longitude <= 180):
        problems.append("invalid longitude")

    if (
        isinstance(floor, (int, float))
        and isinstance(total_floors, (int, float))
        and floor > total_floors
    ):
        problems.append("floor greater than total_floors")

    if problems:
        corrupt_listing_ids.append(item.get("listing_id"))


# --------------------------------------------------
# 5. Total monthly rent
# --------------------------------------------------
total_monthly_rent = sum(
    item.get("price", 0)
    for item in rentals
    if isinstance(item.get("price"), (int, float))
    and item.get("price", 0) > 0
)


# --------------------------------------------------
# 6. Average price per sqft for 2BHK
# --------------------------------------------------
two_bhk = [
    item for item in listings
    if item.get("bedroom") == 2
    and isinstance(item.get("price"), (int, float))
    and item.get("price") > 0
    and isinstance(item.get("carpet_area"), (int, float))
    and item.get("carpet_area") > 0
]

price_per_sqft_values = [
    item["price"] / item["carpet_area"]
    for item in two_bhk
]

avg_price_per_sqft_2bhk = (
    sum(price_per_sqft_values) / len(price_per_sqft_values)
    if price_per_sqft_values
    else 0
)


# --------------------------------------------------
# 7. Costliest project
# --------------------------------------------------
costliest_project = max(
    projects,
    key=lambda item: item.get("price_max", 0) or 0
)

costliest_project_result = {
    "project_id": costliest_project.get("project_id"),
    "apartment_name": costliest_project.get("apartment_name"),
    "price_max": costliest_project.get("price_max"),
}


# --------------------------------------------------
# 8. Listings posted in last 7 days
# Reference date: 2026-09-10
# --------------------------------------------------
reference_date = datetime.fromisoformat("2026-09-10T00:00:00")
start_date = reference_date - timedelta(days=7)

listings_last_7_days = []

for item in listings:
    posted_at = item.get("posted_at")

    if not posted_at:
        continue

    try:
        posted_date = datetime.fromisoformat(
            posted_at.replace("Z", "")
        )

        if start_date <= posted_date <= reference_date:
            listings_last_7_days.append(item)

    except ValueError:
        continue


# --------------------------------------------------
# 9. Fake listing IDs
# --------------------------------------------------
fake_listing_ids = []

strong_fake_signals = [
    "pay a token amount",
    "pay a token amount of",
    "booking amount is paid",
    "site visit only after",
    "below market price",
]

for item in listings:
    description = str(item.get("description", "")).lower()

    if any(signal in description for signal in strong_fake_signals):
        fake_listing_ids.append(item.get("listing_id"))


# --------------------------------------------------
# 10. Projects with wrong listing count
# --------------------------------------------------
actual_listing_counts = Counter(
    item.get("project_id")
    for item in listings
    if item.get("project_id")
)

projects_with_wrong_listing_count = []

for project in projects:
    project_id = project.get("project_id")
    documented_count = project.get("total_listings")
    actual_count = actual_listing_counts.get(project_id, 0)

    if documented_count != actual_count:
        projects_with_wrong_listing_count.append(project_id)


# --------------------------------------------------
# Additional diagnostics
# --------------------------------------------------
unique_project_ids = len(
    set(item.get("project_id") for item in listings if item.get("project_id"))
)

unique_apartment_names = len(
    set(item.get("apartment_name") for item in listings if item.get("apartment_name"))
)

unique_listing_urls = len(
    set(item.get("listing_url") for item in listings if item.get("listing_url"))
)

print("========== DIAGNOSTICS ==========")
print("Unique project IDs:", unique_project_ids)
print("Unique apartment names:", unique_apartment_names)
print("Unique listing URLs:", unique_listing_urls)
print("Listings without project_id:", sum(
    1 for item in listings if not item.get("project_id")
))

print("\n========== FINAL RESULTS ==========")
print("Total listing records:", total_listing_records)
print("Unique properties:", unique_properties)
print("Active listings:", active_listings)
print("Corrupt listing count:", len(corrupt_listing_ids))
print("Corrupt listing IDs:", corrupt_listing_ids)
print("Total monthly rent:", total_monthly_rent)
print(
    "Average price per sqft for 2BHK:",
    round(avg_price_per_sqft_2bhk, 2)
)
print("Costliest project:", costliest_project_result)
print("Listings last 7 days:", len(listings_last_7_days))
print("Fake listing count:", len(fake_listing_ids))
print("Fake listing IDs:", fake_listing_ids)
print(
    "Projects with wrong listing count:",
    len(projects_with_wrong_listing_count)
)
print(projects_with_wrong_listing_count)


# --------------------------------------------------
# Save submission.json
# --------------------------------------------------
submission = {
    "total_listing_records": total_listing_records,
    "unique_properties": unique_properties,
    "active_listings": active_listings,
    "corrupt_listing_ids": corrupt_listing_ids,
    "total_monthly_rent": total_monthly_rent,
    "avg_price_per_sqft_2bhk": round(avg_price_per_sqft_2bhk, 2),
    "costliest_project": costliest_project_result,
    "listings_last_7_days": len(listings_last_7_days),
    "fake_listing_ids": fake_listing_ids,
    "projects_with_wrong_listing_count": projects_with_wrong_listing_count,
}

with open(ROOT_DIR / "submission.json", "w", encoding="utf-8") as file:
    json.dump(submission, file, indent=2, ensure_ascii=False)

print("\nsubmission.json updated successfully!")