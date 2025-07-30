import os
import json
import httpx
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

class AIService:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        self.model = os.getenv("OPENROUTER_MODEL", "qwen/qwen3-coder:free")
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        
        if not self.api_key:
            raise ValueError("OPENROUTER_API_KEY environment variable is required")
    
    async def generate_lesson_content(
        self, 
        course_title: str, 
        lesson_title: str, 
        lesson_description: str,
        learning_objectives: list,
        estimated_duration: str
    ) -> Dict[str, Any]:
        """
        Generate comprehensive lesson content using OpenRouter AI
        """
        
        # Create a detailed prompt for lesson generation
        prompt = f"""
You are an expert educator creating a comprehensive lesson for an online learning platform. 

Course: {course_title}
Lesson: {lesson_title}
Description: {lesson_description}
Duration: {estimated_duration}

Learning Objectives:
{chr(10).join(f"- {obj}" for obj in learning_objectives)}

Please create a well-structured lesson that includes:

1. **Introduction** (2-3 paragraphs): Engaging opening that explains what students will learn and why it's important
2. **Main Content** (4-6 sections): Core concepts explained in clear, easy-to-understand paragraphs
3. **Code Examples** (if applicable): Minimal, well-commented code snippets that demonstrate key concepts
4. **Key Takeaways** (3-5 bullet points): Main concepts students should remember
5. **Practice Exercise** (1-2 exercises): Hands-on activities to reinforce learning

Guidelines:
- Use clear, conversational language appropriate for beginners to intermediate learners
- Break complex concepts into digestible chunks
- Include practical examples relevant to real-world scenarios
- Keep code examples minimal and well-commented
- Focus on understanding concepts rather than memorization
- Make it engaging and interactive where possible

Format your response as valid JSON with the following structure:
{{
    "introduction": "...",
    "main_content": [
        {{
            "section_title": "...",
            "content": "..."
        }}
    ],
    "code_examples": [
        {{
            "title": "...",
            "code": "...",
            "explanation": "..."
        }}
    ],
    "key_takeaways": ["..."],
    "practice_exercises": [
        {{
            "title": "...",
            "description": "...",
            "difficulty": "beginner|intermediate|advanced"
        }}
    ]
}}
"""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "LearnAnySkills Platform"
        }
        
        data = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert educator and curriculum designer. Create engaging, clear, and comprehensive lesson content that helps students learn effectively. Always respond with valid JSON."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 4000,
            "top_p": 1,
            "frequency_penalty": 0,
            "presence_penalty": 0
        }
        
        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(
                    self.base_url,
                    headers=headers,
                    json=data
                )
                response.raise_for_status()
                
                result = response.json()
                
                if "choices" in result and len(result["choices"]) > 0:
                    content = result["choices"][0]["message"]["content"]
                    
                    # Try to parse the JSON response
                    try:
                        lesson_data = json.loads(content)
                        return {
                            "success": True,
                            "content": lesson_data,
                            "raw_content": content
                        }
                    except json.JSONDecodeError:
                        # If JSON parsing fails, return raw content
                        return {
                            "success": True,
                            "content": {
                                "introduction": content[:500] + "...",
                                "main_content": [{"section_title": "Generated Content", "content": content}],
                                "code_examples": [],
                                "key_takeaways": ["Review the generated content"],
                                "practice_exercises": []
                            },
                            "raw_content": content
                        }
                else:
                    return {
                        "success": False,
                        "error": "No content generated by AI model",
                        "content": None
                    }
                    
        except httpx.HTTPStatusError as e:
            return {
                "success": False,
                "error": f"API request failed: {e.response.status_code} - {e.response.text}",
                "content": None
            }
        except Exception as e:
            return {
                "success": False,
                "error": f"Unexpected error: {str(e)}",
                "content": None
            }
    
    async def generate_lesson_overview(
        self, 
        course_title: str, 
        lesson_title: str, 
        lesson_description: str
    ) -> Dict[str, str]:
        """
        Generate a brief lesson overview and introduction
        """
        
        prompt = f"""
Create a brief, engaging overview for the following lesson:

Course: {course_title}
Lesson: {lesson_title}
Description: {lesson_description}

Write a 2-3 paragraph overview that:
- Introduces the lesson topic in an engaging way
- Explains what students will learn
- Motivates students to begin the lesson

Keep it concise, clear, and exciting. Focus on the practical value and real-world applications.
"""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "LearnAnySkills Platform"
        }
        
        data = {
            "model": self.model,
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert educator. Create engaging, motivating lesson overviews that get students excited about learning."
                },
                {
                    "role": "user", 
                    "content": prompt
                }
            ],
            "temperature": 0.8,
            "max_tokens": 500,
            "top_p": 1
        }
        
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.base_url,
                    headers=headers,
                    json=data
                )
                response.raise_for_status()
                
                result = response.json()
                
                if "choices" in result and len(result["choices"]) > 0:
                    overview = result["choices"][0]["message"]["content"]
                    return {
                        "success": True,
                        "overview": overview.strip()
                    }
                else:
                    return {
                        "success": False,
                        "overview": f"Get ready to dive into {lesson_title}! This lesson will provide you with essential knowledge and practical skills that you can apply immediately."
                    }
                    
        except Exception as e:
            # Fallback overview if AI fails
            return {
                "success": False,
                "overview": f"Welcome to {lesson_title}! In this lesson, you'll learn {lesson_description.lower()}. Let's get started on this exciting learning journey!"
            }