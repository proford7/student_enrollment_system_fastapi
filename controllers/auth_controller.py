from services.auth_service import register_user, login_user, verify_email_service

async def register_controller(data):
    return await register_user(data)

async def login_controller(data):
    return await login_user(data)

async def verify_email_controller(token: str):
    return await verify_email_service(token)