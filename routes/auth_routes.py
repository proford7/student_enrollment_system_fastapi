from fastapi import APIRouter
from schemas.user_schema import UserRegister, UserLogin
from controllers.auth_controller import register_controller, login_controller, verify_email_controller

router = APIRouter(prefix="/auth")


@router.post("/register")
async def register(data: UserRegister):
    return await register_controller(data)

@router.post("/login")
async def login(data: UserLogin):
    return await login_controller(data)

@router.get("/verify-email")
async def verify_email(token: str):
    return await verify_email_controller(token)