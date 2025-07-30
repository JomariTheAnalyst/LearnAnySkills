import json
from sqlalchemy.orm import Session
from .config import engine, SessionLocal
from ..models import Course, Lesson, LessonContent, UserProgress

def create_tables():
    """Create all database tables"""
    from ..models.course import Base
    Base.metadata.create_all(bind=engine)

def init_course_data():
    """Initialize the database with course and lesson data"""
    db = SessionLocal()
    
    try:
        # Check if courses already exist
        if db.query(Course).first():
            print("Database already initialized with course data")
            return
        
        # Python for Data Analysis Course
        python_course = Course(
            title="Python for Data Analysis",
            description="Learn to analyze data using Python's powerful libraries including Pandas, NumPy, and Matplotlib.",
            overview="""Master the fundamentals of data analysis with Python. This comprehensive course will take you from basic Python concepts to advanced data manipulation and visualization techniques. 

You'll learn to:
- Work with different data formats (CSV, JSON, Excel)
- Clean and preprocess messy datasets
- Perform statistical analysis and create insightful visualizations
- Build data pipelines for real-world scenarios
- Use industry-standard libraries like Pandas, NumPy, Matplotlib, and Seaborn

Perfect for beginners looking to break into data science or professionals wanting to enhance their analytical skills.""",
            difficulty_level="Beginner to Intermediate",
            estimated_duration="6-8 weeks",
            image_url="/images/python-data-analysis.jpg"
        )
        
        # SQL Fundamentals Course
        sql_course = Course(
            title="SQL Fundamentals",
            description="Master database queries, joins, and advanced SQL techniques for data retrieval and analysis.",
            overview="""Become proficient in SQL, the universal language of databases. This course covers everything from basic queries to complex database operations.

You'll learn to:
- Write efficient SELECT, INSERT, UPDATE, and DELETE statements
- Master different types of JOINs and subqueries
- Create and manage database schemas
- Optimize query performance
- Work with aggregate functions and window functions
- Handle complex data relationships

Essential for anyone working with databases, data analysis, or backend development.""",
            difficulty_level="Beginner to Advanced",
            estimated_duration="4-6 weeks",
            image_url="/images/sql-fundamentals.jpg"
        )
        
        # Excel Mastery Course
        excel_course = Course(
            title="Excel Mastery",
            description="Advanced Excel techniques including formulas, pivot tables, macros, and data analysis tools.",
            overview="""Transform your Excel skills from basic to expert level. Learn advanced techniques used by financial analysts, data professionals, and business experts.

You'll learn to:
- Master complex formulas and functions (VLOOKUP, INDEX-MATCH, etc.)
- Create dynamic pivot tables and charts
- Automate tasks with macros and VBA
- Use Excel's built-in data analysis tools
- Design professional dashboards and reports
- Handle large datasets efficiently

Perfect for business professionals, analysts, and anyone who works with data in Excel.""",
            difficulty_level="Intermediate to Advanced",
            estimated_duration="5-7 weeks",
            image_url="/images/excel-mastery.jpg"
        )
        
        # Add courses to database
        db.add_all([python_course, sql_course, excel_course])
        db.commit()
        
        # Refresh to get IDs
        db.refresh(python_course)
        db.refresh(sql_course)
        db.refresh(excel_course)
        
        # Python course lessons
        python_lessons = [
            {
                "title": "Introduction to Python and Data Types",
                "description": "Learn Python basics and fundamental data types for data analysis",
                "lesson_number": 1,
                "estimated_duration": "45 minutes",
                "learning_objectives": json.dumps([
                    "Understand Python syntax and data types",
                    "Work with lists, dictionaries, and tuples",
                    "Handle strings and numeric data",
                    "Set up Python environment for data analysis"
                ])
            },
            {
                "title": "Introduction to NumPy",
                "description": "Master NumPy arrays and mathematical operations",
                "lesson_number": 2,
                "estimated_duration": "60 minutes",
                "learning_objectives": json.dumps([
                    "Create and manipulate NumPy arrays",
                    "Perform mathematical operations on arrays",
                    "Understand array indexing and slicing",
                    "Work with multi-dimensional arrays"
                ])
            },
            {
                "title": "Getting Started with Pandas",
                "description": "Learn DataFrame operations and data manipulation",
                "lesson_number": 3,
                "estimated_duration": "90 minutes",
                "learning_objectives": json.dumps([
                    "Create and work with DataFrames",
                    "Load data from various file formats",
                    "Perform basic data exploration",
                    "Handle missing data"
                ])
            },
            {
                "title": "Data Cleaning and Preprocessing",
                "description": "Clean messy data and prepare it for analysis",
                "lesson_number": 4,
                "estimated_duration": "75 minutes",
                "learning_objectives": json.dumps([
                    "Identify and handle missing values",
                    "Remove duplicates and outliers",
                    "Transform and normalize data",
                    "Merge and join datasets"
                ])
            },
            {
                "title": "Data Visualization with Matplotlib",
                "description": "Create compelling visualizations to communicate insights",
                "lesson_number": 5,
                "estimated_duration": "60 minutes",
                "learning_objectives": json.dumps([
                    "Create basic plots (line, bar, scatter)",
                    "Customize plot appearance",
                    "Create subplots and complex layouts",
                    "Export and save visualizations"
                ])
            }
        ]
        
        # SQL course lessons
        sql_lessons = [
            {
                "title": "Database Fundamentals and SELECT Statements",
                "description": "Understanding databases and basic query structure",
                "lesson_number": 1,
                "estimated_duration": "50 minutes",
                "learning_objectives": json.dumps([
                    "Understand relational database concepts",
                    "Write basic SELECT statements",
                    "Use WHERE clauses for filtering",
                    "Sort results with ORDER BY"
                ])
            },
            {
                "title": "Working with Multiple Tables - JOINs",
                "description": "Learn different types of joins to combine data",
                "lesson_number": 2,
                "estimated_duration": "70 minutes",
                "learning_objectives": json.dumps([
                    "Understand table relationships",
                    "Master INNER, LEFT, RIGHT, and FULL JOINs",
                    "Use table aliases effectively",
                    "Handle complex multi-table queries"
                ])
            },
            {
                "title": "Aggregate Functions and Grouping",
                "description": "Summarize data using aggregate functions",
                "lesson_number": 3,
                "estimated_duration": "60 minutes",
                "learning_objectives": json.dumps([
                    "Use COUNT, SUM, AVG, MIN, MAX functions",
                    "Group data with GROUP BY",
                    "Filter groups with HAVING",
                    "Create summary reports"
                ])
            },
            {
                "title": "Subqueries and Advanced Techniques",
                "description": "Write complex queries with subqueries and CTEs",
                "lesson_number": 4,
                "estimated_duration": "80 minutes",
                "learning_objectives": json.dumps([
                    "Write correlated and non-correlated subqueries",
                    "Use Common Table Expressions (CTEs)",
                    "Understand window functions",
                    "Optimize query performance"
                ])
            }
        ]
        
        # Excel course lessons
        excel_lessons = [
            {
                "title": "Advanced Formulas and Functions",
                "description": "Master complex Excel formulas for data analysis",
                "lesson_number": 1,
                "estimated_duration": "65 minutes",
                "learning_objectives": json.dumps([
                    "Use VLOOKUP, HLOOKUP, and INDEX-MATCH",
                    "Master conditional functions (IF, COUNTIF, SUMIF)",
                    "Work with text functions",
                    "Handle date and time calculations"
                ])
            },
            {
                "title": "Dynamic Pivot Tables and Charts",
                "description": "Create interactive reports with pivot tables",
                "lesson_number": 2,
                "estimated_duration": "75 minutes",
                "learning_objectives": json.dumps([
                    "Build comprehensive pivot tables",
                    "Create calculated fields and items",
                    "Design pivot charts",
                    "Use slicers and timelines for interactivity"
                ])
            },
            {
                "title": "Data Analysis Tools and Add-ins",
                "description": "Leverage Excel's built-in analysis features",
                "lesson_number": 3,
                "estimated_duration": "55 minutes",
                "learning_objectives": json.dumps([
                    "Use Data Analysis ToolPak",
                    "Perform statistical analysis",
                    "Create data models with Power Query",
                    "Build forecasting models"
                ])
            },
            {
                "title": "Automation with Macros and VBA",
                "description": "Automate repetitive tasks with Visual Basic",
                "lesson_number": 4,
                "estimated_duration": "90 minutes",
                "learning_objectives": json.dumps([
                    "Record and edit macros",
                    "Write basic VBA code",
                    "Create user forms and controls",
                    "Automate data processing workflows"
                ])
            }
        ]
        
        # Add lessons to database
        for lesson_data in python_lessons:
            lesson = Lesson(course_id=python_course.id, **lesson_data)
            db.add(lesson)
            
        for lesson_data in sql_lessons:
            lesson = Lesson(course_id=sql_course.id, **lesson_data)
            db.add(lesson)
            
        for lesson_data in excel_lessons:
            lesson = Lesson(course_id=excel_course.id, **lesson_data)
            db.add(lesson)
        
        db.commit()
        print("Database initialized successfully with course and lesson data!")
        
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

def reset_database():
    """Drop all tables and recreate them (use with caution!)"""
    from ..models.course import Base
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("Database reset successfully!")

if __name__ == "__main__":
    create_tables()
    init_course_data()