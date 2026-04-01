from config.settings import settings
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(settings.MONGO_URI)
db = client[settings.DB_NAME]

# collections
users_collection = db["users"]
courses_collection = db["courses"]
enrollments_collection = db["enrollments"]