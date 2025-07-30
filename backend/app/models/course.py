from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database.config import Base

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    overview = Column(Text, nullable=False)
    difficulty_level = Column(String(50), default="Beginner")
    estimated_duration = Column(String(50))  # e.g., "4 weeks", "20 hours"
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    lesson_number = Column(Integer, nullable=False)  # Order within course
    estimated_duration = Column(String(50))  # e.g., "30 minutes"
    learning_objectives = Column(Text)  # JSON string of objectives
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    course = relationship("Course", back_populates="lessons")
    lesson_content = relationship("LessonContent", back_populates="lesson", uselist=False)

class LessonContent(Base):
    __tablename__ = "lesson_content"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False, unique=True)
    ai_generated_content = Column(Text)  # Full lesson content from AI
    content_summary = Column(Text)  # Brief summary/introduction
    key_concepts = Column(Text)  # JSON string of key concepts
    code_examples = Column(Text)  # JSON string of code examples
    exercises = Column(Text)  # JSON string of practice exercises
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    lesson = relationship("Lesson", back_populates="lesson_content")

class UserProgress(Base):
    __tablename__ = "user_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(255), nullable=False)  # Can be session ID or user ID
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    is_completed = Column(Boolean, default=False)
    completion_percentage = Column(Integer, default=0)  # 0-100
    time_spent_minutes = Column(Integer, default=0)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    last_accessed = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    lesson = relationship("Lesson")
    course = relationship("Course")