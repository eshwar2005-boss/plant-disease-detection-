#!/bin/bash

# 🚀 Plant Disease System - Big Data Setup Guide

echo "🌱 Plant Disease Detection System - Big Data Technologies"
echo "=================================================="
echo ""
echo "✅ Features Integrated:"
echo "   1. SQLite Database for persistent storage"
echo "   2. Node-Cache for high-speed caching"
echo "   3. Sharp for image processing"
echo "   4. CSV export for data analysis"
echo "   5. Real-time analytics dashboard"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting services...${NC}"
echo ""

# Install dependencies if needed
if [ ! -d "server/node_modules" ]; then
  echo -e "${YELLOW}Installing server dependencies...${NC}"
  cd server
  npm install
  cd ..
fi

if [ ! -d "client/node_modules" ]; then
  echo -e "${YELLOW}Installing client dependencies...${NC}"
  cd client
  npm install
  cd ..
fi

# Kill any existing processes on ports
echo -e "${YELLOW}Cleaning up old processes...${NC}"
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
sleep 1

# Start server
echo -e "${GREEN}Starting server on port 5001...${NC}"
cd server
npm start &
SERVER_PID=$!
cd ..

sleep 2

# Test server
echo -e "${BLUE}Testing server connection...${NC}"
if curl -s http://localhost:5001/api/ping > /dev/null; then
  echo -e "${GREEN}✓ Server is running!${NC}"
else
  echo -e "${YELLOW}⚠ Server may not be responding. Check logs.${NC}"
fi

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}✅ Big Data Integration Complete!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "📊 Database Features:"
echo "   - SQLite database: server/plant_disease.db"
echo "   - Auto schema creation"
echo "   - Persistent storage of all detections"
echo ""
echo "⚡ Performance Features:"
echo "   - Node-Cache with 10-min TTL"
echo "   - Image compression (224x224)"
echo "   - Optimized queries with GROUP BY"
echo ""
echo "📈 Analytics Available:"
echo "   - Disease distribution statistics"
echo "   - Severity breakdown"
echo "   - User detection history"
echo "   - CSV export for external analysis"
echo ""
echo "🔗 API Endpoints:"
echo "   - POST /api/detect - Upload image and detect disease"
echo "   - GET /api/analytics - Get analytics data"
echo "   - GET /api/db/stats - Database statistics"
echo "   - GET /api/export/csv - Export detections as CSV"
echo "   - GET /api/user/:userId/detections - User history"
echo "   - POST /api/cache/clear - Clear cache"
echo ""
echo -e "${YELLOW}Start client (in new terminal):${NC}"
echo "   cd client && npm run dev"
echo ""
echo -e "${YELLOW}Access the application:${NC}"
echo "   - App: http://localhost:5173"
echo "   - Server: http://localhost:5001"
echo "   - Analytics: http://localhost:5173/analytics"
echo ""
echo "📚 Documentation:"
echo "   - See BIG_DATA_INTEGRATION.md for full details"
echo ""

# Keep script running
wait $SERVER_PID
