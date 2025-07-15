# Wild Welcome Backend

FastAPI backend for Wild Welcome - Property rental platform for wildlife photographers and eco-tourists in Rwanda.

## Features

- **FastAPI** - Modern, fast web framework for building APIs
- **MongoDB** - NoSQL database for flexible data storage
- **JWT Authentication** - Secure user authentication
- **Cloudinary** - Image upload and storage
- **Gmail SMTP** - Email notifications
- **Gupshup SMS** - SMS notifications
- **Docker** - Containerized deployment

## Quick Start

### Prerequisites

- Python 3.9+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Gmail account (for SMTP)
- Gupshup account (for SMS)

### Installation

1. **Clone and setup**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment setup**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Required environment variables**:
   ```env
   # Database
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=wild_welcome

   # JWT
   SECRET_KEY=your-super-secret-key-change-this-in-production
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Email (Gmail)
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password

   # SMS (Gupshup)
   GUPSHUP_API_KEY=your-gupshup-api-key
   GUPSHUP_APP_NAME=your-app-name
   ```

4. **Run the application**:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

### Docker Setup

1. **Using Docker Compose (recommended)**:
   ```bash
   docker-compose up -d
   ```

2. **Manual Docker build**:
   ```bash
   docker build -t wild-welcome-backend .
   docker run -p 8000:8000 --env-file .env wild-welcome-backend
   ```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Properties
- `GET /api/properties/` - Get all properties (with filtering)
- `GET /api/properties/search` - Advanced property search
- `GET /api/properties/{id}` - Get single property
- `POST /api/properties/` - Create property (landlords only)
- `PUT /api/properties/{id}` - Update property (landlords only)
- `DELETE /api/properties/{id}` - Delete property (landlords only)
- `POST /api/properties/{id}/images` - Upload property images
- `GET /api/properties/landlord/my-properties` - Get landlord's properties

### Bookings
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/` - Get user's bookings
- `GET /api/bookings/{id}` - Get single booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking
- `GET /api/bookings/landlord/requests` - Get landlord's booking requests
- `POST /api/bookings/{id}/approve` - Approve booking (landlords only)
- `POST /api/bookings/{id}/reject` - Reject booking (landlords only)

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-avatar` - Upload user avatar
- `DELETE /api/users/account` - Delete user account
- `GET /api/users/favourites` - Get user's favourite properties
- `POST /api/users/favourites/{id}` - Add property to favourites
- `DELETE /api/users/favourites/{id}` - Remove property from favourites

### Utilities
- `GET /api/health` - Health check
- `GET /api/` - API information

## Database Schema

### Users
- `email` (unique)
- `first_name`, `last_name`
- `phone` (optional)
- `user_type` (user|landlord)
- `profile_image`
- `is_active`, `is_verified`
- `favourites` (array of property IDs)

### Properties
- `title`, `description`
- `property_type` (room|apartment|house|lodge)
- `max_guests`, `bedrooms`, `bathrooms`
- `price_per_night`
- `location` (address, city, coordinates, near_park)
- `amenities` (wifi, parking, kitchen, etc.)
- `images` (array of URLs)
- `landlord_id` (reference to user)

### Bookings
- `property_id`, `user_id`
- `check_in`, `check_out`
- `guests`, `total_price`
- `special_requests`
- `status` (pending|confirmed|cancelled|completed)

## Development

### Project Structure
```
backend/
├── app/
│   ├── auth/          # Authentication logic
│   ├── core/          # Core configuration
│   ├── database/      # Database connection
│   ├── models/        # Pydantic models
│   ├── routes/        # API routes
│   ├── services/      # External services
│   └── main.py        # FastAPI app
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

### Running Tests
```bash
# TODO: Add test setup
pytest
```

### Code Style
```bash
# Format code
black app/
isort app/

# Lint code
flake8 app/
```

## Production Deployment

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use MongoDB Atlas or properly secured MongoDB instance
3. **SSL**: Enable HTTPS
4. **Monitoring**: Add logging and monitoring
5. **Scaling**: Use multiple workers: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app`

## Service Integration

### Cloudinary Setup
1. Create account at https://cloudinary.com
2. Get cloud name, API key, and API secret
3. Add to environment variables

### Gmail SMTP Setup
1. Enable 2-factor authentication
2. Generate app password
3. Use app password in EMAIL_HOST_PASSWORD

### Gupshup SMS Setup
1. Create account at https://gupshup.io
2. Get API key and app name
3. Add to environment variables

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## License

This project is licensed under the MIT License.