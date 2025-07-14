// FILE 3: app/api/users/quizzes/[id]/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number; // Time spent on this question in seconds
}

interface SubmissionData {
  answers: UserAnswer[];
  totalTime: number; // Total time spent on quiz
}

// POST - Submit quiz answers and get results
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: SubmissionData = await request.json();
    const { answers, totalTime } = body;

    // Validate submission
    if (!answers || answers.length === 0) {
      return NextResponse.json(
        { error: 'No answers provided' },
        { status: 400 }
      );
    }

    // Fetch quiz with correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          select: {
            id: true,
            question: true,
            lesson: true,
            image: true,
            options: true,
            correctAnswer: true,
            explanation: true
          }
        }
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Calculate results
    const results = answers.map(userAnswer => {
      const question = quiz.questions.find(q => q.id === userAnswer.questionId);
      
      if (!question) {
        return {
          questionId: userAnswer.questionId,
          correct: false,
          error: 'Question not found'
        };
      }

      const isCorrect = userAnswer.selectedAnswer === question.correctAnswer;
      
      return {
        questionId: userAnswer.questionId,
        question: question.question,
        lesson: question.lesson,
        image: question.image,
        options: question.options,
        userAnswer: userAnswer.selectedAnswer,
        correctAnswer: question.correctAnswer,
        correct: isCorrect,
        explanation: question.explanation,
        timeSpent: userAnswer.timeSpent
      };
    });

    // Calculate statistics
    const correctAnswers = results.filter(r => r.correct).length;
    const totalQuestions = results.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Determine pass/fail (you can adjust this threshold)
    const passingScore = 70;
    const passed = percentage >= passingScore;

    // Group results by lesson for detailed feedback
    const lessonResults = results.reduce((acc, result) => {
      if (!result.lesson) return acc;
      
      if (!acc[result.lesson]) {
        acc[result.lesson] = {
          lesson: result.lesson,
          total: 0,
          correct: 0,
          questions: []
        };
      }
      
      acc[result.lesson].total++;
      if (result.correct) {
        acc[result.lesson].correct++;
      }
      acc[result.lesson].questions.push(result);
      
      return acc;
    }, {} as Record<string, any>);

    // Calculate lesson percentages
    Object.values(lessonResults).forEach((lesson: any) => {
      lesson.percentage = Math.round((lesson.correct / lesson.total) * 100);
    });

    const response = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      summary: {
        totalQuestions,
        correctAnswers,
        percentage,
        passed,
        passingScore,
        totalTime,
        averageTimePerQuestion: Math.round(totalTime / totalQuestions)
      },
      results,
      lessonBreakdown: Object.values(lessonResults),
      recommendations: generateRecommendations(lessonResults, passed)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing quiz submission:', error);
    return NextResponse.json(
      { error: 'Failed to process quiz submission' },
      { status: 500 }
    );
  }
}

// Helper function to generate recommendations
function generateRecommendations(lessonResults: Record<string, any>, passed: boolean) {
  const recommendations = [];
  
  if (!passed) {
    recommendations.push({
      type: 'overall',
      message: 'Consider reviewing the materials and retaking the quiz to improve your score.'
    });
  }

  // Check for weak areas
  Object.values(lessonResults).forEach((lesson: any) => {
    if (lesson.percentage < 60) {
      recommendations.push({
        type: 'lesson',
        lesson: lesson.lesson,
        message: `Focus on studying ${lesson.lesson} - you scored ${lesson.percentage}% in this area.`
      });
    } else if (lesson.percentage >= 90) {
      recommendations.push({
        type: 'strength',
        lesson: lesson.lesson,
        message: `Great job on ${lesson.lesson}! You scored ${lesson.percentage}%.`
      });
    }
  });

  return recommendations;
}
