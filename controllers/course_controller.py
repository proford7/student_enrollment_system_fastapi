from services.course_service import create_course, get_all_courses, get_course_by_id, delete_course

async def create_course_controller(data, instructor_id: str):
    return await create_course(data, instructor_id)

async def get_all_courses_controller():
    return await get_all_courses()

async def get_course_by_id_controller(course_id: str):
    return await get_course_by_id(course_id)

async def delete_course_controller(course_id: str, instructor_id: str):
    return await delete_course(course_id, instructor_id)
