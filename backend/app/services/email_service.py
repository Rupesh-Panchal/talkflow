import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config.settings import (SMTP_HOST, SMTP_PORT, SMTP_EMAIL, SMTP_PASSWORD, SMTP_FROM,)


async def send_email_otp(to_email: str, otp: str):
    subject = "TalkFlow Login OTP"

    html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>TalkFlow</h2>

                <p>Your login OTP is:</p>

                <h1 style="color:#2563eb;">
                    {otp}
                </h1>

                <p>This OTP will expire in <b>5 minutes</b>.</p>

                <p>If you didn't request this login, you can ignore this email.</p>

                <br>

                <p>Regards,<br>TalkFlow Team</p>
            </body>
        </html>
    """

    message = MIMEMultipart("alternative")
    message["From"] = f"{SMTP_FROM} <{SMTP_EMAIL}>"
    message["To"] = to_email
    message["Subject"] = subject

    message.attach(MIMEText(html_body, "html"))

    await aiosmtplib.send(
        message,
        hostname=SMTP_HOST,
        port=SMTP_PORT,
        username=SMTP_EMAIL,
        password=SMTP_PASSWORD,
        start_tls=True,
    )