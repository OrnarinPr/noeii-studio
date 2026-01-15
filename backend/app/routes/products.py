from fastapi import APIRouter, Depends, HTTPException
from app.models import Product
from app.auth import require_admin
from app.storage.db_store import list_items, upsert_item, delete_item, get_item_by_id

router = APIRouter()


@router.get("/")
def get_products():
    return list_items("products")


@router.get("/{product_id}")
def get_product(product_id: str):
    item = get_item_by_id("products", product_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return item


@router.post("/")
def create_product(product: Product, _=Depends(require_admin)):
    return upsert_item("products", product.model_dump())


@router.put("/{product_id}")
def update_product(product_id: str, product: Product, _=Depends(require_admin)):
    data = product.model_dump()
    data["id"] = product_id
    return upsert_item("products", data)


@router.delete("/{product_id}")
def remove_product(product_id: str, _=Depends(require_admin)):
    delete_item("products", product_id)
    return {"ok": True}
