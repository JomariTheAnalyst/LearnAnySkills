'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { courseApi } from '@/lib/api';
import type { Course } from '@/types';
import { cn, formatDuration, getDifficultyColor } from '@/lib/utils';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await courseApi.getAllCourses();
        setCourses(response.courses);
      } catch (err) {
        setError('Failed to load courses. Please try again later.');
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Navigation */}
      <nav className="p-6 bg-white/80 backdrop-blur-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg" />
            <span className="text-xl font-bold text-neutral-900">LearnAnySkills</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-4">
            All Courses
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Choose from our comprehensive collection of AI-powered courses designed to accelerate your learning journey.
          </p>
        </motion.div>

        {/* Courses Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/courses/${course.id}`}>
                  <div className="course-card group cursor-pointer h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        getDifficultyColor(course.difficulty_level)
                      )}>
                        {course.difficulty_level}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-primary-700 transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-neutral-600 mb-6 leading-relaxed">
                      {course.description.length > 150 ? course.description.substring(0, 150) + '...' : course.description}
                    </p>
                    
                    <div className="mt-auto space-y-3">
                      <div className="flex items-center justify-between text-sm text-neutral-500">
                        <div className="flex items-center space-x-1">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.lesson_count} lessons</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(course.estimated_duration)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-sm text-neutral-500">
                          <Users className="w-4 h-4" />
                          <span>{Math.floor(Math.random() * 500) + 100}+ enrolled</span>
                        </div>
                        <div className="text-primary-600 font-medium group-hover:text-primary-700 transition-colors">
                          Start Learning →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}