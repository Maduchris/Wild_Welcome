#!/bin/bash

# View Wild Welcome logs
echo "📋 Viewing Wild Welcome logs..."
echo "Press Ctrl+C to exit"

if [ "$1" = "backend" ]; then
    docker compose logs -f backend
elif [ "$1" = "frontend" ]; then
    docker compose logs -f frontend
else
    docker compose logs -f
fi