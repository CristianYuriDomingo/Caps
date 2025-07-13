// app/api/admin/quizzes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all quizzes
export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}

// POST - Create a new quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, timer, questions } = body;

    // Validate required fields
    if (!title || !questions || questions.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one question are required' },
        { status: 400 }
      );
    }

    // Create quiz with questions - NO creator field needed
    const quiz = await prisma.quiz.create({
      data: {
        title,
        timer: timer || 30,
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            lesson: q.lesson,
            image: q.image || null,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || null
          }))
        }
      },
      include: {
        questions: true
      }
    });

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Failed to create quiz' },
      { status: 500 }
    );
  }
}