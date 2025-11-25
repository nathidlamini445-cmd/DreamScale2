import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GenerateTasksRequest {
  goalTitle: string;
  category: string;
  goalTarget?: string;
  goalCurrent?: string;
  existingTasks?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateTasksRequest = await request.json();
    const { goalTitle, category, goalTarget, goalCurrent, existingTasks = [] } = body;

    if (!process.env.GEMINI_API_KEY) {
      // Fallback: Return high-quality evergreen tasks based on category
      return NextResponse.json({
        success: true,
        tasks: generateFallbackTasks(category, goalTitle)
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-pro' 
    });

    // Create a comprehensive prompt for generating tailored tasks
    const prompt = `You are an expert productivity coach and task strategist. Generate 10 high-quality, actionable tasks that are tailored to help someone achieve their specific goal.

USER'S GOAL:
- Goal: ${goalTitle}
- Category: ${category}
${goalTarget ? `- Target: ${goalTarget}` : ''}
${goalCurrent ? `- Current Progress: ${goalCurrent}` : ''}

EXISTING TASKS (avoid duplicating these):
${existingTasks.length > 0 ? existingTasks.map((t, i) => `${i + 1}. ${t}`).join('\n') : 'None yet'}

REQUIREMENTS:
1. Tasks must be SPECIFIC and ACTIONABLE (not vague like "work on goal")
2. Tasks should be EVERGREEN (can be done repeatedly, not one-time)
3. Tasks must be TAILORED to the user's niche/category: ${category}
4. Tasks should help progress toward: ${goalTitle}
5. Mix of high-impact, medium-impact, and quick-win tasks
6. Each task should be clear, measurable, and achievable
7. Avoid generic tasks - make them niche-specific
8. Include tasks that build skills, create content, engage audience, or generate revenue (depending on category)

OUTPUT FORMAT (JSON array):
[
  {
    "title": "Specific actionable task title",
    "impact": "high" | "medium" | "low",
    "points": 100-300 (higher for high impact),
    "estimatedTime": "15 min" | "30 min" | "45 min" | "1 hour",
    "category": "${category}",
    "howToComplete": [
      "Step 1: Specific action",
      "Step 2: Specific action",
      "Step 3: Specific action"
    ]
  }
]

Generate exactly 10 tasks. Return ONLY valid JSON, no markdown, no explanations.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response (handle markdown code blocks if present)
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      
      const tasks = JSON.parse(jsonText);
      
      // Validate and ensure we have exactly 10 tasks
      if (!Array.isArray(tasks) || tasks.length === 0) {
        throw new Error('Invalid task format');
      }

      // Ensure all tasks have required fields
      const validatedTasks = tasks.slice(0, 10).map((task: any, index: number) => ({
        id: Date.now() + index,
        title: task.title || `Task ${index + 1}`,
        completed: false,
        points: task.points || (task.impact === 'high' ? 300 : task.impact === 'medium' ? 200 : 100),
        impact: task.impact || 'medium',
        category: task.category || category,
        estimatedTime: task.estimatedTime || '30 min',
        howToComplete: task.howToComplete || [],
        completedAt: undefined
      }));

      return NextResponse.json({
        success: true,
        tasks: validatedTasks
      });
    } catch (aiError: any) {
      console.error('AI generation error:', aiError);
      // Fallback to category-based tasks
      return NextResponse.json({
        success: true,
        tasks: generateFallbackTasks(category, goalTitle)
      });
    }
  } catch (error: any) {
    console.error('Error generating tasks:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate tasks',
        tasks: generateFallbackTasks(body.category || 'general', body.goalTitle || 'your goal')
      },
      { status: 500 }
    );
  }
}

// Fallback function for high-quality evergreen tasks by category
function generateFallbackTasks(category: string, goalTitle: string): any[] {
  const categoryTasks: Record<string, any[]> = {
    revenue: [
      {
        id: Date.now() + 1,
        title: "Reach out to 3 potential clients or customers",
        impact: "high",
        points: 300,
        category: "revenue",
        estimatedTime: "45 min",
        howToComplete: [
          "Research 3 potential clients in your niche",
          "Craft personalized outreach messages",
          "Send emails or DMs with clear value proposition"
        ],
        completed: false
      },
      {
        id: Date.now() + 2,
        title: "Follow up with 5 previous leads",
        impact: "high",
        points: 250,
        category: "revenue",
        estimatedTime: "30 min",
        howToComplete: [
          "Review your lead list from the past week",
          "Send personalized follow-up messages",
          "Offer additional value or answer questions"
        ],
        completed: false
      },
      {
        id: Date.now() + 3,
        title: "Create and post a case study or testimonial",
        impact: "medium",
        points: 200,
        category: "revenue",
        estimatedTime: "45 min",
        howToComplete: [
          "Choose a successful client or project",
          "Write a detailed case study",
          "Post on your website or social media"
        ],
        completed: false
      },
      {
        id: Date.now() + 4,
        title: "Update pricing page with current offers",
        impact: "medium",
        points: 150,
        category: "revenue",
        estimatedTime: "20 min",
        howToComplete: [
          "Review your current pricing structure",
          "Update any outdated information",
          "Add clear call-to-action buttons"
        ],
        completed: false
      },
      {
        id: Date.now() + 5,
        title: "Research competitor pricing strategies",
        impact: "low",
        points: 100,
        category: "revenue",
        estimatedTime: "15 min",
        howToComplete: [
          "Identify 3 main competitors",
          "Review their pricing pages",
          "Document insights for your strategy"
        ],
        completed: false
      }
    ],
    audience: [
      {
        id: Date.now() + 1,
        title: "Post 3 pieces of valuable content across platforms",
        impact: "high",
        points: 300,
        category: "audience",
        estimatedTime: "1 hour",
        howToComplete: [
          "Create or curate valuable content",
          "Post on Instagram, Twitter, LinkedIn, or TikTok",
          "Engage with comments and responses"
        ],
        completed: false
      },
      {
        id: Date.now() + 2,
        title: "Engage with 10 posts in your niche",
        impact: "medium",
        points: 200,
        category: "audience",
        estimatedTime: "30 min",
        howToComplete: [
          "Find posts from creators in your niche",
          "Leave thoughtful comments",
          "Share valuable insights or ask questions"
        ],
        completed: false
      },
      {
        id: Date.now() + 3,
        title: "Send newsletter or email to your list",
        impact: "high",
        points: 250,
        category: "audience",
        estimatedTime: "45 min",
        howToComplete: [
          "Write valuable content for your subscribers",
          "Include a clear call-to-action",
          "Send and track open rates"
        ],
        completed: false
      },
      {
        id: Date.now() + 4,
        title: "Update social media bio and links",
        impact: "low",
        points: 100,
        category: "audience",
        estimatedTime: "10 min",
        howToComplete: [
          "Review your current bio",
          "Update with latest achievements or offers",
          "Ensure links are working"
        ],
        completed: false
      },
      {
        id: Date.now() + 5,
        title: "Collaborate with another creator",
        impact: "medium",
        points: 200,
        category: "audience",
        estimatedTime: "30 min",
        howToComplete: [
          "Identify a potential collaborator",
          "Reach out with collaboration idea",
          "Plan content or project together"
        ],
        completed: false
      }
    ],
    content: [
      {
        id: Date.now() + 1,
        title: "Create and publish 3 pieces of content",
        impact: "high",
        points: 300,
        category: "content",
        estimatedTime: "1 hour",
        howToComplete: [
          "Brainstorm content ideas aligned with your niche",
          "Create content (video, post, article, etc.)",
          "Publish across your chosen platforms"
        ],
        completed: false
      },
      {
        id: Date.now() + 2,
        title: "Plan next week's content calendar",
        impact: "medium",
        points: 200,
        category: "content",
        estimatedTime: "30 min",
        howToComplete: [
          "List 7 content ideas",
          "Assign each to a day",
          "Note key topics and formats"
        ],
        completed: false
      },
      {
        id: Date.now() + 3,
        title: "Engage with your audience comments",
        impact: "medium",
        points: 150,
        category: "content",
        estimatedTime: "20 min",
        howToComplete: [
          "Review comments on recent posts",
          "Reply thoughtfully to each",
          "Ask follow-up questions to deepen engagement"
        ],
        completed: false
      },
      {
        id: Date.now() + 4,
        title: "Research trending topics in your niche",
        impact: "low",
        points: 100,
        category: "content",
        estimatedTime: "15 min",
        howToComplete: [
          "Check trending hashtags in your niche",
          "Review what competitors are posting",
          "Note ideas for future content"
        ],
        completed: false
      },
      {
        id: Date.now() + 5,
        title: "Batch create 5 content pieces",
        impact: "high",
        points: 250,
        category: "content",
        estimatedTime: "1 hour",
        howToComplete: [
          "Set aside focused time",
          "Create multiple pieces in one session",
          "Schedule them for the week"
        ],
        completed: false
      }
    ],
    marketing: [
      {
        id: Date.now() + 1,
        title: "Run a targeted ad campaign",
        impact: "high",
        points: 300,
        category: "marketing",
        estimatedTime: "45 min",
        howToComplete: [
          "Define your target audience",
          "Create ad creative and copy",
          "Launch campaign and monitor performance"
        ],
        completed: false
      },
      {
        id: Date.now() + 2,
        title: "Analyze campaign performance metrics",
        impact: "medium",
        points: 200,
        category: "marketing",
        estimatedTime: "30 min",
        howToComplete: [
          "Review analytics from recent campaigns",
          "Identify top-performing content",
          "Adjust strategy based on insights"
        ],
        completed: false
      },
      {
        id: Date.now() + 3,
        title: "Create a lead magnet or freebie",
        impact: "high",
        points: 250,
        category: "marketing",
        estimatedTime: "1 hour",
        howToComplete: [
          "Choose valuable content to offer",
          "Design and create the lead magnet",
          "Set up landing page and email capture"
        ],
        completed: false
      },
      {
        id: Date.now() + 4,
        title: "Engage in 3 relevant communities",
        impact: "medium",
        points: 150,
        category: "marketing",
        estimatedTime: "30 min",
        howToComplete: [
          "Find active communities in your niche",
          "Share valuable insights",
          "Build relationships with members"
        ],
        completed: false
      },
      {
        id: Date.now() + 5,
        title: "Update website SEO and meta descriptions",
        impact: "low",
        points: 100,
        category: "marketing",
        estimatedTime: "20 min",
        howToComplete: [
          "Review key pages",
          "Optimize titles and descriptions",
          "Add relevant keywords"
        ],
        completed: false
      }
    ],
    skills: [
      {
        id: Date.now() + 1,
        title: "Complete a focused learning session",
        impact: "high",
        points: 250,
        category: "skills",
        estimatedTime: "1 hour",
        howToComplete: [
          "Choose a skill to develop",
          "Watch tutorial or read resource",
          "Practice what you learned"
        ],
        completed: false
      },
      {
        id: Date.now() + 2,
        title: "Apply new skill to a real project",
        impact: "high",
        points: 300,
        category: "skills",
        estimatedTime: "1 hour",
        howToComplete: [
          "Identify a project to work on",
          "Use your new skill in practice",
          "Document what you learned"
        ],
        completed: false
      },
      {
        id: Date.now() + 3,
        title: "Teach someone else what you learned",
        impact: "medium",
        points: 200,
        category: "skills",
        estimatedTime: "30 min",
        howToComplete: [
          "Explain concept to a friend or colleague",
          "Create a simple tutorial or post",
          "Answer questions about the topic"
        ],
        completed: false
      },
      {
        id: Date.now() + 4,
        title: "Review and practice previous lessons",
        impact: "medium",
        points: 150,
        category: "skills",
        estimatedTime: "30 min",
        howToComplete: [
          "Review notes from past learning",
          "Practice exercises or drills",
          "Identify areas needing more practice"
        ],
        completed: false
      },
      {
        id: Date.now() + 5,
        title: "Research advanced techniques in your skill",
        impact: "low",
        points: 100,
        category: "skills",
        estimatedTime: "20 min",
        howToComplete: [
          "Search for advanced resources",
          "Watch expert tutorials",
          "Take notes on key concepts"
        ],
        completed: false
      }
    ]
  };

  // Return category-specific tasks or general tasks
  const tasks = categoryTasks[category] || [
    {
      id: Date.now() + 1,
      title: `Work on ${goalTitle}`,
      impact: "high",
      points: 200,
      category: category,
      estimatedTime: "30 min",
      howToComplete: [
        "Break down your goal into specific steps",
        "Focus on one actionable task",
        "Track your progress"
      ],
      completed: false
    },
    {
      id: Date.now() + 2,
      title: "Review and update your progress",
      impact: "medium",
      points: 150,
      category: category,
      estimatedTime: "15 min",
      howToComplete: [
        "Check your current progress",
        "Identify what's working",
        "Adjust your strategy if needed"
      ],
      completed: false
    },
    {
      id: Date.now() + 3,
      title: "Research best practices in your niche",
      impact: "low",
      points: 100,
      category: category,
      estimatedTime: "20 min",
      howToComplete: [
        "Find resources in your category",
        "Read or watch tutorials",
        "Take notes on key insights"
      ],
      completed: false
    }
  ];

  // Return 10 tasks (repeat some if needed to reach 10)
  const fullList = [];
  for (let i = 0; i < 10; i++) {
    const task = tasks[i % tasks.length];
    fullList.push({
      ...task,
      id: Date.now() + i + 1
    });
  }

  return fullList;
}

