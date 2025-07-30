# LearnAnySkills - AI-Powered Skill Learning Platform

A modern, interactive learning platform that combines AI-generated content with a beautiful 3D interface to teach practical skills like Python Data Analysis, SQL, and Excel.

## 🚀 Features

- **AI-Generated Lessons**: Dynamic lesson content powered by OpenRouter's qwen/qwen3-coder model
- **3D Interactive UI**: Built with React Three Fiber and Framer Motion for engaging user experience
- **Structured Learning Paths**: Pre-defined courses with progressive lesson structure
- **Secure Backend**: FastAPI backend with proper API key management
- **Modern Design**: Clean, professional interface inspired by Coursera and Notion
- **Progress Tracking**: User progress monitoring and lesson completion tracking

## 🏗️ Architecture

```
learnaskill/
├── backend/          # FastAPI backend
│   ├── app/
│   │   ├── api/      # API endpoints
│   │   ├── models/   # Database models
│   │   ├── services/ # Business logic
│   │   └── database/ # Database configuration
│   └── requirements.txt
└── frontend/         # Next.js 15 frontend
    ├── src/
    │   ├── app/      # App router pages
    │   ├── components/ # React components
    │   ├── lib/      # Utilities and services
    │   └── types/    # TypeScript definitions
    └── package.json
```

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance Python web framework
- **MySQL**: Database for course content and user progress
- **OpenRouter**: AI model integration for lesson generation
- **SQLAlchemy**: Database ORM
- **Pydantic**: Data validation

### Frontend
- **Next.js 15**: React framework with app router
- **React Three Fiber**: 3D graphics and animations
- **Drei**: Helper library for Three.js
- **Framer Motion**: Animation library
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development

## 🔧 Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MySQL 8.0+

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
1. Create MySQL database named `learnaskill`
2. Update database credentials in backend configuration
3. Run database migrations

## 🎯 Available Courses

1. **Python for Data Analysis**
   - Data manipulation with Pandas
   - Visualization with Matplotlib/Seaborn
   - Statistical analysis and insights

2. **SQL Fundamentals**
   - Database design and queries
   - Advanced joins and aggregations
   - Performance optimization

3. **Excel Mastery**
   - Advanced formulas and functions
   - Data analysis and pivot tables
   - Automation with macros

## 🔐 Security

- API keys securely stored in backend environment
- No sensitive data exposed to frontend
- Secure database connections
- Input validation and sanitization

## 📊 Database Schema

- `courses`: Course information and descriptions
- `lessons`: Individual lesson metadata
- `lesson_content`: AI-generated lesson content cache
- `user_progress`: User completion tracking

## 🚦 API Endpoints

- `GET /api/courses`: Retrieve all available courses
- `GET /api/courses/{course_id}/lessons`: Get lessons for a course
- `POST /api/lessons/{lesson_id}/generate`: Generate AI content for a lesson
- `GET /api/user/progress`: Get user learning progress

## 🎨 UI/UX Features

- Smooth 3D transitions and animations
- Responsive design for all devices
- Interactive course navigation
- Progress visualization
- Modern, clean aesthetic

## 🤝 Contributing

This project is designed for educational purposes and skill development. Feel free to extend with additional courses, features, or improvements.

## 📄 License

MIT License - See LICENSE file for details