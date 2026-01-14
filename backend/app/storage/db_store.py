# backend/app/storage/db_store.py
from __future__ import annotations

from typing import Any, Dict, List, Optional, Literal
from sqlalchemy import text
from sqlalchemy.orm import Session

# Adjust this import to match your db.py:
# - If you have SessionLocal = sessionmaker(...), use that.
# - If you have get_db() dependency, you can pass Session into functions instead.
try:
    from app.db import SessionLocal  # type: ignore
except Exception:  # pragma: no cover
    SessionLocal = None  # type: ignore


TableName = Literal["projects", "products"]


def _get_session(external_session: Optional[Session] = None) -> Session:
    if external_session is not None:
        return external_session
    if SessionLocal is None:
        raise RuntimeError("SessionLocal is not available. Check app.db import.")
    return SessionLocal()


def list_items(table: TableName, db: Optional[Session] = None) -> List[Dict[str, Any]]:
    session = _get_session(db)
    close_after = db is None
    try:
        rows = session.execute(text(f"select data from {table} order by updated_at desc")).all()
        return [r[0] for r in rows]
    finally:
        if close_after:
            session.close()


def upsert_item(table: TableName, item: Dict[str, Any], db: Optional[Session] = None) -> Dict[str, Any]:
    if "id" not in item or not item["id"]:
        raise ValueError("item must contain a non-empty 'id'")

    session = _get_session(db)
    close_after = db is None
    try:
        session.execute(
            text(
                f"""
                insert into {table} (id, data)
                values (:id::text, :data::jsonb)
                on conflict (id) do update
                set data = excluded.data,
                    updated_at = now()
                """
            ),
            {"id": str(item["id"]), "data": item},
        )
        session.commit()
        return item
    finally:
        if close_after:
            session.close()


def delete_item(table: TableName, item_id: str, db: Optional[Session] = None) -> None:
    session = _get_session(db)
    close_after = db is None
    try:
        session.execute(text(f"delete from {table} where id = :id"), {"id": item_id})
        session.commit()
    finally:
        if close_after:
            session.close()
