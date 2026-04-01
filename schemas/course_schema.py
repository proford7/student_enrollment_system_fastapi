from pydantic import BaseModel
from datetime import datetime

class CourseCreate(BaseModel):
    title: str
    description: str

class CourseResponse(BaseModel):
    id: str
    title: str
    description: str
    instructor_id: str
    created_at: datetime
