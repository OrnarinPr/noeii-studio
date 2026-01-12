import json
import os
from typing import Any, Dict, List

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "storage")
PROJECTS_FILE = os.path.join(DATA_DIR, "projects.json")
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")

def _ensure_file(path: str, default: Any) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path):
        with open(path, "w", encoding="utf-8") as f:
            json.dump(default, f, ensure_ascii=False, indent=2)

def read_json(path: str, default: Any) -> Any:
    _ensure_file(path, default)
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def write_json(path: str, data: Any) -> None:
    _ensure_file(path, data)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def list_items(path: str) -> List[Dict[str, Any]]:
    return read_json(path, default=[])

def upsert_item(path: str, item: Dict[str, Any]) -> Dict[str, Any]:
    items = list_items(path)
    idx = next((i for i, x in enumerate(items) if x.get("id") == item.get("id")), -1)
    if idx >= 0:
        items[idx] = item
    else:
        items.insert(0, item)
    write_json(path, items)
    return item

def delete_item(path: str, item_id: str) -> None:
    items = list_items(path)
    items = [x for x in items if x.get("id") != item_id]
    write_json(path, items)
