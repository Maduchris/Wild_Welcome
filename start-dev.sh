#!/bin/bash

# Wild Welcome Development Startup Script
echo "🚀 Starting Wild Welcome Development Environment..."

# Start MongoDB if not running
echo "📦 Starting MongoDB..."
if ! docker ps | grep -q "wild-welcome-mongo"; then
    docker run -d --name wild-welcome-mongo -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=password \
        mongo:latest
    echo "✅ MongoDB started"
else
    echo "✅ MongoDB already running"
fi

# Function to start backend
start_backend() {
    echo "🔧 Starting Backend (FastAPI)..."
    cd /Users/kenniy/Documents/Code/Learning/home/backend
    python run.py &
    BACKEND_PID=$!
    echo "✅ Backend started (PID: $BACKEND_PID)"
}

# Function to start frontend  
start_frontend() {
    echo "⚛️  Starting Frontend (React)..."
    cd /Users/kenniy/Documents/Code/Learning/home/frontend
    npm start &
    FRONTEND_PID=$!
    echo "✅ Frontend started (PID: $FRONTEND_PID)"
}

# Start both servers in parallel
start_backend
sleep 3  # Give backend time to start
start_frontend

echo ""
echo "🎉 Wild Welcome Development Environment is starting up!"
echo ""
echo "📍 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "⏳ Wait a moment for both servers to fully start..."
echo "💡 Press Ctrl+C to stop both servers"

# Wait for interrupt signal
trap 'echo "🛑 Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT
wait