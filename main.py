from fastapi import FastAPI
from contextlib import asynccontextmanager
import pymongo
from database import enrollments_collection
from routes.auth_routes import router as auth_router
from routes.course_routes import router as course_router
from routes.enrollment_routes import router_enrollment

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create a compound unique index to prevent duplicate enrollments
    await enrollments_collection.create_index(
        [("student_id", pymongo.ASCENDING), ("course_id", pymongo.ASCENDING)],
        unique=True
    )
    yield
    # Shutdown logic if necessary

app = FastAPI(lifespan=lifespan)

app.include_router(auth_router)
app.include_router(course_router)
app.include_router(router_enrollment)