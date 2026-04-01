from fastapi import APIRouter, Depends
from schemas.enrollment_schema import EnrollmentCreate
from controllers.enrollment_controller import (
    enroll_student_controller,
    drop_course_controller,
    get_course_roster_controller
)
from utils.dependencies import get_current_student, get_current_instructor

router_enrollment = APIRouter(prefix="", tags=["Enrollments"])

@router_enrollment.post("/enroll")
async def enroll_student_route(data: EnrollmentCreate, current_user: dict = Depends(get_current_student)):
    return await enroll_student_controller(str(current_user["_id"]), data.course_id)

@router_enrollment.delete("/drop")
async def drop_course_route(data: EnrollmentCreate, current_user: dict = Depends(get_current_student)):
    return await drop_course_controller(str(current_user["_id"]), data.course_id)

@router_enrollment.get("/courses/{course_id}/students")
async def get_course_roster_route(course_id: str, current_user: dict = Depends(get_current_instructor)):
    return await get_course_roster_controller(course_id, str(current_user["_id"]))
