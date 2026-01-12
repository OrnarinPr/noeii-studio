from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes.admin_auth import router as admin_router
from app.routes.projects import router as projects_router
from app.routes.products import router as products_router
from app.routes.uploads import router as uploads_router

app = FastAPI(title="NOEII Studio API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)


# IMPORTANT: make sure this folder exists
app.mount("/uploads", StaticFiles(directory="app/storage/uploads"), name="uploads")

app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(projects_router, prefix="/api/projects", tags=["projects"])
app.include_router(products_router, prefix="/api/products", tags=["products"])
app.include_router(uploads_router, prefix="/api/uploads", tags=["uploads"])


@app.get("/api/health")
def health():
    return {"ok": True}
