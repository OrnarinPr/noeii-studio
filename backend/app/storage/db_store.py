from __future__ import annotations

import os
from typing import Any, Dict, List, Optional, Literal

from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

load_dotenv()

TableName = Literal["projects", "products"]

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set (backend/.env)")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def _session(db: Optional[Session] = None) -> Session:
    return db or SessionLocal()


def list_items(table: TableName, db: Optional[Session] = None) -> List[Dict[str, Any]]:
    s = _session(db)
    close_after = db is None
    try:
        rows = s.execute(text(f"select * from public.{table} order by updated_at desc")).mappings().all()
        return [dict(r) for r in rows]
    finally:
        if close_after:
            s.close()


def get_item_by_id(table: TableName, item_id: str, db: Optional[Session] = None) -> Optional[Dict[str, Any]]:
    s = _session(db)
    close_after = db is None
    try:
        row = s.execute(
            text(f"select * from public.{table} where id = :id"),
            {"id": item_id},
        ).mappings().first()
        return dict(row) if row else None
    finally:
        if close_after:
            s.close()


def upsert_item(table: TableName, item: Dict[str, Any], db: Optional[Session] = None) -> Dict[str, Any]:
    if not item.get("id"):
        raise ValueError("item must contain a non-empty 'id'")

    # Ensure arrays exist
    if table == "projects":
        item.setdefault("details", [])
        item.setdefault("tags", [])

        sql = text(
            """
            insert into public.projects
            (id, image, title, subtitle, location, year, category, material, description, details, area, status, tags)
            values
            (:id, :image, :title, :subtitle, :location, :year, :category, :material, :description, :details, :area, :status, :tags)
            on conflict (id) do update set
              image = excluded.image,
              title = excluded.title,
              subtitle = excluded.subtitle,
              location = excluded.location,
              year = excluded.year,
              category = excluded.category,
              material = excluded.material,
              description = excluded.description,
              details = excluded.details,
              area = excluded.area,
              status = excluded.status,
              tags = excluded.tags,
              updated_at = now()
            """
        )
    else:
        sql = text(
            """
            insert into public.products
            (id, name, image, description, category)
            values
            (:id, :name, :image, :description, :category)
            on conflict (id) do update set
              name = excluded.name,
              image = excluded.image,
              description = excluded.description,
              category = excluded.category,
              updated_at = now()
            """
        )

    s = _session(db)
    close_after = db is None
    try:
        s.execute(sql, item)
        s.commit()
        return item
    finally:
        if close_after:
            s.close()


def delete_item(table: TableName, item_id: str, db: Optional[Session] = None) -> None:
    s = _session(db)
    close_after = db is None
    try:
        s.execute(text(f"delete from public.{table} where id = :id"), {"id": item_id})
        s.commit()
    finally:
        if close_after:
            s.close()
