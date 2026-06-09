#!/bin/bash

# Change to the project root directory (parent of playwright directory)
cd "$(dirname "$0")/.."

# Export environment variables from .env
set -a
source .env
set +a

# Start the servers in the background
npm run start:ci &
SERVER_PID=$!

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

echo "All servers are ready. Keeping servers running in background."

# Wait for the background process
wait $SERVER_PID
