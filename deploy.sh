#!/bin/bash

# Wild Welcome Staging Deployment Script
echo "🚀 Starting Wild Welcome deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if .env file exists
if [ ! -f "./backend/.env" ]; then
    print_error "Backend .env file not found. Please create ./backend/.env with your configuration."
    exit 1
fi

print_status "Stopping existing containers..."
docker compose down

print_status "Building and starting services..."
docker compose up --build -d

print_status "Waiting for services to be healthy..."
sleep 10

# Check service health
backend_healthy=$(docker inspect --format="{{.State.Health.Status}}" wild_welcome_backend 2>/dev/null || echo "unhealthy")
frontend_healthy=$(docker inspect --format="{{.State.Health.Status}}" wild_welcome_frontend 2>/dev/null || echo "unhealthy")

if [ "$backend_healthy" = "healthy" ]; then
    print_status "✅ Backend is healthy"
else
    print_warning "⚠️  Backend health check pending or failed"
fi

if [ "$frontend_healthy" = "healthy" ]; then
    print_status "✅ Frontend is healthy"
else
    print_warning "⚠️  Frontend health check pending or failed"
fi

# Show running containers
print_status "Running containers:"
docker compose ps

print_status "🎉 Deployment complete!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "To view logs: docker compose logs -f"
echo "To stop: docker compose down"