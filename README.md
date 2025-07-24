# Wild Welcome - Quick Start Guide

Wild Welcome is a modern web-based platform in Rwanda designed to streamline the property rental process for both landlords and tenants.
Deployment link: https://home-front-6npj.onrender.com/
Video Demo:https://drive.google.com/file/d/15qFBp4ooMpXZUyTi_eBRpfwjuMS_Lakc/view?usp=sharing
Figma Mockup Design: https://www.figma.com/design/p1X8TguvtYB7TzBJToymXc/Booking-Platform-Desktop-Design--Community-?node-id=2507-8904&t=cHorqY7HcAlrcjqJ-1

## Quick Start (Recommended)

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration (see Configuration section)
docker-compose up -d
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Manual Setup (Alternative)

### Backend
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Configuration

Create `backend/.env` with:
```env
# Database
MONGODB_URL=mongodb://admin:password@localhost:27017/wild_welcome?authSource=admin
DATABASE_NAME=wild_welcome

# JWT
SECRET_KEY=your-super-secret-key-change-this-in-production

# Cloudinary (required for image uploads)
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

## Testing & Debugging

### Backend Testing
```bash
cd backend
# Check API health
curl http://localhost:8000/api/health

# View logs
docker-compose logs -f backend

# Access MongoDB
docker exec -it wild_welcome_mongodb mongosh -u admin -p password
```

### Frontend Testing
```bash
cd frontend
# Run tests
npm test

# Check for errors
npm run build
```

### Common Issues

1. **Backend won't start**: Check MongoDB connection and .env configuration
2. **Frontend can't connect**: Verify backend is running on port 8000
3. **Image uploads fail**: Check Cloudinary credentials in .env
4. **Email/SMS not working**: Verify service credentials

## Development Features

- **User registration & authentication**
- **Property search & booking**
- **Image uploads (Cloudinary)**
- **Email & SMS notifications**
- **Landlord dashboard**
- **Responsive design**

## Service Setup (Optional)

- **Cloudinary**: https://cloudinary.com (image storage)
- **Gmail SMTP**: Enable 2FA + app password
- **Gupshup SMS**: https://gupshup.io
- **MongoDB Atlas**: https://cloud.mongodb.com (alternative to local)

For detailed setup instructions, see `SETUP.md`.
