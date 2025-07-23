#!/bin/bash
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations or setup if needed
echo "Build completed successfully"