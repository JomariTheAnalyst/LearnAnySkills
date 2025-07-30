'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { BookOpen, Brain, Zap, ArrowRight, Users, Award, Clock } from 'lucide-react';
import Link from 'next/link';

import { courseApi } from '@/lib/api';
import type { Course } from '@/types';
import { cn } from '@/lib/utils';

function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <Float speed={1} rotationIntensity={1} floatIntensity={2}>
        <mesh>
          <torusGeometry args={[1, 0.3, 16, 32]} />
          <meshNormalMaterial />
        </mesh>
      </Float>
      
      <Float speed={0.5} rotationIntensity={0.5} floatIntensity={1} position={[3, -1, 0]}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#0ea5e9" />
        </mesh>
      </Float>
      
      <Float speed={0.8} rotationIntensity={0.8} floatIntensity={1.5} position={[-3, 1, 0]}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#d946ef" />
        </mesh>
      </Float>
    </Canvas>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="course-card group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
          <BookOpen className="w-6 h-6 text-primary-600" />
        </div>
        <div className="text-right">
          <div className="text-sm text-neutral-500">{course.lesson_count} lessons</div>
          <div className="text-xs text-neutral-400">{course.estimated_duration}</div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
        {course.title}
      </h3>
      
      <p className="text-neutral-600 mb-4 leading-relaxed">
        {course.description}
      </p>
      
      <div className="flex items-center justify-between">
        <span className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          course.difficulty_level.toLowerCase() === 'beginner' && "bg-accent-100 text-accent-700",
          course.difficulty_level.toLowerCase() === 'intermediate' && "bg-primary-100 text-primary-700",
          course.difficulty_level.toLowerCase() === 'advanced' && "bg-secondary-100 text-secondary-700"
        )}>
          {course.difficulty_level}
        </span>
        
        <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
      </div>
    </motion.div>
  );
}

export default function HomePage() {
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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg" />
            <span className="text-xl font-bold text-neutral-900">LearnAnySkills</span>
          </div>
          
          <Link 
            href="/courses"
            className="btn-primary"
          >
            View All Courses
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 mb-6 leading-tight">
              Master Skills with{' '}
              <span className="text-gradient">AI-Powered</span>{' '}
              Learning
            </h1>
            
            <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
              Transform your career with our interactive learning platform. 
              Get personalized, AI-generated lessons that adapt to your pace and learning style.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/courses" className="btn-primary text-lg px-8 py-3">
                Start Learning Now
              </Link>
              <button className="btn-outline text-lg px-8 py-3">
                Watch Demo
              </button>
            </div>
            
            <div className="flex items-center space-x-8 text-sm text-neutral-500">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>10,000+ learners</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span>Expert-crafted content</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Learn at your pace</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-96 lg:h-[500px]"
          >
            <Scene />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Why Choose LearnAnySkills?
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Experience the future of learning with our cutting-edge platform designed for modern learners.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Content',
                description: 'Get personalized lessons generated by advanced AI that adapts to your learning style and pace.'
              },
              {
                icon: Zap,
                title: 'Interactive Experience',
                description: 'Engage with immersive 3D visualizations and interactive exercises that make learning memorable.'
              },
              {
                icon: Award,
                title: 'Expert-Designed Curriculum',
                description: 'Learn from carefully crafted courses designed by industry experts and educational professionals.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-neutral-600">
              Start your learning journey with our most popular courses
            </p>
          </motion.div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <Link href={`/courses/${course.id}`}>
                    <CourseCard course={course} />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Skills?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of learners who are already advancing their careers with our AI-powered platform.
            </p>
            <Link 
              href="/courses"
              className="bg-white text-primary-600 hover:bg-neutral-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg" />
                <span className="text-xl font-bold">LearnAnySkills</span>
              </div>
              <p className="text-neutral-400">
                Empowering learners with AI-powered education for the future.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Courses</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/courses" className="hover:text-white transition-colors">All Courses</Link></li>
                <li><Link href="/courses?category=python" className="hover:text-white transition-colors">Python</Link></li>
                <li><Link href="/courses?category=sql" className="hover:text-white transition-colors">SQL</Link></li>
                <li><Link href="/courses?category=excel" className="hover:text-white transition-colors">Excel</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-neutral-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-400">
            <p>&copy; 2024 LearnAnySkills. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}