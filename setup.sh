#!/bin/bash

echo "🚀 Setting up LearnAnySkills - AI-Powered Learning Platform"
echo "=================================================="

# Check for required dependencies
echo "📋 Checking system requirements..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check MySQL
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Please ensure MySQL 8.0+ is running on port 3306."
fi

echo "✅ System requirements check passed!"

# Setup Backend
echo ""
echo "🔧 Setting up FastAPI Backend..."
cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Install Python dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Backend setup completed!"

# Setup Frontend
echo ""
echo "🎨 Setting up Next.js Frontend..."
cd ../frontend

# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install

echo "✅ Frontend setup completed!"

# Database setup
echo ""
echo "🗄️  Setting up MySQL Database..."
cd ..

# Create database setup script
cat > create_database.sql << EOF
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS learnaskill;

-- Grant permissions (adjust as needed for your MySQL setup)
-- GRANT ALL PRIVILEGES ON learnaskill.* TO 'root'@'localhost';
-- FLUSH PRIVILEGES;

USE learnaskill;

-- Show database info
SELECT 'Database learnaskill created successfully!' as message;
EOF

echo "Database SQL script created: create_database.sql"
echo "Please run: mysql -u root -p < create_database.sql"

# Create run scripts
echo ""
echo "📝 Creating run scripts..."

# Backend run script
cat > run_backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting FastAPI Backend..."
cd backend

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

# Start FastAPI server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
EOF

# Frontend run script
cat > run_frontend.sh << 'EOF'
#!/bin/bash
echo "🎨 Starting Next.js Frontend..."
cd frontend
npm run dev
EOF

# Combined run script
cat > run_dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting LearnAnySkills Development Environment"
echo "=================================================="

# Function to kill background processes on script exit
cleanup() {
    echo ""
    echo "🛑 Shutting down development servers..."
    jobs -p | xargs -r kill
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start backend
echo "Starting Backend (FastAPI)..."
cd backend

# Activate virtual environment
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    source venv/Scripts/activate
else
    source venv/bin/activate
fi

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "Starting Frontend (Next.js)..."
cd frontend
npm run dev &
FRONTEND_PID=$!

cd ..

echo ""
echo "🎯 Development servers started!"
echo "📊 Backend API: http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"
echo "🎨 Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for processes
wait
EOF

# Make scripts executable
chmod +x run_backend.sh
chmod +x run_frontend.sh
chmod +x run_dev.sh

echo "✅ Run scripts created!"

# Create environment files
echo ""
echo "🔧 Creating environment files..."

# Check if backend .env exists
if [ ! -f backend/.env ]; then
    cp backend/.env backend/.env.example
    echo "📋 Backend environment file created at backend/.env"
    echo "⚠️  Please update the database credentials and API keys if needed."
fi

# Create frontend .env.local if it doesn't exist
if [ ! -f frontend/.env.local ]; then
    cat > frontend/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8000
EOF
    echo "📋 Frontend environment file created at frontend/.env.local"
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Ensure MySQL is running and create the database:"
echo "   mysql -u root -p < create_database.sql"
echo ""
echo "2. Start the development environment:"
echo "   ./run_dev.sh"
echo ""
echo "3. Visit http://localhost:3000 to see your app!"
echo ""
echo "📁 Project structure:"
echo "├── backend/          # FastAPI backend"
echo "├── frontend/         # Next.js frontend"
echo "├── run_dev.sh        # Start both servers"
echo "├── run_backend.sh    # Start only backend"
echo "└── run_frontend.sh   # Start only frontend"
echo ""
echo "🔗 Useful URLs:"
echo "• Frontend: http://localhost:3000"
echo "• Backend API: http://localhost:8000"
echo "• API Documentation: http://localhost:8000/docs"
echo "• Database: MySQL on localhost:3306"
echo ""
echo "Happy learning! 🚀"