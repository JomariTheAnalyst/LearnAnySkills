// Course and Lesson Types
export interface Course {
  id: number;
  title: string;
  description: string;
  overview?: string;
  difficulty_level: string;
  estimated_duration: string;
  image_url?: string;
  lesson_count?: number;
  created_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  lesson_number: number;
  estimated_duration: string;
  learning_objectives: string[];
  created_at?: string;
  has_content?: boolean;
  has_generated_content?: boolean;
  content_summary?: string;
  course?: {
    id: number;
    title: string;
  };
}

export interface LessonContent {
  introduction: string;
  main_content: {
    section_title: string;
    content: string;
  }[];
  code_examples: {
    title: string;
    code: string;
    explanation: string;
  }[];
  key_takeaways: string[];
  practice_exercises: {
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  }[];
}

export interface UserProgress {
  lesson_id: number;
  lesson_title: string;
  is_completed: boolean;
  completion_percentage: number;
  time_spent_minutes: number;
  last_accessed: string;
}

export interface CourseProgress {
  course_id: number;
  course_title: string;
  lessons: UserProgress[];
  total_completion: number;
  total_time_spent: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  error?: string;
}

export interface CoursesResponse extends ApiResponse<Course[]> {
  courses: Course[];
}

export interface CourseResponse extends ApiResponse<Course> {
  course: Course;
}

export interface LessonsResponse extends ApiResponse<Lesson[]> {
  course_title: string;
  lessons: Lesson[];
}

export interface LessonResponse extends ApiResponse<Lesson> {
  lesson: Lesson;
}

export interface LessonOverviewResponse extends ApiResponse<string> {
  lesson: {
    id: number;
    title: string;
    description: string;
    course_title: string;
    estimated_duration: string;
    learning_objectives: string[];
  };
  overview: string;
  ai_generated: boolean;
}

export interface LessonContentResponse extends ApiResponse<LessonContent> {
  lesson: {
    id: number;
    title: string;
    course_title: string;
  };
  content: LessonContent;
  cached: boolean;
  has_content?: boolean;
  generated_at: string;
}

export interface ProgressResponse extends ApiResponse<CourseProgress[]> {
  user_id: string;
  progress: CourseProgress[];
}

// UI Component Types
export interface AnimatedBackgroundProps {
  variant?: 'default' | 'hero' | 'course' | 'lesson';
  children: React.ReactNode;
}

export interface FloatingElementProps {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export interface CourseCardProps {
  course: Course;
  onClick: () => void;
  className?: string;
}

export interface LessonCardProps {
  lesson: Lesson;
  onClick: () => void;
  className?: string;
}

export interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Navigation Types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// Form Types
export interface GenerateLessonRequest {
  user_id?: string;
}

export interface UpdateProgressRequest {
  user_id: string;
  completion_percentage?: number;
  time_spent_minutes?: number;
  is_completed?: boolean;
}

// Three.js Scene Types
export interface FloatingShapeProps {
  position: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
}

export interface SceneProps {
  variant?: 'hero' | 'course' | 'lesson';
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  details?: any;
}