from fastapi import APIRouter, Depends
from app.models import Project
from app.auth import require_admin
from app.storage.db_store import list_items, upsert_item, delete_item

router = APIRouter()


@router.get("")
def get_projects():
    return list_items("projects")


@router.get("/{project_id}")
def get_project(project_id: str):
    items = list_items("projects")
    for x in items:
        if x.get("id") == project_id:
            return x
    return None


@router.post("")
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
