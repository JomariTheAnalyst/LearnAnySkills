from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
from datetime import datetime

from ..database.config import get_db
from ..models import Course, Lesson, LessonContent, UserProgress
from ..services.ai_service import AIService

router = APIRouter(prefix="/api/ai", tags=["ai"])
ai_service = AIService()

class GenerateLessonRequest(BaseModel):
    user_id: Optional[str] = "anonymous"

class UpdateProgressRequest(BaseModel):
    user_id: str
    completion_percentage: int = 0
    time_spent_minutes: int = 0
    is_completed: bool = False

@router.post("/lessons/{lesson_id}/overview")
async def generate_lesson_overview(
    lesson_id: int, 
    request: GenerateLessonRequest,
    db: Session = Depends(get_db)
):
    """
    Generate AI-powered lesson overview and introduction
    """
    try:
        # Get lesson details
        lesson = db.query(Lesson).filter(
            Lesson.id == lesson_id,
            Lesson.is_active == True
        ).first()
        
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found"
            )
        
        course = lesson.course
        
        # Generate overview using AI
        result = await ai_service.generate_lesson_overview(
            course_title=course.title,
            lesson_title=lesson.title,
            lesson_description=lesson.description
        )
        
        return {
            "success": True,
            "lesson": {
                "id": lesson.id,
                "title": lesson.title,
                "description": lesson.description,
                "course_title": course.title,
                "estimated_duration": lesson.estimated_duration,
                "learning_objectives": json.loads(lesson.learning_objectives) if lesson.learning_objectives else []
            },
            "overview": result["overview"],
            "ai_generated": result["success"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating lesson overview: {str(e)}"
        )

@router.post("/lessons/{lesson_id}/generate")
async def generate_lesson_content(
    lesson_id: int,
    request: GenerateLessonRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Generate full AI-powered lesson content
    """
    try:
        # Get lesson details
        lesson = db.query(Lesson).filter(
            Lesson.id == lesson_id,
            Lesson.is_active == True
        ).first()
        
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found"
            )
        
        # Check if content already exists
        existing_content = db.query(LessonContent).filter(
            LessonContent.lesson_id == lesson_id
        ).first()
        
        if existing_content:
            # Return existing content
            try:
                parsed_content = json.loads(existing_content.ai_generated_content)
            except (json.JSONDecodeError, TypeError):
                # If parsing fails, treat as raw content
                parsed_content = {
                    "introduction": existing_content.content_summary or "Lesson content",
                    "main_content": [{"section_title": "Content", "content": existing_content.ai_generated_content}],
                    "code_examples": json.loads(existing_content.code_examples) if existing_content.code_examples else [],
                    "key_takeaways": json.loads(existing_content.key_concepts) if existing_content.key_concepts else [],
                    "practice_exercises": json.loads(existing_content.exercises) if existing_content.exercises else []
                }
            
            return {
                "success": True,
                "lesson": {
                    "id": lesson.id,
                    "title": lesson.title,
                    "course_title": lesson.course.title
                },
                "content": parsed_content,
                "cached": True,
                "generated_at": existing_content.generated_at
            }
        
        course = lesson.course
        learning_objectives = json.loads(lesson.learning_objectives) if lesson.learning_objectives else []
        
        # Generate content using AI
        result = await ai_service.generate_lesson_content(
            course_title=course.title,
            lesson_title=lesson.title,
            lesson_description=lesson.description,
            learning_objectives=learning_objectives,
            estimated_duration=lesson.estimated_duration
        )
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"AI content generation failed: {result.get('error', 'Unknown error')}"
            )
        
        # Cache the generated content in database
        background_tasks.add_task(
            cache_lesson_content, 
            db, 
            lesson_id, 
            result["content"], 
            result["raw_content"]
        )
        
        # Initialize user progress if user_id provided
        if request.user_id and request.user_id != "anonymous":
            background_tasks.add_task(
                initialize_user_progress,
                db,
                request.user_id,
                lesson_id,
                course.id
            )
        
        return {
            "success": True,
            "lesson": {
                "id": lesson.id,
                "title": lesson.title,
                "course_title": course.title
            },
            "content": result["content"],
            "cached": False,
            "generated_at": datetime.now()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating lesson content: {str(e)}"
        )

@router.get("/lessons/{lesson_id}/content")
async def get_cached_lesson_content(lesson_id: int, db: Session = Depends(get_db)):
    """
    Retrieve cached lesson content if available
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
        
        content = db.query(LessonContent).filter(
            LessonContent.lesson_id == lesson_id
        ).first()
        
        if not content:
            return {
                "success": False,
                "message": "No cached content available. Please generate lesson content first.",
                "has_content": False
            }
        
        try:
            parsed_content = json.loads(content.ai_generated_content)
        except (json.JSONDecodeError, TypeError):
            parsed_content = {
                "introduction": content.content_summary or "Lesson content",
                "main_content": [{"section_title": "Content", "content": content.ai_generated_content}],
                "code_examples": json.loads(content.code_examples) if content.code_examples else [],
                "key_takeaways": json.loads(content.key_concepts) if content.key_concepts else [],
                "practice_exercises": json.loads(content.exercises) if content.exercises else []
            }
        
        return {
            "success": True,
            "lesson": {
                "id": lesson.id,
                "title": lesson.title,
                "course_title": lesson.course.title
            },
            "content": parsed_content,
            "has_content": True,
            "generated_at": content.generated_at
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving lesson content: {str(e)}"
        )

@router.post("/lessons/{lesson_id}/progress")
async def update_lesson_progress(
    lesson_id: int,
    request: UpdateProgressRequest,
    db: Session = Depends(get_db)
):
    """
    Update user's progress for a specific lesson
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
        
        # Find or create progress record
        progress = db.query(UserProgress).filter(
            UserProgress.user_id == request.user_id,
            UserProgress.lesson_id == lesson_id
        ).first()
        
        if not progress:
            progress = UserProgress(
                user_id=request.user_id,
                lesson_id=lesson_id,
                course_id=lesson.course_id
            )
            db.add(progress)
        
        # Update progress
        progress.completion_percentage = min(100, max(0, request.completion_percentage))
        progress.time_spent_minutes += request.time_spent_minutes
        progress.is_completed = request.is_completed
        progress.last_accessed = datetime.now()
        
        if request.is_completed and not progress.completed_at:
            progress.completed_at = datetime.now()
        
        db.commit()
        
        return {
            "success": True,
            "message": "Progress updated successfully",
            "progress": {
                "lesson_id": lesson_id,
                "completion_percentage": progress.completion_percentage,
                "time_spent_minutes": progress.time_spent_minutes,
                "is_completed": progress.is_completed
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating progress: {str(e)}"
        )

# Background task functions
def cache_lesson_content(db: Session, lesson_id: int, content: Dict[Any, Any], raw_content: str):
    """
    Cache generated lesson content in database
    """
    try:
        # Check if content already exists
        existing_content = db.query(LessonContent).filter(
            LessonContent.lesson_id == lesson_id
        ).first()
        
        if existing_content:
            # Update existing content
            existing_content.ai_generated_content = raw_content
            existing_content.content_summary = content.get("introduction", "")[:500]
            existing_content.key_concepts = json.dumps(content.get("key_takeaways", []))
            existing_content.code_examples = json.dumps(content.get("code_examples", []))
            existing_content.exercises = json.dumps(content.get("practice_exercises", []))
            existing_content.updated_at = datetime.now()
        else:
            # Create new content record
            lesson_content = LessonContent(
                lesson_id=lesson_id,
                ai_generated_content=raw_content,
                content_summary=content.get("introduction", "")[:500],
                key_concepts=json.dumps(content.get("key_takeaways", [])),
                code_examples=json.dumps(content.get("code_examples", [])),
                exercises=json.dumps(content.get("practice_exercises", []))
            )
            db.add(lesson_content)
        
        db.commit()
        
    except Exception as e:
        print(f"Error caching lesson content: {e}")
        db.rollback()
    finally:
        db.close()

def initialize_user_progress(db: Session, user_id: str, lesson_id: int, course_id: int):
    """
    Initialize user progress tracking for a lesson
    """
    try:
        # Check if progress already exists
        existing_progress = db.query(UserProgress).filter(
            UserProgress.user_id == user_id,
            UserProgress.lesson_id == lesson_id
        ).first()
        
        if not existing_progress:
            progress = UserProgress(
                user_id=user_id,
                lesson_id=lesson_id,
                course_id=course_id,
                completion_percentage=0
            )
            db.add(progress)
            db.commit()
        
    except Exception as e:
        print(f"Error initializing user progress: {e}")
        db.rollback()
    finally:
        db.close()