import json
from pathlib import Path
from collections import Counter

DATA_DIR = Path(__file__).resolve().parent / "data"


def load_json(filename):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as file:
        return json.load(file)


listings = load_json("listings.json")
rentals = load_json("rentals.json")
projects = load_json("projects.json")


def show_distribution(data, field):
    counter = Counter(item.get(field) for item in data)
    print(f"\n{field}")
    print(counter.most_common(20))


print("\n========== LISTING PROFILING ==========")

for field in [
    "website",
    "property_type",
    "bedroom",
    "bathroom",
    "posted_by",
    "is_verified",
    "is_live",
]:
    show_distribution(listings, field)


print("\n========== LISTING NUMERIC RANGES ==========")

numeric_fields = [
    "price",
    "carpet_area",
    "super_built_up_area",
    "latitude",
    "longitude",
    "floor",
    "total_floors",
    "bedroom",
    "bathroom",
]

for field in numeric_fields:
    values = [
        item.get(field)
        for item in listings
        if isinstance(item.get(field), (int, float))
    ]

    if values:
        print(
            field,
            "| min =", min(values),
            "| max =", max(values),
            "| nulls =", sum(item.get(field) is None for item in listings)
        )


print("\n========== POSSIBLE CORRUPT LISTINGS ==========")

for item in listings:
    problems = []

    if not item.get("listing_id"):
        problems.append("missing listing_id")

    if not item.get("listing_url"):
        problems.append("missing listing_url")

    if not isinstance(item.get("price"), (int, float)) or item.get("price", 0) <= 0:
        problems.append("invalid price")

    if not isinstance(item.get("bedroom"), int) or item.get("bedroom", 0) <= 0:
        problems.append("invalid bedroom")

    if not isinstance(item.get("bathroom"), (int, float)) or item.get("bathroom", 0) <= 0:
        problems.append("invalid bathroom")

    if not isinstance(item.get("carpet_area"), (int, float)) or item.get("carpet_area", 0) <= 0:
        problems.append("invalid carpet area")

    if not isinstance(item.get("latitude"), (int, float)) or not (-90 <= item.get("latitude") <= 90):
        problems.append("invalid latitude")

    if not isinstance(item.get("longitude"), (int, float)) or not (-180 <= item.get("longitude") <= 180):
        problems.append("invalid longitude")

    if isinstance(item.get("floor"), (int, float)) and isinstance(item.get("total_floors"), (int, float)):
        if item["floor"] > item["total_floors"]:
            problems.append("floor greater than total floors")

    if problems:
        print(item.get("listing_id"), problems)


print("\n========== SUSPICIOUS DESCRIPTIONS ==========")

keywords = [
    "fake",
    "scam",
    "duplicate",
    "fraud",
    "invalid",
    "urgent sale",
    "too good",
]

for item in listings:
    description = str(item.get("description", "")).lower()

    matched = [word for word in keywords if word in description]

    if matched:
        print(item.get("listing_id"), matched, description)


print("\n========== PROJECT COUNTS ==========")

actual_counts = Counter(
    item.get("project_id")
    for item in listings
    if item.get("project_id")
)

print("Projects referenced by listings:", len(actual_counts))

missing_project_ids = [
    item.get("project_id")
    for item in listings
    if not item.get("project_id")
]

print("Listings without project_id:", len(missing_project_ids))

print("\nProject count comparison sample:")

for project in projects[:30]:
    project_id = project.get("project_id")
    documented = project.get("total_listings")
    actual = actual_counts.get(project_id, 0)

    print(
        project_id,
        "| documented =", documented,
        "| actual =", actual,
        "| difference =", documented - actual if isinstance(documented, int) else "N/A"
    )