from services.enrollment_service import enroll_student, drop_course, get_course_roster

async def enroll_student_controller(student_id: str, course_id: str):
    return await enroll_student(student_id, course_id)

async def drop_course_controller(student_id: str, course_id: str):
    return await drop_course(student_id, course_id)

async def get_course_roster_controller(course_id: str, instructor_id: str):
    return await get_course_roster(course_id, instructor_id)
