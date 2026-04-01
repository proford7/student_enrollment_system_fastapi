from database import users_collection
from utils.hash import hash_password, verify_password
from utils.jwt_handler import create_token, create_verification_token, verify_token
from utils.email import send_verification_email

async def register_user(data):
    existing = await users_collection.find_one({"email": data.email})
    
    if existing:
        return {"error": "User already exists"}

    hashed_password = hash_password(data.password)

    user = {
        "name": data.name,
        "email": data.email,
        "password": hashed_password,
        "is_verified": False,
        "role": data.role
    }

    await users_collection.insert_one(user)

    verification_token = create_verification_token(user["email"])
    await send_verification_email(user["email"], verification_token)

    return {"message": "User registered successfully. Please check your email to verify your account."}

async def login_user(data):
    user = await users_collection.find_one({"email": data.email})

    if not user:
        return {"error": "User not found"}
        
    if not user.get("is_verified", False):
        return {"error": "Please verify your email address before logging in"}

    if not verify_password(data.password, user["password"]):
        return {"error": "Invalid password"}

    token = create_token({"email": user["email"], "role": user.get("role", "student")})

    return {
        "message": "Login successful",
        "token": token
    }

async def verify_email_service(token: str):
    try:
        payload = verify_token(token)
    except Exception as e:
        return {"error": "Invalid or expired token"}
    
    email = payload.get("email")
    token_type = payload.get("type")
    
    if not email or token_type != "verification":
        return {"error": "Invalid token type"}
        
    user = await users_collection.find_one({"email": email})
    if not user:
        return {"error": "User not found"}
        
    if user.get("is_verified"):
        return {"message": "Email is already verified"}
        
    await users_collection.update_one(
        {"email": email},
        {"$set": {"is_verified": True}}
    )
    
    return {"message": "Email successfully verified. You can now login."}