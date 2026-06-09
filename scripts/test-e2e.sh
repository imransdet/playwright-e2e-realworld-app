#!/bin/bash

# Start the servers in the background
npm run start:ci &
SERVER_PID=$!

# Function to kill servers on exit
cleanup() {
    echo "Stopping servers..."
    # Kill the specific server process group to avoid SIGTERM errors
    if [ -n "$SERVER_PID" ]; then
        kill -TERM -$SERVER_PID 2>/dev/null || true
    fi
    # Also try to kill any remaining processes
    pkill -f "npm run start:ci" 2>/dev/null || true
    pkill -f "start:react:proxy-server" 2>/dev/null || true
    pkill -f "start:api" 2>/dev/null || true
    sleep 2
}

# Set trap to ensure cleanup happens even if script fails
trap cleanup EXIT

# Wait for frontend to be ready
echo "Waiting for frontend to be ready..."
while ! curl -s http://localhost:3000 > /dev/null; do
  sleep 1
done
echo "Frontend is ready"

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
while ! curl -s http://localhost:3001/users -X POST -H "Content-Type: application/json" -d '{}' > /dev/null 2>&1; do
  sleep 1
done
echo "Backend is ready"

# Run the tests
echo "Running tests..."
npm run test -- "$@"

# Cleanup will happen automatically due to trap
