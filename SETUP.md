# Wild Welcome - Full Stack Setup Guide

Complete setup guide for the Wild Welcome property rental platform.

## Project Structure

```text
home/
├── frontend/          # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── backend/           # FastAPI backend
│   ├── app/
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── ...
└── SETUP.md          # This file
```

## Quick Start with Docker (Recommended)

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration (see below)
docker-compose up -d
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Manual Setup

### Backend Setup

1. **Prerequisites**:
   - Python 3.9+
   - MongoDB (local or Atlas)
   - Cloudinary account
   - Gmail account with app password
   - Gupshup account

2. **Install dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Environment configuration**:
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file**:
   ```env
   # Database
   MONGODB_URL=mongodb://localhost:27017
   DATABASE_NAME=wild_welcome

   # JWT
   SECRET_KEY=your-super-secret-key-change-this-in-production

   # Cloudinary (required)
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Email (Gmail SMTP)
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password

   # SMS (Gupshup)
   GUPSHUP_API_KEY=your-gupshup-api-key
   GUPSHUP_APP_NAME=your-app-name
   ```

5. **Run backend**:
   ```bash
   python run.py
   # or
   uvicorn app.main:app --reload
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment configuration** (optional):
   ```bash
   # Create .env file in frontend directory
   echo "REACT_APP_API_URL=http://localhost:8000/api" > .env
   ```

3. **Run frontend**:
   ```bash
   npm start
   ```

## Service Setup Guides

### Cloudinary Setup
1. Visit https://cloudinary.com and create account
2. Go to Dashboard
3. Copy Cloud Name, API Key, API Secret
4. Add to backend `.env` file

### Gmail SMTP Setup
1. Enable 2-factor authentication on Gmail
2. Go to Google Account settings
3. Generate app password for "Mail"
4. Use app password in `EMAIL_HOST_PASSWORD`

### Gupshup SMS Setup
1. Visit https://gupshup.io and create account
2. Go to Dashboard
3. Copy API Key and App Name
4. Add to backend `.env` file

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community
brew services start mongodb-community
# Use: MONGODB_URL=mongodb://localhost:27017
```

**Option 2: MongoDB Atlas (recommended)**
1. Create account at https://cloud.mongodb.com
2. Create cluster
3. Create database user
4. Get connection string
5. Use in `MONGODB_URL`

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Features

### User Features
- User registration and authentication
- Property search and filtering
- Booking system
- Favorites management
- Profile management

### Landlord Features
- Property management (CRUD)
- Booking request handling
- Image uploads
- Dashboard

### Technical Features
- JWT authentication
- File upload with Cloudinary
- Email notifications
- SMS notifications
- MongoDB database
- Docker containerization

## Development

### Backend Development
```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
python run.py

# Run tests (TODO)
pytest
```

### Frontend Development
```bash
cd frontend
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Production Deployment

### Backend Deployment
1. Set production environment variables
2. Use proper MongoDB instance
3. Enable HTTPS
4. Use production WSGI server:
   ```bash
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
   ```

### Frontend Deployment
1. Build production version:
   ```bash
   npm run build
   ```
2. Deploy `build/` folder to static hosting
3. Configure API URL for production

## Troubleshooting

### Common Issues

1. **Backend won't start**:
   - Check `.env` file configuration
   - Ensure MongoDB is running
   - Check Python version (3.9+)

2. **Frontend can't connect to backend**:
   - Verify backend is running on port 8000
   - Check CORS settings
   - Verify API_URL in frontend

3. **File uploads not working**:
   - Check Cloudinary credentials
   - Verify file size limits
   - Check file type restrictions

4. **Emails not sending**:
   - Verify Gmail credentials
   - Check app password (not regular password)
   - Ensure 2FA is enabled

5. **SMS not sending**:
   - Check Gupshup credentials
   - Verify phone number format
   - Check Gupshup account balance

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Properties
- `GET /api/properties/`
- `GET /api/properties/search`
- `POST /api/properties/`
- `PUT /api/properties/{id}`
- `DELETE /api/properties/{id}`

### Bookings
- `POST /api/bookings/`
- `GET /api/bookings/`
- `POST /api/bookings/{id}/approve`
- `POST /api/bookings/{id}/reject`

### Users
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `POST /api/users/upload-avatar`

For complete API documentation, visit http://localhost:8000/docs

## Support

For issues and questions:
1. Check this setup guide
2. Review error logs
3. Check API documentation
4. Verify service configurations

## License

MIT License