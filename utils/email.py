from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from pydantic import EmailStr
from typing import List
from config.settings import settings

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=settings.MAIL_STARTTLS,
    MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    USE_CREDENTIALS=settings.USE_CREDENTIALS,
    VALIDATE_CERTS=True
)

async def send_verification_email(email: EmailStr, token: str):
    # Construct the verification link
    # We will use Postman to test, but the link would point to the verify endpoint
    verification_link = f"http://localhost:8000/auth/verify-email?token={token}"
    
    html = f"""
    <p>Please click the link below to verify your email address:</p>
    <a href="{verification_link}">{verification_link}</a>
    """

    message = MessageSchema(
        subject="Verify your email address",
        recipients=[email],
        body=html,
        subtype=MessageType.html
    )

    # Note: If email settings are not configured properly, this will fail.
    # In a real app we'd wrap this in a try-except block, or log the link directly 
    # to terminal for easy testing.
    fm = FastMail(conf)
    try:
        await fm.send_message(message)
        print(f"Verification email sent to {email}")
    except Exception as e:
        print(f"Failed to send email to {email}: {e}")
        # For testing purposes without valid credentials, print the link to the console
        print(f"TESTING - Verification Link: {verification_link}")
