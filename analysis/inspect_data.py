import json
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent / "data"

for filename in ["listings.json", "rentals.json", "projects.json"]:
    path = DATA_DIR / filename

    with open(path, "r", encoding="utf-8") as file:
        data = json.load(file)

    print("\n" + "=" * 70)
    print(filename)
    print("=" * 70)

    print("Number of records:", len(data))

    if len(data) > 0:
        print("\nColumns / Keys:")
        print(list(data[0].keys()))

        print("\nFirst record:")
        print(json.dumps(data[0], indent=2, ensure_ascii=False))