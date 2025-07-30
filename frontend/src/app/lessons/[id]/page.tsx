'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Brain, Clock, CheckCircle, Play, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { courseApi, aiApi, apiUtils } from '@/lib/api';
import type { Lesson, LessonContent } from '@/types';
import { formatDuration } from '@/lib/utils';

export default function LessonPage() {
  const params = useParams();
  const lessonId = parseInt(params?.id as string);
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [overview, setOverview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLesson() {
      if (!lessonId || isNaN(lessonId)) {
        setError('Invalid lesson ID');
        setLoading(false);
        return;
      }

      try {
        // Fetch lesson details
        const lessonResponse = await courseApi.getLesson(lessonId);
        setLesson(lessonResponse.lesson);

        // Try to get cached content first
        try {
          const contentResponse = await aiApi.getCachedLessonContent(lessonId);
          if (contentResponse.has_content) {
            setContent(contentResponse.content);
          }
        } catch (contentError) {
          console.log('No cached content available');
        }

        // Generate lesson overview
        const userId = apiUtils.getUserId();
        const overviewResponse = await aiApi.generateLessonOverview(lessonId, { user_id: userId });
        setOverview(overviewResponse.overview);

      } catch (err) {
        setError('Failed to load lesson. Please try again later.');
        console.error('Error fetching lesson:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [lessonId]);

  const generateContent = async () => {
    if (!lesson) return;

    setGenerating(true);
    try {
      const userId = apiUtils.getUserId();
      const response = await aiApi.generateLessonContent(lessonId, { user_id: userId });
      setContent(response.content);
    } catch (err) {
      setError('Failed to generate lesson content. Please try again.');
      console.error('Error generating content:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Lesson not found'}</p>
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
          <Link 
            href={lesson.course ? `/courses/${lesson.course.id}` : '/courses'} 
            className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to {lesson.course?.title || 'Course'}</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg" />
            <span className="text-xl font-bold text-neutral-900">LearnAnySkills</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Lesson Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <span className="text-primary-600 font-semibold">
                {lesson.lesson_number}
              </span>
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900">
                {lesson.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-neutral-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(lesson.estimated_duration)}</span>
                </div>
                {lesson.course && (
                  <span>From {lesson.course.title}</span>
                )}
              </div>
            </div>
          </div>
          
          <p className="text-lg text-neutral-600 leading-relaxed">
            {lesson.description}
          </p>
        </motion.div>

        {/* Learning Objectives */}
        {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-8"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">
              What You'll Learn
            </h2>
            <ul className="space-y-2">
              {lesson.learning_objectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral-700">{objective}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Lesson Overview */}
        {overview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200 mb-8"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-4 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary-600" />
              <span>Lesson Overview</span>
            </h2>
            <div className="prose-custom">
              <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {overview}
              </p>
            </div>
          </motion.div>
        )}

        {/* Content Generation */}
        {!content ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8 text-center"
          >
            <Brain className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">
              Ready to Begin Your Lesson?
            </h2>
            <p className="text-neutral-600 mb-6 max-w-md mx-auto">
              Click the button below to generate your personalized lesson content powered by AI.
            </p>
            <button
              onClick={generateContent}
              disabled={generating}
              className="btn-primary flex items-center space-x-2 mx-auto"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Generating Lesson...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  <span>Begin Lesson</span>
                </>
              )}
            </button>
          </motion.div>
        ) : (
          /* Generated Content */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Introduction */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                Introduction
              </h2>
              <div className="prose-custom">
                <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                  {content.introduction}
                </p>
              </div>
            </div>

            {/* Main Content */}
            {content.main_content && content.main_content.map((section, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  {section.section_title}
                </h2>
                <div className="prose-custom">
                  <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Code Examples */}
            {content.code_examples && content.code_examples.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  Code Examples
                </h2>
                <div className="space-y-6">
                  {content.code_examples.map((example, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-medium text-neutral-800 mb-2">
                        {example.title}
                      </h3>
                      <div className="code-block mb-3">
                        <pre><code>{example.code}</code></pre>
                      </div>
                      <p className="text-neutral-600 text-sm">
                        {example.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Takeaways */}
            {content.key_takeaways && content.key_takeaways.length > 0 && (
              <div className="bg-accent-50 rounded-xl p-6 border border-accent-200">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  Key Takeaways
                </h2>
                <ul className="space-y-2">
                  {content.key_takeaways.map((takeaway, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700">{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Practice Exercises */}
            {content.practice_exercises && content.practice_exercises.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                  Practice Exercises
                </h2>
                <div className="space-y-4">
                  {content.practice_exercises.map((exercise, index) => (
                    <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-neutral-800">
                          {exercise.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          exercise.difficulty === 'beginner' 
                            ? 'bg-accent-100 text-accent-700'
                            : exercise.difficulty === 'intermediate'
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-secondary-100 text-secondary-700'
                        }`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                      <p className="text-neutral-600">
                        {exercise.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}