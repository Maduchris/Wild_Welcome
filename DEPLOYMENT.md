# Wild Welcome - Docker Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Your MongoDB connection configured in `backend/.env`

### Deploy in 3 Steps
1. **Configure Environment**
   ```bash
   # Make sure your backend/.env file has your MongoDB connection
   cp backend/.env.example backend/.env
   # Edit backend/.env with your actual MongoDB URL and JWT secret
   ```

2. **Deploy**
   ```bash
   ./deploy.sh
   ```

3. **Access Your App**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `./deploy.sh` | Deploy the full application |
| `./scripts/stop.sh` | Stop all services |
| `./scripts/status.sh` | Check service status and health |
| `./scripts/logs.sh` | View all logs |
| `./scripts/logs.sh backend` | View backend logs only |
| `./scripts/logs.sh frontend` | View frontend logs only |

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │
│   (React + Nginx)  │    │   (FastAPI)     │
│   Port: 3000    │────▶│   Port: 8000    │
└─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   MongoDB       │
                       │   (External)    │
                       └─────────────────┘
```

## ⚙️ Configuration

### Backend Environment Variables (.env)
```bash
# Required
JWT_SECRET=your-super-secret-jwt-key
MONGODB_URL=your-mongodb-connection-string
DATABASE_NAME=wild_welcome

# Optional
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
ENVIRONMENT=production
DEBUG=false
```

### Frontend Environment Variables
These are set automatically during build:
- `REACT_APP_API_URL`: Points to backend API
- `REACT_APP_ENVIRONMENT`: Set to production

## 🔧 Manual Docker Commands

If you prefer manual control:

```bash
# Build and start
docker compose up --build -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild specific service
docker compose up --build -d backend
docker compose up --build -d frontend

# Execute commands in containers
docker compose exec backend bash
docker compose exec frontend sh
```

## 🏥 Health Checks

Both services include health checks:
- **Backend**: `GET /health`
- **Frontend**: `GET /` (nginx status)

Check health status:
```bash
docker compose ps
```

## 🐛 Troubleshooting

### Service Won't Start
```bash
# Check logs
./scripts/logs.sh

# Check container status
docker compose ps

# Restart specific service
docker compose restart backend
docker compose restart frontend
```

### Database Connection Issues
1. Verify your MongoDB URL in `backend/.env`
2. Ensure MongoDB is accessible from Docker containers
3. Check backend logs: `./scripts/logs.sh backend`

### Frontend Can't Connect to Backend
1. Check if backend is healthy: `./scripts/status.sh`
2. Verify nginx proxy configuration
3. Check frontend logs: `./scripts/logs.sh frontend`

### Port Conflicts
If ports 3000 or 8000 are in use, modify `docker-compose.yml`:
```yaml
ports:
  - "3001:80"  # Frontend on port 3001
  - "8001:8000"  # Backend on port 8001
```

## 📦 Production Deployment

### For Cloud Platforms (AWS, GCP, Azure)
1. Push your code to a container registry
2. Update `docker-compose.yml` to use your images
3. Configure environment variables for production
4. Use a reverse proxy (nginx, Traefik) for SSL/domain routing

### For VPS/Dedicated Server
1. Clone your repository
2. Set up your `.env` file with production values
3. Run `./deploy.sh`
4. Configure nginx/Apache as reverse proxy for SSL

## 🔒 Security Notes

- Change the JWT secret in production
- Use HTTPS in production
- Secure your MongoDB connection
- Regularly update Docker images
- Monitor logs for security issues

## 📊 Monitoring

View real-time status:
```bash
./scripts/status.sh
```

Monitor logs continuously:
```bash
./scripts/logs.sh
```

## 🆘 Support

If you encounter issues:
1. Check the logs: `./scripts/logs.sh`
2. Verify service health: `./scripts/status.sh`
3. Ensure all environment variables are set correctly
4. Try rebuilding: `docker compose up --build -d`