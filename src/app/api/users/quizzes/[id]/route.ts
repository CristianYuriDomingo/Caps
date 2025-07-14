// FILE 2: app/api/users/quizzes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch quiz questions for users (without correct answers)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        timer: true,
        questions: {
          select: {
            id: true,
            question: true,
            lesson: true,
            image: true,
            options: true,
            // Don't include correctAnswer or explanation
          },
          orderBy: {
            createdAt: 'asc'
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

    // Shuffle questions order for each user session
    const shuffledQuestions = quiz.questions.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      ...quiz,
      questions: shuffledQuestions
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}