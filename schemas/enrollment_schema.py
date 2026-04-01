from pydantic import BaseModel
from datetime import datetime
from typing import List

class EnrollmentCreate(BaseModel):
    course_id: str

class EnrollmentResponse(BaseModel):
    id: str
    student_id: str
    course_id: str
    enrolled_at: datetime

class RosterStudent(BaseModel):
    student_id: str
    name: str
    email: str
    enrolled_at: datetime

class RosterResponse(BaseModel):
    course_id: str
    students: List[RosterStudent]
