from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from ..database.config import get_db
from ..models import Course, Lesson, LessonContent, UserProgress

router = APIRouter(prefix="/api", tags=["courses"])

@router.get("/courses")
async def get_all_courses(db: Session = Depends(get_db)):
    """
    Retrieve all active courses with basic information
    """
    try:
        courses = db.query(Course).filter(Course.is_active == True).all()
        
        result = []
        for course in courses:
            # Count total lessons for each course
            lesson_count = db.query(Lesson).filter(
                Lesson.course_id == course.id,
                Lesson.is_active == True
            ).count()
            
            result.append({
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "difficulty_level": course.difficulty_level,
                "estimated_duration": course.estimated_duration,
                "image_url": course.image_url,
                "lesson_count": lesson_count,
                "created_at": course.created_at
            })
        
        return {
            "success": True,
            "courses": result
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving courses: {str(e)}"
        )

@router.get("/courses/{course_id}")
async def get_course_details(course_id: int, db: Session = Depends(get_db)):
    """
    Get detailed information about a specific course including overview
    """
    try:
        course = db.query(Course).filter(
            Course.id == course_id,
            Course.is_active == True
        ).first()
        
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        
        # Get lessons for this course
        lessons = db.query(Lesson).filter(
            Lesson.course_id == course_id,
            Lesson.is_active == True
        ).order_by(Lesson.lesson_number).all()
        
        lesson_list = []
        for lesson in lessons:
            lesson_list.append({
                "id": lesson.id,
                "title": lesson.title,
                "description": lesson.description,
                "lesson_number": lesson.lesson_number,
                "estimated_duration": lesson.estimated_duration,
                "learning_objectives": json.loads(lesson.learning_objectives) if lesson.learning_objectives else [],
                "has_content": bool(lesson.lesson_content)
            })
        
        return {
            "success": True,
            "course": {
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "overview": course.overview,
                "difficulty_level": course.difficulty_level,
                "estimated_duration": course.estimated_duration,
                "image_url": course.image_url,
                "created_at": course.created_at,
                "lessons": lesson_list
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving course details: {str(e)}"
        )

@router.get("/courses/{course_id}/lessons")
async def get_course_lessons(course_id: int, db: Session = Depends(get_db)):
    """
    Get all lessons for a specific course
    """
    try:
        # Verify course exists
        course = db.query(Course).filter(
            Course.id == course_id,
            Course.is_active == True
        ).first()
        
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        
        lessons = db.query(Lesson).filter(
            Lesson.course_id == course_id,
            Lesson.is_active == True
        ).order_by(Lesson.lesson_number).all()
        
        result = []
        for lesson in lessons:
            result.append({
                "id": lesson.id,
                "title": lesson.title,
                "description": lesson.description,
                "lesson_number": lesson.lesson_number,
                "estimated_duration": lesson.estimated_duration,
                "learning_objectives": json.loads(lesson.learning_objectives) if lesson.learning_objectives else [],
                "created_at": lesson.created_at,
                "has_content": bool(lesson.lesson_content)
            })
        
        return {
            "success": True,
            "course_title": course.title,
            "lessons": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving lessons: {str(e)}"
        )

@router.get("/lessons/{lesson_id}")
async def get_lesson_details(lesson_id: int, db: Session = Depends(get_db)):
    """
    Get detailed information about a specific lesson
    """
    try:
        lesson = db.query(Lesson).filter(
            Lesson.id == lesson_id,
            Lesson.is_active == True
        ).first()
        
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found"
            )
        
        # Get course information
        course = lesson.course
        
        result = {
            "id": lesson.id,
            "title": lesson.title,
            "description": lesson.description,
            "lesson_number": lesson.lesson_number,
            "estimated_duration": lesson.estimated_duration,
            "learning_objectives": json.loads(lesson.learning_objectives) if lesson.learning_objectives else [],
            "course": {
                "id": course.id,
                "title": course.title
            },
            "has_generated_content": bool(lesson.lesson_content)
        }
        
        # If lesson content exists, include summary
        if lesson.lesson_content:
            result["content_summary"] = lesson.lesson_content.content_summary
        
        return {
            "success": True,
            "lesson": result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving lesson details: {str(e)}"
        )

@router.get("/user/{user_id}/progress")
async def get_user_progress(user_id: str, db: Session = Depends(get_db)):
    """
    Get user's learning progress across all courses
    """
    try:
        progress_records = db.query(UserProgress).filter(
            UserProgress.user_id == user_id
        ).all()
        
        # Group by course
        course_progress = {}
        for record in progress_records:
            course_id = record.course_id
            if course_id not in course_progress:
                course_progress[course_id] = {
                    "course_id": course_id,
                    "course_title": record.course.title,
                    "lessons": [],
                    "total_completion": 0,
                    "total_time_spent": 0
                }
            
            course_progress[course_id]["lessons"].append({
                "lesson_id": record.lesson_id,
                "lesson_title": record.lesson.title,
                "is_completed": record.is_completed,
                "completion_percentage": record.completion_percentage,
                "time_spent_minutes": record.time_spent_minutes,
                "last_accessed": record.last_accessed
            })
            
            course_progress[course_id]["total_time_spent"] += record.time_spent_minutes
        
        # Calculate overall completion percentages
        for course_id, data in course_progress.items():
            if data["lessons"]:
                avg_completion = sum(lesson["completion_percentage"] for lesson in data["lessons"]) / len(data["lessons"])
                data["total_completion"] = round(avg_completion, 1)
        
        return {
            "success": True,
            "user_id": user_id,
            "progress": list(course_progress.values())
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving user progress: {str(e)}"
        )