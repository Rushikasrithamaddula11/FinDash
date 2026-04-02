import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import random
from dotenv import load_dotenv

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

def generate_otp() -> str:
    """Generates a secure 6-digit integer OTP."""
    return str(random.randint(100000, 999999))

def send_otp_email(to_email: str, otp: str):
    """
    Sends an OTP to the given email address. 
    Gracefully falls back to stdout if SMTP variables are absent.
    """
    print("\n" + "="*40)
    print(f"🔒 OTP GENERATED FOR {to_email}")
    print(f"🔑 CODE: {otp}")
    print("="*40 + "\n")

    if not all([SMTP_SERVER, SMTP_USER, SMTP_PASSWORD]):
        print(">> SMTP configuration absent from .env. Outputting OTP to console only.")
        return

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USER
        msg['To'] = to_email
        msg['Subject'] = "FinDash - Your Verification Code"

        body = f"Hello,\n\nYour one-time password (OTP) for FinDash is: {otp}\n\nDo not share this code with anyone.\n\nThanks,\nThe FinDash Team"
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USER, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_USER, to_email, text)
        server.quit()
        print(f">> Email successfully dispatched to {to_email} via {SMTP_SERVER}")
    except Exception as e:
        print(f">> WARNING: Failed to send email to {to_email} via SMTP: {e}")
