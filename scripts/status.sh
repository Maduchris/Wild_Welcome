#!/bin/bash

# Check Wild Welcome services status
echo "📊 Wild Welcome Services Status"
echo "================================"

# Show container status
docker compose ps

echo ""
echo "🔗 Service URLs:"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "API Docs: http://localhost:8000/docs"

echo ""
echo "🏥 Health Checks:"

# Check backend health
if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend: Healthy"
else
    echo "❌ Backend: Unhealthy"
fi

# Check frontend health
if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: Healthy"
else
    echo "❌ Frontend: Unhealthy"
fi