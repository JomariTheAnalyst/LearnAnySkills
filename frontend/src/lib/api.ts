import axios from 'axios';
import type {
  CoursesResponse,
  CourseResponse,
  LessonsResponse,
  LessonResponse,
  LessonOverviewResponse,
  LessonContentResponse,
  ProgressResponse,
  GenerateLessonRequest,
  UpdateProgressRequest,
} from '@/types';

// Configure axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  timeout: 60000, // 60 seconds for AI requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle common error cases
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 500) {
      throw new Error('Server error occurred');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - the operation took too long');
    } else if (!error.response) {
      throw new Error('Network error - please check your connection');
    }
    
    throw error;
  }
);

// Course API functions
export const courseApi = {
  // Get all courses
  async getAllCourses(): Promise<CoursesResponse> {
    const response = await api.get('/api/courses');
    return response.data;
  },

  // Get course by ID
  async getCourse(courseId: number): Promise<CourseResponse> {
    const response = await api.get(`/api/courses/${courseId}`);
    return response.data;
  },

  // Get lessons for a course
  async getCourseLessons(courseId: number): Promise<LessonsResponse> {
    const response = await api.get(`/api/courses/${courseId}/lessons`);
    return response.data;
  },

  // Get lesson details
  async getLesson(lessonId: number): Promise<LessonResponse> {
    const response = await api.get(`/api/lessons/${lessonId}`);
    return response.data;
  },
};

// AI API functions
export const aiApi = {
  // Generate lesson overview
  async generateLessonOverview(
    lessonId: number,
    request: GenerateLessonRequest = {}
  ): Promise<LessonOverviewResponse> {
    const response = await api.post(`/api/ai/lessons/${lessonId}/overview`, request);
    return response.data;
  },

  // Generate full lesson content
  async generateLessonContent(
    lessonId: number,
    request: GenerateLessonRequest = {}
  ): Promise<LessonContentResponse> {
    const response = await api.post(`/api/ai/lessons/${lessonId}/generate`, request);
    return response.data;
  },

  // Get cached lesson content
  async getCachedLessonContent(lessonId: number): Promise<LessonContentResponse> {
    const response = await api.get(`/api/ai/lessons/${lessonId}/content`);
    return response.data;
  },

  // Update lesson progress
  async updateProgress(
    lessonId: number,
    request: UpdateProgressRequest
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/api/ai/lessons/${lessonId}/progress`, request);
    return response.data;
  },
};

// User progress API functions
export const progressApi = {
  // Get user progress
  async getUserProgress(userId: string): Promise<ProgressResponse> {
    const response = await api.get(`/api/user/${userId}/progress`);
    return response.data;
  },
};

// Health check
export const healthApi = {
  async checkHealth(): Promise<{ status: string; service: string; version: string }> {
    const response = await api.get('/health');
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Check if API is available
  async isApiAvailable(): Promise<boolean> {
    try {
      await healthApi.checkHealth();
      return true;
    } catch (error) {
      console.error('API not available:', error);
      return false;
    }
  },

  // Generate a unique user ID for anonymous users
  generateUserId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `user_${timestamp}_${random}`;
  },

  // Get or create user ID from localStorage
  getUserId(): string {
    if (typeof window === 'undefined') return 'anonymous';
    
    let userId = localStorage.getItem('learnaskill_user_id');
    if (!userId) {
      userId = this.generateUserId();
      localStorage.setItem('learnaskill_user_id', userId);
    }
    return userId;
  },

  // Clear user data
  clearUserData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('learnaskill_user_id');
    }
  },
};

// Export the main api instance for custom requests
export default api;