#!/bin/bash
echo "========================================="
echo "  Setting up JobMatch AI..."
echo "========================================="

# Install backend dependencies
cd /workspaces/jobportal/backend
pip install -r requirements.txt

# Install frontend dependencies
cd /workspaces/jobportal/frontend
npm install

# Create .env if it doesn't exist
cd /workspaces/jobportal
if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "========================================="
  echo "  IMPORTANT: Add your API keys!"
  echo "  Edit the .env file in the root folder"
  echo "========================================="
fi

echo ""
echo "========================================="
echo "  Setup complete!"
echo "  Run the app with: bash start.sh"
echo "========================================="
