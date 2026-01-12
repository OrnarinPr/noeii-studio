from typing import List, Literal, Optional
from pydantic import BaseModel

ProjectCategory = Literal[
    "Residence", "Villa", "Hotel", "Gallery", "Office", "Cultural", "Commercial", "Public"
]
ProjectStatus = Literal["Completed", "In Progress", "Concept"]

class Project(BaseModel):
    id: str
    image: str
    title: str
    subtitle: str
    location: str
    year: str
    category: ProjectCategory
    material: str
    description: str
    details: List[str]
    area: str
    status: ProjectStatus
    tags: List[str]

ProductCategory = Literal["Seating", "Tables", "Lighting", "Objects", "Storage"]

class Product(BaseModel):
    id: str
    name: str
    image: str
    description: str
    category: ProductCategory
