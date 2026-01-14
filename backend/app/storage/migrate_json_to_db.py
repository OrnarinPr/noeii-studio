import json
import os

from app.storage.db_store import upsert_item

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "storage")
PROJECTS_FILE = os.path.join(DATA_DIR, "projects.json")
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")


def _load(path: str):
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def main():
    for x in _load(PROJECTS_FILE):
        upsert_item("projects", x)
    for x in _load(PRODUCTS_FILE):
        upsert_item("products", x)
    print("Migration complete")


if __name__ == "__main__":
    main()
