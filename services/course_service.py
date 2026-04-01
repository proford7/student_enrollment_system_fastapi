from database import courses_collection, enrollments_collection
from schemas.course_schema import CourseCreate
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException

async def create_course(data: CourseCreate, instructor_id: str):
    new_course = {
        "title": data.title,
        "description": data.description,
        "instructor_id": instructor_id,
        "created_at": datetime.utcnow()
    }
    result = await courses_collection.insert_one(new_course)
    new_course["id"] = str(result.inserted_id)
    new_course.pop("_id", None)
    return new_course

async def get_all_courses():
    courses = []
    async for course in courses_collection.find():
        course["id"] = str(course["_id"])
        course.pop("_id", None)
        courses.append(course)
    return courses

async def get_course_by_id(course_id: str):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")
    
    course = await courses_collection.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    course["id"] = str(course["_id"])
    course.pop("_id", None)
    return course

async def delete_course(course_id: str, instructor_id: str):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")
        
    course = await courses_collection.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    if course["instructor_id"] != instructor_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this course")
        
    await courses_collection.delete_one({"_id": ObjectId(course_id)})
    
    # Cascading delete: delete all enrollments for this course
    await enrollments_collection.delete_many({"course_id": course_id})
    
    return {"message": "Course deleted successfully"}
