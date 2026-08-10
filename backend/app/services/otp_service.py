import random
from datetime import datetime, timedelta

from app.models.otp_model import otp_collection


def generate_otp():
    return str(random.randint(100000, 999999))


async def save_otp(identifier: str, otp: str, purpose: str = "login"):
    expires_at = datetime.utcnow() + timedelta(minutes=5)

    await otp_collection.delete_many({
        "identifier": identifier,
        "purpose": purpose
    })

    await otp_collection.insert_one({
        "identifier": identifier,
        "otp": otp,
        "purpose": purpose,
        "verified": False,
        "created_at": datetime.utcnow(),
        "expires_at": expires_at
    })


async def verify_otp(identifier: str, otp: str, purpose: str = "login"):
    otp_record = await otp_collection.find_one({
        "identifier": identifier,
        "otp": otp,
        "purpose": purpose
    })

    if not otp_record:
        return None

    if otp_record.get("verified", False):
        return None

    if otp_record["expires_at"] < datetime.utcnow():
        return None

    return otp_record