// FILE 1: app/api/users/quizzes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all quizzes for users (simplified view)
export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        timer: true,
        createdAt: true,
        questions: {
          select: {
            id: true,
            lesson: true,
            // Don't include question text, options, or correct answers
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data for user consumption
    const userQuizzes = quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      timer: quiz.timer,
      questionCount: quiz.questions.length,
      lessons: [...new Set(quiz.questions.map(q => q.lesson))], // Unique lessons
      createdAt: quiz.createdAt
    }));

    return NextResponse.json(userQuizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}
