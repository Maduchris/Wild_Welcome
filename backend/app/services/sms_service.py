import requests
import asyncio
from app.core.config import settings
from typing import Optional


class SMSService:
    def __init__(self):
        self.api_key = settings.gupshup_api_key
        self.app_name = settings.gupshup_app_name
        self.base_url = settings.gupshup_base_url

    async def send_sms(self, phone_number: str, message: str) -> bool:
        """Send SMS using Gupshup API"""
        try:
            url = f"{self.base_url}/msg"
            
            headers = {
                "apikey": self.api_key,
                "Content-Type": "application/x-www-form-urlencoded"
            }
            
            data = {
                "channel": "sms",
                "source": self.app_name,
                "destination": phone_number,
                "message": message,
                "src.name": self.app_name
            }
            
            # Make async request
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: requests.post(url, headers=headers, data=data)
            )
            
            if response.status_code == 202:
                return True
            else:
                print(f"SMS send failed: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            print(f"Error sending SMS: {e}")
            return False

    async def send_otp_sms(self, phone_number: str, otp: str) -> bool:
        """Send OTP via SMS"""
        message = f"Your Wild Welcome verification code is: {otp}. Valid for 10 minutes."
        return await self.send_sms(phone_number, message)

    async def send_booking_confirmation_sms(self, phone_number: str, booking_details: dict) -> bool:
        """Send booking confirmation SMS"""
        message = f"""
Wild Welcome Booking Confirmed!
Property: {booking_details.get('property_title', 'N/A')}
Check-in: {booking_details.get('check_in', 'N/A')}
Check-out: {booking_details.get('check_out', 'N/A')}
Guests: {booking_details.get('guests', 'N/A')}
Total: ${booking_details.get('total_price', 'N/A')}
        """.strip()
        return await self.send_sms(phone_number, message)

    async def send_booking_reminder_sms(self, phone_number: str, property_title: str, check_in: str) -> bool:
        """Send booking reminder SMS"""
        message = f"Wild Welcome Reminder: Your booking for {property_title} is tomorrow ({check_in}). Safe travels!"
        return await self.send_sms(phone_number, message)

    async def send_property_inquiry_sms(self, landlord_phone: str, property_title: str, guest_name: str) -> bool:
        """Send property inquiry notification to landlord"""
        message = f"Wild Welcome: New inquiry for {property_title} from {guest_name}. Check your dashboard for details."
        return await self.send_sms(landlord_phone, message)


sms_service = SMSService()