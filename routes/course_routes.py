from fastapi import APIRouter, Depends
from schemas.course_schema import CourseCreate
from controllers.course_controller import (
    create_course_controller, 
    get_all_courses_controller,
    get_course_by_id_controller,
    delete_course_controller
)
from utils.dependencies import get_current_instructor

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.post("")
async def create_course_route(data: CourseCreate, current_user: dict = Depends(get_current_instructor)):
    return await create_course_controller(data, str(current_user["_id"]))

@router.get("")
async def get_all_courses_route():
    return await get_all_courses_controller()

@router.get("/{course_id}")
async def get_course_by_id_route(course_id: str):
    return await get_course_by_id_controller(course_id)

@router.delete("/{course_id}")
async def delete_course_route(course_id: str, current_user: dict = Depends(get_current_instructor)):
    return await delete_course_controller(course_id, str(current_user["_id"]))
