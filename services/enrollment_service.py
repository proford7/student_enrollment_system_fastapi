from database import enrollments_collection, courses_collection, users_collection
from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from pymongo.errors import DuplicateKeyError

async def enroll_student(student_id: str, course_id: str):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")
        
    course = await courses_collection.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    enrollment = {
        "student_id": student_id,
        "course_id": course_id,
        "enrolled_at": datetime.utcnow()
    }
    
    try:
        result = await enrollments_collection.insert_one(enrollment)
        enrollment["id"] = str(result.inserted_id)
        enrollment.pop("_id", None)
        return enrollment
    except DuplicateKeyError:
        raise HTTPException(status_code=400, detail="Already enrolled in this course")

async def drop_course(student_id: str, course_id: str):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")
        
    result = await enrollments_collection.delete_one({"student_id": student_id, "course_id": course_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enrollment not found")
        
    return {"message": "Successfully dropped the course"}
    

async def get_course_roster(course_id: str, instructor_id: str):
    if not ObjectId.is_valid(course_id):
        raise HTTPException(status_code=400, detail="Invalid course ID")
        
    course = await courses_collection.find_one({"_id": ObjectId(course_id)})
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    if course["instructor_id"] != instructor_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this roster")
        
    # fetch enrollments
    enrollments = []
    async for en in enrollments_collection.find({"course_id": course_id}):
        enrollments.append(en)
        
    # extract user objects
    student_details = []
    for en in enrollments:
        student_obj_id = ObjectId(en["student_id"]) if ObjectId.is_valid(en["student_id"]) else None
        if not student_obj_id: continue
        
        user = await users_collection.find_one({"_id": student_obj_id})
        if user:
            student_details.append({
                "student_id": str(user["_id"]),
                "name": user.get("name"),
                "email": user.get("email"),
                "enrolled_at": en["enrolled_at"]
            })
            
    return {
        "course_id": course_id,
        "students": student_details
    }
