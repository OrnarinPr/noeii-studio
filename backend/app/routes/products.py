from fastapi import APIRouter, Depends
from app.models import Product
from app.db import PRODUCTS_FILE, list_items, upsert_item, delete_item
from app.auth import require_admin

router = APIRouter()

@router.get("")
def get_products():
    return list_items(PRODUCTS_FILE)

@router.get("/{product_id}")
def get_product(product_id: str):
    items = list_items(PRODUCTS_FILE)
    for x in items:
        if x.get("id") == product_id:
            return x
    return None

@router.post("")
def create_product(product: Product, _=Depends(require_admin)):
    return upsert_item(PRODUCTS_FILE, product.model_dump())

@router.put("/{product_id}")
def update_product(product_id: str, product: Product, _=Depends(require_admin)):
    data = product.model_dump()
    data["id"] = product_id
    return upsert_item(PRODUCTS_FILE, data)

@router.delete("/{product_id}")
def remove_product(product_id: str, _=Depends(require_admin)):
    delete_item(PRODUCTS_FILE, product_id)
    return {"ok": True}
