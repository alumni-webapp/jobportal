#!/bin/bash
echo "========================================="
echo "  Starting JobMatch AI..."
echo "========================================="

# Start backend
echo "Starting backend on port 8000..."
cd /workspaces/jobportal/backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to be ready
sleep 3

# Start frontend
echo "Starting frontend on port 5173..."
cd /workspaces/jobportal/frontend
npx vite --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

sleep 3

echo ""
echo "========================================="
echo "  App is running!"
echo ""
echo "  Frontend: Click the port 5173 link"
echo "  in the PORTS tab below"
echo ""
echo "  Press Ctrl+C to stop both servers"
echo "========================================="

# Wait for either process to exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
