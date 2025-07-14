// FILE 4: app/api/users/quizzes/[id]/retake/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST - Allow user to retake a quiz (resets session)
export async function POST(
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

    // Reshuffle questions for retake
    const shuffledQuestions = quiz.questions.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      ...quiz,
      questions: shuffledQuestions,
      retake: true
    });
  } catch (error) {
    console.error('Error setting up quiz retake:', error);
    return NextResponse.json(
      { error: 'Failed to set up quiz retake' },
      { status: 500 }
    );
  }
}