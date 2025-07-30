# 🚀 LearnAnySkills - Quick Start Guide

Get your AI-powered learning platform up and running in minutes!

## 📋 Prerequisites

Before you begin, ensure you have these installed:

- **Python 3.9+** - [Download here](https://python.org/downloads/)
- **Node.js 18+** - [Download here](https://nodejs.org/)
- **MySQL 8.0+** - [Download here](https://dev.mysql.com/downloads/)

## ⚡ Quick Setup (Automated)

```bash
# Clone or download the project files
# Navigate to the project directory

# Run the automated setup
./setup.sh
```

The setup script will:
- ✅ Check system requirements
- 🐍 Set up Python virtual environment
- 📦 Install all dependencies
- 🗄️ Create database setup script
- 📝 Generate run scripts
- 🔧 Configure environment files

## 🗄️ Database Setup

1. **Start MySQL** (if not already running)
2. **Create the database**:
   ```bash
   mysql -u root -p < create_database.sql
   ```
3. **Enter your MySQL password** when prompted

## 🚀 Launch the Platform

Start both backend and frontend:
```bash
./run_dev.sh
```

Or start them separately:
```bash
# Backend only
./run_backend.sh

# Frontend only (in another terminal)
./run_frontend.sh
```

## 🎯 Access Your Platform

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📚 First Steps

1. **Browse Courses**: Visit the homepage to see available courses
2. **Select a Course**: Click on Python, SQL, or Excel courses
3. **Start Learning**: Click "Start Learning" on any lesson
4. **Generate AI Content**: Click "Begin Lesson" to generate personalized content

## 🔧 Configuration

### Database Settings
Edit `backend/.env` to update database credentials:
```env
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=YourPassword
DATABASE_NAME=learnaskill
```

### API Settings
The OpenRouter AI API key is pre-configured. For production use, replace:
```env
OPENROUTER_API_KEY=your-production-key
```

## 🎨 Features to Try

### 🤖 AI-Powered Lessons
- Click any lesson to see AI-generated overview
- Use "Begin Lesson" to create full lesson content
- Content is cached for faster subsequent access

### 🎯 Interactive UI
- Smooth 3D animations on the homepage
- Responsive design works on all devices
- Modern, clean interface inspired by Coursera/Notion

### 📊 Progress Tracking
- User progress is automatically tracked
- Lesson completion status
- Time spent on each lesson

## 🛠️ Development

### Project Structure
```
learnaskill/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── api/       # API endpoints
│   │   ├── models/    # Database models
│   │   ├── services/  # Business logic
│   │   └── database/  # Database config
│   └── requirements.txt
├── frontend/          # Next.js 15 frontend
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/ # React components
│   │   ├── lib/       # API and utilities
│   │   └── types/     # TypeScript definitions
│   └── package.json
└── setup.sh          # Automated setup
```

### Key Technologies
- **Backend**: FastAPI, SQLAlchemy, MySQL, OpenRouter AI
- **Frontend**: Next.js 15, React Three Fiber, Framer Motion, Tailwind CSS
- **AI**: OpenRouter with qwen/qwen3-coder model
- **Database**: MySQL with automated schema creation

## 🔒 Security Features

- ✅ API keys secured in backend environment
- ✅ No sensitive data exposed to frontend
- ✅ Input validation and sanitization
- ✅ CORS protection configured
- ✅ Database connection encryption

## 📖 Available Courses

### 🐍 Python for Data Analysis
- 5 lessons covering NumPy, Pandas, Matplotlib
- Beginner to Intermediate level
- 6-8 weeks estimated duration

### 🗃️ SQL Fundamentals
- 4 lessons on database queries and optimization
- Beginner to Advanced level
- 4-6 weeks estimated duration

### 📊 Excel Mastery
- 4 lessons on advanced Excel techniques
- Intermediate to Advanced level
- 5-7 weeks estimated duration

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check MySQL is running
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# Verify credentials in backend/.env
```

**Frontend Build Errors**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Python Dependencies Issues**
```bash
cd backend
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

**Port Already in Use**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## 📞 Support

If you encounter any issues:

1. **Check the logs** - Both servers output helpful error messages
2. **Verify prerequisites** - Ensure all required software is installed
3. **Database connectivity** - Most issues relate to MySQL configuration
4. **API key validity** - Check OpenRouter API key is working

## 🚀 Next Steps

- **Add more courses** by editing `backend/app/database/init_db.py`
- **Customize the UI** by modifying Tailwind classes in components
- **Extend AI features** by enhancing the prompt engineering
- **Add user authentication** for personalized experiences
- **Deploy to production** using Docker and cloud services

---

**Happy Learning!** 🎓 Your AI-powered education platform is ready to transform how people learn practical skills.