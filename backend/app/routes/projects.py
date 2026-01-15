from fastapi import APIRouter, Depends, HTTPException
from app.models import Project
from app.auth import require_admin
from app.storage.db_store import list_items, upsert_item, delete_item, get_item_by_id

router = APIRouter()


@router.get("/")
def get_projects():
    return list_items("projects")


@router.get("/{project_id}")
def get_project(project_id: str):
    item = get_item_by_id("projects", project_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return item


@router.post("/")
def create_project(project: Project, _=Depends(require_admin)):
    return upsert_item("projects", project.model_dump())


@router.put("/{project_id}")
def update_project(project_id: str, project: Project, _=Depends(require_admin)):
    data = project.model_dump()
    data["id"] = project_id
    return upsert_item("projects", data)


@router.delete("/{project_id}")
def remove_project(project_id: str, _=Depends(require_admin)):
    delete_item("projects", project_id)
    return {"ok": True}
