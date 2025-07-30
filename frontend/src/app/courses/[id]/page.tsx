'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, ChevronLeft, Play, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { courseApi } from '@/lib/api';
import type { Course } from '@/types';
import { cn, formatDuration, getDifficultyColor } from '@/lib/utils';

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = parseInt(params?.id as string);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      if (!courseId || isNaN(courseId)) {
        setError('Invalid course ID');
        setLoading(false);
        return;
      }

      try {
        const response = await courseApi.getCourse(courseId);
        setCourse(response.course);
      } catch (err) {
        setError('Failed to load course. Please try again later.');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Course not found'}</p>
          <Link href="/courses" className="btn-primary">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Navigation */}
      <nav className="p-6 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/courses" className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Courses</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg" />
            <span className="text-xl font-bold text-neutral-900">LearnAnySkills</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Course Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <span className={cn(
                  "px-3 py-1 rounded-full text-sm font-medium",
                  getDifficultyColor(course.difficulty_level)
                )}>
                  {course.difficulty_level}
                </span>
                <div className="flex items-center space-x-1 text-neutral-500">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons?.length || 0} lessons</span>
                </div>
                <div className="flex items-center space-x-1 text-neutral-500">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(course.estimated_duration)}</span>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6">
                {course.title}
              </h1>
              
              <p className="text-xl text-neutral-600 leading-relaxed mb-8">
                {course.description}
              </p>
              
              <div className="flex items-center space-x-1 text-neutral-500 mb-8">
                <Users className="w-5 h-5" />
                <span>{Math.floor(Math.random() * 1000) + 200}+ students enrolled</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {course.lessons && course.lessons.length > 0 && (
                  <Link 
                    href={`/lessons/${course.lessons[0].id}`}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Play className="w-5 h-5" />
                    <span>Start Learning</span>
                  </Link>
                )}
                <button className="btn-outline">
                  Save for Later
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-neutral-200">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                Course Overview
              </h3>
              <div className="prose-custom">
                {course.overview ? (
                  <div dangerouslySetInnerHTML={{ __html: course.overview.replace(/\n/g, '<br>') }} />
                ) : (
                  <p>Detailed course overview will be available soon.</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lessons List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-neutral-900 mb-8">
            Course Content
          </h2>
          
          {course.lessons && course.lessons.length > 0 ? (
            <div className="space-y-4">
              {course.lessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/lessons/${lesson.id}`}>
                    <div className="lesson-card group flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                          <span className="text-primary-600 font-semibold">
                            {lesson.lesson_number}
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors">
                            {lesson.title}
                          </h3>
                          <p className="text-neutral-600">
                            {lesson.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDuration(lesson.estimated_duration)}</span>
                            </div>
                            {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
                              <span>{lesson.learning_objectives.length} objectives</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {lesson.has_content && (
                          <CheckCircle className="w-5 h-5 text-accent-600" />
                        )}
                        <Play className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">No lessons available yet. Check back soon!</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}