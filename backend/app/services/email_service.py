import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings
from typing import Optional
import asyncio
from concurrent.futures import ThreadPoolExecutor


class EmailService:
    def __init__(self):
        self.smtp_server = settings.email_host
        self.smtp_port = settings.email_port
        self.email_user = settings.email_host_user
        self.email_password = settings.email_host_password
        self.executor = ThreadPoolExecutor(max_workers=2)

    def _send_email_sync(self, to_email: str, subject: str, body: str, is_html: bool = False) -> bool:
        """Send email synchronously"""
        try:
            # Create message
            message = MIMEMultipart()
            message["From"] = self.email_user
            message["To"] = to_email
            message["Subject"] = subject

            # Add body
            if is_html:
                message.attach(MIMEText(body, "html"))
            else:
                message.attach(MIMEText(body, "plain"))

            # Connect and send
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_user, self.email_password)
            text = message.as_string()
            server.sendmail(self.email_user, to_email, text)
            server.quit()
            
            return True
        except Exception as e:
            print(f"Error sending email: {e}")
            return False

    async def send_email(self, to_email: str, subject: str, body: str, is_html: bool = False) -> bool:
        """Send email asynchronously"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self._send_email_sync,
            to_email,
            subject,
            body,
            is_html
        )

    async def send_welcome_email(self, user_email: str, user_name: str) -> bool:
        """Send welcome email to new user"""
        subject = "Welcome to Wild Welcome!"
        body = f"""
        <html>
        <body>
            <h2>Welcome to Wild Welcome, {user_name}!</h2>
            <p>Thank you for joining our community of wildlife photographers and eco-tourists.</p>
            <p>You can now:</p>
            <ul>
                <li>Search for accommodations near Rwanda's national parks</li>
                <li>Book your perfect stay for wildlife photography</li>
                <li>Connect with local hosts and fellow travelers</li>
            </ul>
            <p>Start exploring amazing properties near Volcanoes National Park and Akagera National Park!</p>
            <p>Happy travels!</p>
            <p>The Wild Welcome Team</p>
        </body>
        </html>
        """
        return await self.send_email(user_email, subject, body, is_html=True)

    async def send_booking_confirmation(self, user_email: str, user_name: str, booking_details: dict) -> bool:
        """Send booking confirmation email"""
        subject = "Booking Confirmation - Wild Welcome"
        body = f"""
        <html>
        <body>
            <h2>Booking Confirmed!</h2>
            <p>Hi {user_name},</p>
            <p>Your booking has been confirmed. Here are the details:</p>
            <ul>
                <li><strong>Property:</strong> {booking_details.get('property_title', 'N/A')}</li>
                <li><strong>Check-in:</strong> {booking_details.get('check_in', 'N/A')}</li>
                <li><strong>Check-out:</strong> {booking_details.get('check_out', 'N/A')}</li>
                <li><strong>Guests:</strong> {booking_details.get('guests', 'N/A')}</li>
                <li><strong>Total Price:</strong> ${booking_details.get('total_price', 'N/A')}</li>
            </ul>
            <p>We're excited to have you stay with us!</p>
            <p>The Wild Welcome Team</p>
        </body>
        </html>
        """
        return await self.send_email(user_email, subject, body, is_html=True)

    async def send_password_reset(self, user_email: str, reset_token: str) -> bool:
        """Send password reset email"""
        subject = "Password Reset - Wild Welcome"
        reset_link = f"{settings.frontend_url}/reset-password?token={reset_token}"
        body = f"""
        <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <p><a href="{reset_link}" style="background-color: #AFBE8E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>The Wild Welcome Team</p>
        </body>
        </html>
        """
        return await self.send_email(user_email, subject, body, is_html=True)


email_service = EmailService()